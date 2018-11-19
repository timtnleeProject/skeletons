const path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    main: path.resolve(__dirname,'../index.js')
  },
  output: {
    filename: 'skeletons.min.js',
    path: path.resolve(__dirname,'../dist'),
    library: 'Skeletons',
    libraryTarget: 'window',
  },
}