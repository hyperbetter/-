const {override, fixBabelImports, addLessLoader} = require('customize-cra');
module.exports = override(
  // 针对antd实现按需打包：（使用babel-plugin-import）根据import来打包
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    // 自动打包相关的样式
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {'@primary-color': '#1DA57A'},
  }),
);