const webpack = require('webpack');
const path = require('path');

const config = {
    entry: './src/index.js',
    'react/jsx-runtime': require.resolve('react/jsx-runtime'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    }
};

module.exports = config;