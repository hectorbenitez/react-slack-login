module.exports = {
  externals: {
    'react': 'react'
  },
  output: {
    filename: './react-slack-login.js',
    library: 'react-slack-login',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: { presets: ['@babel/env', '@babel/preset-react'] }
      }
    ]
  },
  resolve: { extensions: ["*", ".js", ".jsx"] }
}
