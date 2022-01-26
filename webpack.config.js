const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
    mode: 'development', // 开发模式
    entry: {
        main: path.resolve(__dirname,'./src/main.js'),    // 首页入口
        login: path.resolve(__dirname,'./src/login.js'),    // 登录页入口
    },
    output: {
        filename: '[name].[hash:8].js',      // 打包后的文件名称
        path: path.resolve(__dirname,'./dist')  // 打包后的目录
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']     // 从右向左解析原则
            },
            {
                test: /\.less$/,
                use: [
                    // 'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        'postcss-preset-env'
                                    ]
                                ]
                            }
                        }
                    },
                    'less-loader'
                ]  // 从右向左解析原则
            },
            {
                test: /\.(jpe?g|png|gif)$/, // 图片文件处理并移动到输出目录
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            name: '[name]_[hash].[ext]',
                            outputPath: 'images/'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ // 由插件处理往html里面去插入js的chunk文件
            template: path.resolve(__dirname, './public/index.html'),
            filename: 'index.html',
            chunks: ['main'],
            inject: 'body'
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './public/login.html'),
            filename: 'login.html',
            chunks: ['login'],
            inject: 'body'
        }),
        new CleanWebpackPlugin(),   // 每次重新构建的时候都清空输出目录（dist）

        // css样式单独打包出来（但这个会将所有的css样式合并为一个css文件，如果需要拆分一一对应，则需要用extract-text-webpack-plugin）
        new MiniCssExtractPlugin({
            filename: "[name].[hash].css",
            chunkFilename: "[id].css"
        })
    ]
}