
var gulp= require('gulp');
var gutil= require('gulp-util');
var uglify= require('gulp-uglify');
var concat= require('gulp-concat');
var html2js= require('gulp-ng-html2js');//使用这个
var clean=require('gulp-clean');
var minifycss = require('gulp-minify-css'); // CSS压缩
var cleancss = require('gulp-clean-css'); // CSS压缩
var notify=require('gulp-notify'); //消息通知
var karma = require('gulp-karma');//测试
//var inject = require("gulp-inject");//依赖注入
var rename = require("gulp-rename");//重命名
var run = require('gulp-run');//运行命令行

var insert = require('gulp-insert');//文件中插入字符串
var intercept = require('gulp-intercept');//文件拦截
var jsoncombine=require('gulp-jsoncombine');//合并json
//var x=require('jquery-mousewheel');

gulp.task('buildJS', function() {
    gulp.src(['../angular-touch/angular-touch.js','../angular-ui-router/release/angular-ui-router.js','../angular-bootstrap/ui-bootstrap-tpls.js',
        '../angular-animate/angular-animate.js','../angular-sanitize/angular-sanitize.js','../ngstorage/ngStorage.js',
        '../bootstrap/js/transition.js','../angular-ace/js/ace-small.js','../angular-ace/js/ace-elements.js','../angular-ace/js/ace.js',
        '../angular-chart/Chart.js','../layer-v2.4/layer/layer.js','../bootstrap/dist/js/bootstrap.js',
        '../jQuery-mCustomScrollbar/jquery.mCustomScrollbar.concat.min.js',
    ])
        .pipe(concat('dist-platform-lib-all-1.0.0.js'))
		.pipe(gulp.dest('./release/js'))
		.pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('./release/js'))
		.pipe(notify("=======构建成功！！======"));
});

// themes 相关
gulp.task('buildCSS', function(){
    gulp.src('./dist-platform-lib-all-1.0.0.css')
        .pipe(cleancss())
        .pipe(gulp.dest('./release/css/'))
    gulp.src('../angular-ace/fonts/**')
        .pipe(gulp.dest('./release/angular-ace/fonts/'))
	gulp.src('../bootstrap/dist/fonts/**')
        .pipe(gulp.dest('./release/bootstrap/dist/fonts/'))
	gulp.src('../font-awesome/fonts/**')
        .pipe(gulp.dest('./release/font-awesome/fonts/'))
    gulp.src('../angular-ace/images/**')
        .pipe(gulp.dest('./release/angular-ace/images/'))
	gulp.src('../layer-v2.4/layer/skin/default/**')
        .pipe(gulp.dest('./release/layer-v2.4/layer/skin/default/'))
    gulp.src('../jQuery-mCustomScrollbar/mCSB_buttons.png')
        .pipe(gulp.dest('./release/jQuery-mCustomScrollbar/'))
		.pipe(notify("=======构建成功！！======"))
		 gulp.run('clearTemp')
});
//清除build/下的template目录
gulp.task('clearTemp',function(){
    gulp.src(['release/template'],{read: false})
        .pipe(clean())
})

//默认任务，先运行测试，测试完毕后自动构建并生成帮助文档
gulp.task('default',['test'],function(){
    //run('gulp build').exec();//执行命令行时使用
    gulp.run('doc');
});