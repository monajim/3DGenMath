const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,

  chainWebpack: config => {
    // Add a loader for OBJ files
    config.module
      .rule('obj')
      .test(/\.(obj)$/)
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[ext]', // Output path for OBJ files
      });
  },
});
