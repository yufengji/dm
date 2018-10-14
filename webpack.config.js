const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');
const uglify = require('uglifyjs-webpack-plugin');
var es3ifyPlugin = require('es3ify-webpack-plugin');
const templateFunction = function (data) {
    const imageName = data.spritesheet.image.match(/[^\/\\]+$/)[0].replace(/\.\w+$/, '');
    const shared = '%' + imageName + '{ background-image: url(' + data.sprites[0].image + ');background-repeat: no-repeat; background-size: ' + data.spritesheet.width / 2 + 'px ' + data.spritesheet.height / 2 + 'px;}';
    const perSprite = data.sprites.map(function (sprite) {
        if (sprite.offset_x) {
            var pX = sprite.offset_x / (sprite.width - sprite.total_width) * 100 + '%'
        } else {
            var pX = 0;
        }
        if (sprite.offset_y) {
            var pY = sprite.offset_y / (sprite.height - sprite.total_height) * 100 + '%'
        } else {
            var pY = 0;
        }
        return '@mixin N { width: W; height:H; background-position: X Y; }'
            .replace('N', sprite.name)
            .replace('W', sprite.width / 2 + 'px')
            .replace('H', sprite.height / 2 + 'px')
            .replace('X', pX)
            .replace('Y', pY);
    }).join('\n');

    return shared + '\n' + perSprite;
};
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/index.js'
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {loader: 'es3ify-loader'},
                    {loader: 'babel-loader', options: {
                        presets:['es2015','es2015-loose']
                    }}
                ]
            }
        ]
    },
    devServer: {
        // contentBase: path.resolve(__dirname, 'dist'),
        host: '127.0.0.1',
        compress: true,
        port: 80
    },
    externals: {
        jquery: 'jquery'
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            template: './src/index.html'
        }),

        new copyWebpackPlugin([
            {from: './src/images', to: 'images/'},
            {from: './src/js', to: 'js/'},
            {from: './src/css', to: 'css/'}
        ]),
        new es3ifyPlugin(),
        new uglify({
            uglifyOptions: {
                ie8: true
            }
        })
    ]
}
