const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry:['babel-polyfill','./src/js/app.js'],
    output:{
        path: path.resolve(__dirname,'dist'), //trying to inject js to a HTML that is in the same folder
        filename:'js/bundle.js'
    },
    devServer:{
        contentBase:'./dist',
    },
    plugins:[
        new HTMLWebpackPlugin({
            filename:'index.html',
            template:'./index.html',
        })
    ],
    module:{
        rules:[
            {
                test:/\.js$/,
                exclude:/node_modules/,
                use:{
                    loader:'babel-loader',
                }
            }
        ]
    }
}