const path = require('path')

module.exports = {
  mode: 'development',
  target: 'node',
  entry: {
    main: path.resolve(__dirname,'../index.js')
  },
  output: {
    filename: 'skeletons.test.js',
    path: path.resolve(__dirname,'../dist'),
    libraryTarget: 'commonjs',
  },
}