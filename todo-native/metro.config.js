const { getDefaultConfig } = require("expo/metro-config");
const config = getDefaultConfig(__dirname);

const localPackagePaths = ["../todo-protocol"];

config.resolver = { nodeModulesPaths: [...localPackagePaths] };
config.watchFolders = [...localPackagePaths];

module.exports = config;
