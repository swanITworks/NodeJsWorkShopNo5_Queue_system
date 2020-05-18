module.exports = {
  entry: {
    agent: './src/client/agent.js',
    client: './src/client/client.js',
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js'],
  },
  output: {
    path: `${__dirname}/src/public`,
    publicPath: '/src/public'
  },
  devServer: {
    contentBase: './src/public',
  },
};
