'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

/**
 * 多入口 配置
 * @type {{output: {path: *, filename: string, publicPath: string}, entry: {system: string, admin: string}, node: {setImmediate: boolean, dgram: string, tls: string, child_process: string, net: string, fs: string}, resolve: {extensions: string[], alias: {'@': *, '@admin': *, '@system': *, vue$: string}}, module: {rules: [...{include: *[], test: RegExp, loader: string, options: {formatter: function(*=): *|string, emitWarning: boolean}, enforce: string}[]|*[], {test: RegExp, loader: string, options: {loaders: {css: *|string[], styl: *|string[], scss: *|string[], stylus: *|string[], less: *|string[], sass: *|string[], postcss: *|string[]}, transformToRequire: {image: string, img: string, video: string[], source: string}, cssSourceMap: boolean, cacheBusting: boolean}|{loaders?: {css: *|string[], styl: *|string[], scss: *|string[], stylus: *|string[], less: *|string[], sass: *|string[], postcss: *|string[]}, cssSourceMap?: boolean, cacheBusting?: boolean, transformToRequire?: {image: string, img: string, video: string[], source: string}}}, {include: *[], test: RegExp, loader: string}, {test: RegExp, loader: string, options: {limit: number, name: *}}, {test: RegExp, loader: string, options: {limit: number, name: *}}, {test: RegExp, loader: string, options: {limit: number, name: *}}]}, context}}
 */
module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    system: './src/pages/system/main.js',
    admin: './src/pages/admin/main.js',
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('/src'),
      '@system': resolve('/src/pages/system'),
      '@admin': resolve('/src/pages/admin'),
    }
  },
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
