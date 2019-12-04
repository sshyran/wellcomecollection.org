module.exports = function(api) {
  api.cache(true);

  const presets = ['@weco/common/babel-ts'];

  return {
    presets,
  };
};
