var path = __dirname + "/public/js/";
var webpack = require("webpack");

new webpack.DefinePlugin({
    'process.env.NODE_ENV': '"production"'
});

module.exports = {
    entry: [
        path + "index.js"
    ],
    output: {
        path: path,
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {test: /\.js$/, loader: "jsx!babel"},
            {test: /\.css$/, loader: "style!css"}
        ]
    }
};