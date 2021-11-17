const path = require("path");

module.exports = {
    entry: {
      content: "./src/content.js"
        // background: "./src/background.js",
        // popup: "./popup/nohorny.js"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js"
  }
};
