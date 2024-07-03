const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const path = require('path')
const Dotenv = require('dotenv-webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const srcPath = path.resolve(__dirname, 'src')
const packagesPath = path.resolve(__dirname, 'packages')

function resolvePathInput(input) {
  return path.isAbsolute(input) ? input : path.resolve(process.cwd(), input)
}

const buildTarget = process.env.TARGET
const buildTargetOutputMap = {
  safari: 'Safari/Gitako/Gitako Extension/Resources',
}
const envOutputDir = process.env.OUTPUT_DIR || buildTargetOutputMap[buildTarget]
const outputPath = envOutputDir ? resolvePathInput(envOutputDir) : path.resolve(__dirname, 'dist')

const IN_PRODUCTION_MODE = process.env.NODE_ENV === 'production'
const plugins = [
  new CopyWebpackPlugin([
    {
      from: './src/manifest.json',
      to: 'manifest.json',
      transform(content) {
        const { version, description, author, homepage: homepage_url } = require('./package.json')
        const manifest = JSON.parse(content)
        Object.assign(manifest, {
          version,
          description,
          author,
          homepage_url,
        })

        // Disable custom domains for Safari
        if (buildTarget === 'safari') {
          Reflect.deleteProperty(manifest, 'optional_permissions')
          Reflect.deleteProperty(manifest, 'background')
        }

        if (!IN_PRODUCTION_MODE) {
          Object.assign(manifest, {
            web_accessible_resources: manifest.web_accessible_resources.concat('*.map'), // enable source mapping while developing
          })
        }
        return JSON.stringify(manifest)
      },
    },
    {
      from: './src/assets/icons/*',
      to: 'icons/[name].[ext]',
    },
    {
      from: './vscode-icons/icons/*',
      to: 'icons/vscode/[name].[ext]',
    },
    {
      from: 'node_modules/webextension-polyfill/dist/browser-polyfill.js',
      to: 'browser-polyfill.js',
    },
    {
      from: './src/firefox-shim.js',
      to: 'firefox-shim.js',
    },
  ]),
  new ForkTsCheckerWebpackPlugin(),
  new Dotenv(),
  new MiniCssExtractPlugin(),
]

const analyze = process.env.ANALYZE !== undefined
if (analyze) {
  plugins.push(new BundleAnalyzerPlugin())
  console.log(`BundleAnalyzerPlugin added`)
}

plugins.push(
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.VERSION': JSON.stringify(process.env.VERSION),
  }),
)

module.exports = {
  entry: {
    content: './src/content.tsx',
    background: './src/background.ts',
  },
  devtool: IN_PRODUCTION_MODE ? 'source-map' : 'inline-source-map',
  mode: IN_PRODUCTION_MODE ? 'production' : 'development',
  output: {
    path: outputPath,
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    modules: [srcPath, packagesPath, 'node_modules'],
    mainFields: ['main', 'exports'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
        include: [srcPath, packagesPath],
        exclude: /node_modules/,
        sideEffects: false,
      },
      {
        test: /\.[cm]?js$/,
        loader: 'babel-loader',
        // Transpile as least files under node_modules
        include: new RegExp(
          [
            ``,
            `node_modules`,
            `(${[
              `superstruct`,
              `webext-alert`,
              `webext-content-scripts`,
              `webext-detect-page`,
              `webext-detect`,
              `webext-dynamic-content-scripts`,
              `webext-events`,
              `webext-permission-toggle`,
              `webext-permissions`,
              `webext-tools`,
            ].join('|')})`,
            ``,
          ].join('/'),
        ),
        options: {
          cacheDirectory: true,
        },
      },
      {
        test: /\.scss$/,
        loader: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        include: [srcPath],
      },
      {
        test: /\.svg$/,
        resourceQuery: /inline/,
        loader: ['url-loader'],
      },
      {
        test: /\.csv$/,
        loader: ['raw-loader'],
      },
      {
        test: /\.json$/,
        loader: ['json-loader'],
        include: [srcPath],
      },
      {
        test: /\.png$/,
        loader: ['url-loader'],
        include: [srcPath],
      },
    ],
  },
  plugins,
}
