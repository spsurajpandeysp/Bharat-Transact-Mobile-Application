module.exports = {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env', // Optional: specify the path to your .env file
        },
      ],
    ],
  };
  