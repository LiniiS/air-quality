const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Registra .lottie como asset binário (formato dotLottie)
config.resolver.assetExts.push('lottie');

module.exports = config;
