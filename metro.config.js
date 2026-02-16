const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Force Metro to resolve the CJS (default) version of packages
// instead of ESM (.mjs) which uses import.meta unsupported in Metro web
config.resolver.unstable_conditionNames = ['react-native', 'require', 'default'];

module.exports = config;
