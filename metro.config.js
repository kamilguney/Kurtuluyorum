const { getDefaultConfig } = require("expo/metro-config");
const { writeUiModule } = require("./expo/generate-ui.cjs");

writeUiModule(__dirname);
module.exports = getDefaultConfig(__dirname);
