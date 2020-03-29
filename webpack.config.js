//webpack will run the TypeScript compiler and collect the bunch of resulting JS files as well as libraries into one minified JS so that we can include it in our page
const path = require('path');
module.exports = {
  entry: './src/app.ts', // starts compiling from here
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.tsx', '.js' ]
  },
  output: { //where its being dumped
    filename: 'app.js', 
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'development'
};