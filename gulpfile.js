var gulp = require('gulp'),
    childProcess = require('child_process'),
    electron = require('electron-prebuilt');

var gutil = require("gulp-util");
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./webpack.config.js");
  
gulp.task('run',function(callback) {
    childProcess.spawn(electron,["--debug=5858","./main.js"],{stdio:'inherit'})
});

///////////////////////////////////////////////////////////////
// Dev Server Gulp Tasks 
// ----------------------- 
// Task list
// ----------------------- 
// build-dev :
// 		Start a WebPack dev server that listens to file changes and
// 		rebuilds the pack. 
// 		$ gulp build-dev
// 		Make changes to app/ folder and save
// 		App launches after any changes are made
// 		TODO - fix this for first dev launch
// run:
// 		Run electron process
// default:
// 		build-dev only
///////////////////////////////////////////////////////////////

gulp.task("build-dev", ["webpack:build-dev","run"], function() {
	gulp.watch(["app/**/*"], ["webpack:build-dev","run"]);
	//childProcess.spawn(electron,["--debug=5858","./main.js"],{stdio:'inherit'})
});

var myDevConfig = Object.create(webpackConfig);
myDevConfig.devtool = "sourcemap";
myDevConfig.debug = true;
//Only create a single instance of the compiler to allow caching
var devCompiler = webpack(myDevConfig);

gulp.task("webpack:build-dev", function(callback) {
	// run webpack
	devCompiler.run(function(err, stats) {
		if(err) throw new gutil.PluginError("webpack:build-dev", err);
		gutil.log("[webpack:build-dev]", stats.toString({
			colors: true
		}));
		callback();
	});
});

gulp.task("webpack-dev-server",["webpack"], function(callback) {
    // modify some webpack config options
	var myConfig = Object.create(webpackConfig);
	myConfig.devtool = "eval";
	myConfig.debug = true;

	// Start a webpack-dev-server
	new WebpackDevServer(webpack(myConfig), {
		publicPath: "/" + myConfig.output.publicPath,
		stats: {
			colors: true
		}
	}).listen(8080, "localhost", function(err) {
		if(err) throw new gutil.PluginError("webpack-dev-server", err);
		gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
	});
});

gulp.task("default", ["build-dev"]);