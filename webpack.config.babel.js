import path from 'path'
import fs from 'fs'

import webpack from 'webpack'
import externals from 'webpack-node-externals'
import OnBuildPlugin from 'on-build-webpack'

export default {
  entry: {
    app: path.resolve(__dirname, 'lib', 'index.js')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  externals: [
    externals()
  ],
  target: 'node',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'lib')
        ],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  'env',
                  {
                    targets: {
                      node: 'current'
                    }
                  }
                ]
              ],
              plugins: [
                'transform-runtime',
                'transform-async-to-generator'
              ]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: '#!/usr/bin/env node',
      raw: true
    }),
    new OnBuildPlugin((stats) => {
      fs.chmodSync('dist/app.js', '750')
    })
  ]
}
