// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
module.exports = {
    resolver: {
      assetExts: ['svg', 'png', 'jpg', 'jpeg'],
    },
  };
module.exports = getDefaultConfig(__dirname);
