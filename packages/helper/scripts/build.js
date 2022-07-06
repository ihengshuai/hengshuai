import { builds, getConfig } from './config';
import { terser } from 'rollup-plugin-terser';

const buildConfigs = [];

Object.keys(builds).forEach((type) => {
  const config = getConfig(type);
  const {
    output: { file },
    plugins,
  } = config;
  const minConfig = {
    ...config,
    output: {
      ...config.output,
      file: file.replace(/\.js$/, '.min.js'),
    },
    plugins: [...plugins, terser()],
  };
  buildConfigs.push(config, minConfig);
});

export default buildConfigs;
