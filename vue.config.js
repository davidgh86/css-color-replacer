const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    devtool: "source-map",
  },
  // chainWebpack: (config) => {
  //   config.module
  //     .rule("vue")
  //     .use("vue-loader")
  //     .tap((options) => ({
  //       ...options,
  //       compilerOptions: {
  //         // treat any tag that starts with ion- as custom elements
  //         isCustomElement: (tag) => tag.startsWith("native-"),
  //       },
  //     }));
  // },
});
