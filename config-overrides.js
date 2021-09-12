const path = require('path');
const {
  override,
  addWebpackAlias,
  addLessLoader,
  fixBabelImports,
} = require('customize-cra');

const isDev = process.env.NODE_ENV === 'development';

module.exports = override(
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src'),
  }),
  addLessLoader({
    strictMath: true,
    noIeCompat: true,
    javascriptEnabled: true,
    cssLoaderOptions: {
      modules: {
        localIdentName: isDev
          ? '[path]_[local]_[hash:base64:5]'
          : '[hash:base64]',
      },
    },
  })
  // fixBabelImports("import", {
  //   libraryName: "antd",
  //   libraryDirectory: "es",
  //   style: true,
  // })
);
