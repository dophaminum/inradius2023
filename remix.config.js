/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
  serverDependenciesToBundle: [
    // /^@?react-leaflet.*/,
    // "@react-leaflet/core",
    // "leaflet",
    /^ranges-.*/,
    /^string-.*/,
    /^@ant-design.*/,
    /^antd.*/,
    /^rc-.*/,
    /^@babel\/runtime\/helpers\/esm.*/,
  ],
};
