import { defineConfig } from '@umijs/max';
import routes from './routes';

//@ts-ignore
const path = process.env.NODE_ENV === 'development' ? '/' : './';

export default defineConfig({
  routes,
  hash: true,
  history: {
    type: 'hash',
  },
  title: 'BoxJs',
  //打包路径
  // base: path,
  publicPath: path,
  codeSplitting: {
    jsStrategy: 'granularChunks'
  },
  metas: [
    {
      'http-equiv': 'Permissions-Policy',
      content: 'interest-cohort=()',
    },
  ],

  model: {},
  antd: false,
  request: {},
  initialState: {},
  npmClient: 'pnpm',
  locale: {
    antd: false, // 如果项目依赖中包含 `antd`，则默认为 true
    baseNavigator: false,
    baseSeparator: '-',
    default: 'zh-CN',
    title: false,
    useLocalStorage: true,
  },
  chainWebpack: function (config) {
    config.merge({
      optimization: {
        minimize: true,
        splitChunks: {
          chunks: 'async',
          minSize: 30000,
          minChunks: 1,
          automaticNameDelimiter: '.',
          cacheGroups: {
            mui: {
              name: 'mui',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](@mui)/,
              priority: 10,
            },
            vendors: {
              name: 'vendors',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](lodash|moment|react|dva|postcss|mapbox-gl)/,
              priority: 10,
            },
            commons: {
              name: 'commons',
              // 其余同步加载包
              chunks: 'all',
              minChunks: 2,
              priority: 1,
              // 这里需要注意下，webpack5会有问题， 需加上这个 enforce: true，
              // refer: https://github.com/webpack-contrib/mini-css-extract-plugin/issues/257#issuecomment-432594711
              enforce: true,
            },
          },
        },
      },
    });
  },
  analyze: {
    analyzerMode: 'server',
    analyzerPort: 8888,
    openAnalyzer: true,
    // generate stats file while ANALYZE_DUMP exist
    generateStatsFile: false,
    statsFilename: 'stats.json',
    logLevel: 'info',
    defaultSizes: 'parsed', // stat  // gzip
  },
});