module.exports = function(api) {
  const presets = ['next/babel'];
  const plugins = [
    [
      'babel-plugin-styled-components',
      {
        ssr: true,
        displayName: true,
        preprocess: false,
      },
    ],
  ];

  return {
    presets,
    plugins,
  };
};
