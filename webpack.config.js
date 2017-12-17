const path = require('path');

module.exports = {
  entry: './daterangepicker.js',
  context: path.join(__dirname, 'lib/daterangepicker'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  }
};
