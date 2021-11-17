const path = require("path");

module.exports = {
    entry: {
      helpers: "./src/helpers.js",
      content: "./src/content.js",
      sprites: "./src/sprites.js"
        // background: "./src/background.js",
        // popup: "./popup/nohorny.js"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js"
  }
};
