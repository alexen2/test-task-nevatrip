"use strict";

const gulp = require("gulp");
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const uglify = require("gulp-uglify");
const del = require("del");
const browserSync = require("browser-sync").create();
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const sass = require("gulp-sass");
const pug = require("gulp-pug");
const svgstore = require("gulp-svgstore");
const svgmin = require("gulp-svgmin");
const imagemin = require("gulp-imagemin");
const rename = require("gulp-rename");
// const gulpStylelint = require("gulp-stylelint");
const webpack = require("webpack-stream");

let path = {
	build: {
		html: "build/",
		js: "build/js/",
		css: "build/css/",
		img: "build/images/",
		fonts: "build/fonts/",
	},
	src: {
		style: "src/sass/style.scss",
		pug: "src/pages/*.pug",
		img: "src/blocks/**/*.{png,jpg,jpeg,svg,gif}",
		js: "src/blocks/main.js",
		resources_img: "src/resources/images/**/*.*",
		resources_js: "src/resources/js/*.js",
		resources_fonts: "src/resources/fonts/*.{eot,svg,ttf,woff,woff2,otf}",
		resources_css: "src/resources/css/*.css",
		resources: "src/resources/*.*",
		icon: "src/resources/icons/*.svg",
	},
	watch: {
		style: "src/**/*.scss",
		pug: "src/**/*.pug",
		js: "src/**/*.js",
		img: "src/blocks/*.{png,jpg,jpeg,svg,gif}",
		icon: "src/resources/icons/*.svg",
	},
	clean: "./build",
};

let plumberCfg = {
	errorHandler: notify.onError(function (err) {
		return {
			message: err.message,
		};
	}),
};

function style() {
	return gulp
		.src(path.src.style)
		.pipe(plumber(plumberCfg))
		.pipe(sass())
		.pipe(
			autoprefixer({
				overrideBrowserslist: ["last 2 versions"],
				cascade: false,
			})
		)
		.pipe(gulp.dest(path.build.css))
		.pipe(sass({ outputStyle: "compressed" }))
		.pipe(concat("style.min.css"))
		.pipe(gulp.dest(path.build.css));
}
// function lintCssTask() {
// 	return gulp.src(["src/sass/*.scss", "src/blocks/**/*.scss"]).pipe(
// 		gulpStylelint({
// 			reporters: [{ formatter: "string", console: true }],
// 		})
// 	);
// }

function html() {
	return gulp
		.src(path.src.pug)
		.pipe(plumber(plumberCfg))
		.pipe(
			pug({
				pretty: true,
			})
		)
		.pipe(gulp.dest(path.build.html));
}

// function js() {
//   return gulp.src(path.src.js)
//   .pipe(plumber(plumberCfg))
//   .pipe(concat('script.js'))
//   .pipe(gulp.dest(path.build.js))
// }

function js() {
	return gulp
		.src(path.src.js)
		.pipe(
			webpack({
				mode: "production",
				output: {
					filename: "script.js",
				},
				devtool: "source-map",
				module: {
					rules: [
						{
							test: /\.m?js$/,
							exclude: /(node_modules|bower_components)/,
							use: {
								loader: "babel-loader",
								options: {
									presets: [
										[
											"@babel/preset-env",
											{
												corejs: 3,
												useBuiltIns: "usage",
											},
										],
									],
								},
							},
						},
					],
				},
			})
		)
		.pipe(gulp.dest(path.build.js));
}

function images() {
	return gulp
		.src(path.src.img)
		.pipe(rename({ dirname: "" }))
		.pipe(gulp.dest(path.build.img));
}

function icon() {
	return (
		gulp
			.src(path.src.icon)
			.pipe(
				svgmin({
					plugins: [{ removeViewBox: false }],
				})
			)
			/*.pipe(svgmin(function (file) {
	    var prefix = path2.basename(file.relative, path2.extname(file.relative));
	    
	    return {
	      plugins: [{
	        cleanupIDs: {
	          prefix: prefix + '-',
	          minify: true,
	          removeViewBox: false
	        }
	      }]
	    }
	  }))*/
			.pipe(svgstore())
			.pipe(gulp.dest(path.build.img))
	);
}

function resources_images() {
	return gulp
		.src(path.src.resources_img)
		.pipe(rename({ dirname: "" }))
		.pipe(gulp.dest(path.build.img));
}

function resources_js() {
	return gulp.src(path.src.resources_js).pipe(gulp.dest(path.build.js));
}

function resources_fonts() {
	return gulp.src(path.src.resources_fonts).pipe(gulp.dest(path.build.fonts));
}

function resources_css() {
	return gulp.src(path.src.resources_css).pipe(gulp.dest(path.build.css));
}

function resources_other_file() {
	return gulp.src(path.src.resources).pipe(gulp.dest(path.build.html));
}

function watch() {
	gulp.watch(path.watch.style, style);
	gulp.watch(path.watch.pug, html);
	gulp.watch(path.watch.img, images);
	gulp.watch(path.watch.icon, icon);
	gulp.watch(path.watch.js, js);
	// gulp.watch(['src/sass/*.scss', 'src/blocks/**/*.scss'], lintCssTask);
}

function server() {
	browserSync.init({
		server: path.build.html,
	});

	browserSync.watch(path.build.html + "/**/*.*").on("change", browserSync.reload);
}

function clean() {
	return del([path.build.html + "/*"]);
}

gulp.task(
	"default",
	gulp.series(
		clean,
		// lintCssTask,
		style,
		html,
		images,
		icon,
		js,
		resources_images,
		resources_js,
		resources_fonts,
		resources_css,
		resources_other_file,
		gulp.parallel(watch, server)
	)
);

gulp.task(
	"build",
	gulp.series(
		clean,
		// lintCssTask,
		style,
		html,
		images,
		icon,
		js,
		resources_images,
		resources_js,
		resources_fonts,
		resources_css,
		resources_other_file
	)
);
