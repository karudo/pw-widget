import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import autoprefixer from 'autoprefixer';
import ReplacePlugin from 'replace-bundle-webpack-plugin';
import path from 'path';

const ENV = process.env.NODE_ENV || 'development';

const CSS_MAPS = ENV!=='production';

module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: './index.js',

  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: '/',
    filename: 'bundle.js'
  },

  resolve: {
    extensions: ['', '.jsx', '.js', '.json', '.less'],
    modulesDirectories: [
      path.resolve(__dirname, "src/lib"),
      path.resolve(__dirname, "node_modules"),
      'node_modules'
    ],
    alias: {
      style: path.resolve(__dirname, "src/style")
    }
  },

  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        exclude: path.resolve(__dirname, 'src'),
        loader: 'source-map'
      }
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        // Transform our own .(less|css) files with PostCSS and CSS-modules
        test: /\.(less|css)$/,
        include: [path.resolve(__dirname, 'src/components')],
        loader: [
          'style',
          `css-loader?modules&importLoaders=1&sourceMap=${CSS_MAPS}`,
          'postcss-loader',
          `less-loader?sourceMap=${CSS_MAPS}`
        ].join('!')
      },
      {
        test: /\.(less|css)$/,
        exclude: [path.resolve(__dirname, 'src/components')],
        loader: [
          'style',
          `css?sourceMap=${CSS_MAPS}`,
          `postcss`,
          `less?sourceMap=${CSS_MAPS}`
        ].join('!')
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(xml|html|txt|md)$/,
        loader: 'raw'
      },
      {
        test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
        loader: 'url'
      }
    ]
  },

  postcss: () => [
    autoprefixer({ browsers: 'last 2 versions' })
  ],

  plugins: ([
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(ENV)
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      minify: { collapseWhitespace: true }
    })
  ]).concat(ENV==='production' ? [
      // strip out babel-helper invariant checks
      new ReplacePlugin([{
        // this is actually the property name https://github.com/kimhou/replace-bundle-webpack-plugin/issues/1
        partten: /throw\s+(new\s+)?[a-zA-Z]+Error\s*\(/g,
        replacement: () => 'return;('
      }])
    ] : []),

  stats: { colors: true },

  node: {
    global: true,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
    setImmediate: false
  },

  devtool: ENV==='production' ? 'source-map' : 'cheap-module-eval-source-map',

  devServer: {
    port: process.env.PORT || 8080,
    host: 'localhost',
    colors: true,
    publicPath: '/',
    contentBase: './src',
    historyApiFallback: true,
    open: true,
    proxy: {
      // OPTIONAL: proxy configuration:
      // '/optional-prefix/**': { // path pattern to rewrite
      //   target: 'http://target-host.com',
      //   pathRewrite: path => path.replace(/^\/[^\/]+\//, '')   // strip first path segment
      // }
    }
  }
};
