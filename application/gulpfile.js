/**
 * Created by francis on 17-5-11.
 */
const gulp = require('gulp');//导入gulp
const less = require('gulp-less'); //导入less, less可以让我们像写程序那样写css，从而提高写css效率
const autoprefixer = require('gulp-autoprefixer');//gulp-autoprefixer, 可以在css中自动补全zom-,ms-这样的前缀
const strip = require('gulp-strip-comments');//从css和js文件中删除注释
const minifyCSS    = require('gulp-clean-css');
const babel = require("gulp-babel");//导入babel
const concat = require('gulp-concat');//把多个文件合并到一个文件中

/*******************************
 下面是和css相关的任务,不会less的同学不必理会这里.
 *******************************/
var src_less = './*.less'; //less文件的位置
var dist = './web/css'; //输出css的位置

//名为"css"的任务, 该任务把less文件编译成css文件，不会less的同学不必理会这里
gulp.task('css', function () {
    return gulp.src(src_less)
        .pipe(less())
        // .pipe(minifyCSS())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie >= 9']
        }))
        .pipe(gulp.dest(dist));
});

//名为"watchcss"的任务, 该任务监视less文件，当这些文件发生变化时，执行上面定义的名为"css"的任务
gulp.task('watchcss', ['css'], function() {
    gulp.watch(src_less, ['less']);
});

/**
 *下面是和js相关的任务.
 */
//定义需要处理的js文件
var jsfiles = [
    'web/js/es6/Pagination.js',
    'web/js/es6/Model.js',
    'web/js/es6/AbstractView.js',
    'web/js/es6/ListView.js',
    'web/js/es6/GridView.js',
    'web/js/es6/MapView.js',
    'web/js/es6/Controller.js',
];
//名为"js"的任务, 该任务处理变量jsfiles中定义的js文件数组.
gulp.task('js',function(){
    gulp.src(jsfiles)
        .pipe(babel({presets: ['es2015']})) // 用babel把es6转成es5
        .pipe(concat('mvc.js')) //把所有js文件合并到名为mvc.js的文件中
        // .pipe(strip())
        // .pipe(uglify({'mangle':false}))
        .pipe(gulp.dest('web/js/')); //保存到 web/js/ 目录中
});
