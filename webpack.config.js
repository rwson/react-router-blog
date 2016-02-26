var path = __dirname + "/public/js/";

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