const path = require("path");
const { override, addWebpackAlias, addLessLoader, fixBabelImports } = require("customize-cra");

module.exports = override(
  addWebpackAlias({
    "@": path.resolve(__dirname, "src"),
  }),
  addLessLoader({
    strictMath: true,
    noIeCompat: true,
    javascriptEnabled: true,
    cssLoaderOptions: {
      modules: { localIdentName: "[local]_[hash:base64:5]" },
    },
  })
  // fixBabelImports("import", {
  //   libraryName: "antd",
  //   libraryDirectory: "es",
  //   style: true,
  // })
);
