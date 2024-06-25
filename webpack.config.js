const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry:{
        indexEntry:'./src/index.js',
        resetEntry:'./src/reset.css'
    },
    output:{
        filename: '[name].bundle.js',
        path: path.resolve(__dirname,'dist'),
        clean:true,
    },
    devServer:{
        static:'./dist',
    },
    plugins:[
        new HtmlWebpackPlugin({
            title:'To-Do-list',
            template:'./src/index.html',
            filename:'index.html',
        }),
    ],
    module:{
        rules:[
            {
                test:/\.css$/i,
                use:['style-loader','css-loader'],
            },
            {

                test: /\.(png|svg|jpg|jpeg|gif)$/i,
        
                type: 'asset/resource',
        
              },
        ]
        
    },
    optimization:{
        runtimeChunk:'single',
    },
}