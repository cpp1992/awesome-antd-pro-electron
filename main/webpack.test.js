const path = require('path');

module.exports = (config) => {
  const tsLoaderOptions = {
    // use transpileOnly mode to speed-up compilation
    // in the test mode also, because checked during dev or production build
    transpileOnly: true,
    configFile: path.join(__dirname, '../tsconfig.json'),
  };
  config.rules.push({
    test: /\.tsx?$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'ts-loader',
        options: tsLoaderOptions,
      },
    ],
  });
  return config;
}
