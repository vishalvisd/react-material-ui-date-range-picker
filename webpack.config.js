var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = [{
  entry: {
    index: "./src/DateRangePicker.js"
  },
  output: {
    filename: "[name].js",
    libraryTarget: "umd",
    library: "[name]"
  },
  plugins: [
    new ExtractTextPlugin("daterangepicker.css", {
      allChunks: true
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel?presets[]=es2015,presets[]=react,presets[]=stage-0,plugins[]=transform-object-rest-spread"
      },
      {
        test: /\.css$/,
        exclude: [/node_modules/],
        loader: ExtractTextPlugin.extract("style",
          "css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]")
      },
      {
        include: /\.json$/,
        loaders: ["json-loader"]
      }
    ]
  }
}];