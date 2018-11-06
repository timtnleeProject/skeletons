const path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    main: './build.js'
  },
  output: {
    filename: 'skeletons.min.js',
    path: path.resolve(__dirname,'./dist')
  },
}