const path = require('path');
module.exports = {
	entry: './src/index.ts',
	devtool: 'inline-source-map',
	devServer: {
		contentBase: './',
		//publicPath: '/dist/',
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader',
				],
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					'file-loader',
				],
		},
			{
				test: /\.(wav|mp3)$/,
				use: [
					'file-loader',
				],
		},

		]
	},
	resolve: {
		extensions: ['.ts', '.js', '.tsx']
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
};
