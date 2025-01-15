const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('sql'); // Thêm đuôi .sql vào danh sách asset hợp lệ

module.exports = config;
