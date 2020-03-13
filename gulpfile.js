/* * 
 **配置
 */
var gulp = require('gulp')
var babel = require('gulp-babel')
var uglify = require('gulp-uglify')
var fileinclude = require('gulp-file-include')
var htmlmin = require('gulp-htmlmin')
var rev = require('gulp-rev-append')
var minifycss = require('gulp-minify-css')
var sass = require('gulp-sass')
var autoprefixer = require('gulp-autoprefixer')
var postcss = require('gulp-postcss')
var cssnext = require('cssnext')
var precss = require('precss')
var imagemin = require('gulp-imagemin')
var browserSync = require('browser-sync')
var rename = require('gulp-rename')

//输出路径
var test_outdir = "./evaluting";

/***==================任务 stsrt====================== */
/**
 * 将es6编译为可执行的js
 */
gulp.task('test_js', function() {
    return gulp.src(['src/js/*.js', '!src/js/libs/*.js', '!src/js/config.js'])
        /**
         * 使用gulp-babel解决es6，但是只能转换语法，对新的api不能转换，故结合webpack解决
         */
        // gulp-babel
        .pipe(babel({
            presets: ['es2015', 'es2016']
        }))
        .pipe(uglify())

    .pipe(gulp.dest(test_outdir + '/js'))
        .pipe(browserSync.stream());
});

/**
 * 对公用库不编译，进行复制
 */
gulp.task('test_copyjs', function() {
    return gulp.src(['src/js/libs/*.js'])
        .pipe(gulp.dest(test_outdir + '/js/libs'))
        .pipe(browserSync.stream());
});

/**
 * 复制font
 */
gulp.task('test_copy_font', function() {
    return gulp.src(['src/sass/font/*.*'])
        .pipe(gulp.dest(test_outdir + '/css/font'))
        .pipe(browserSync.stream());
});

/**
 * 处理图片资源
 */
gulp.task('test_img', function() {
    return gulp.src(["src/images/*.*", "src/images/**/*.*"])
        // .pipe(imagemin({
        //     progressive: true
        // }))
        .pipe(gulp.dest(test_outdir + "/images"))
        .pipe(browserSync.stream());
});

/**
 * 编译html，引入js css img等 ，并加上版本号，防止浏览器缓存
 */
gulp.task('test_html', function(done) {
    var options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: true, //压缩HTML
        collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
        minifyJS: false, //压缩页面JS
        minifyCSS: true //压缩页面CSS
    };
    return gulp.src(['src/**/*.html', 'src/*.html'])
        .pipe(fileinclude())
        .pipe(htmlmin(options))
        .pipe(gulp.dest(test_outdir))
        .pipe(browserSync.stream());
});


/**
 * 编译sass
 */
gulp.task('test_sass', function() {
    var options = [
        autoprefixer,
        cssnext,
        precss
    ];
    return gulp.src(['src/sass/*.scss', 'src/sass/common/*.css'])
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(postcss(options))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true
        }))
        .pipe(minifycss())
        .pipe(gulp.dest(test_outdir + '/css'))
        .pipe(browserSync.stream());
});

/**
 * 配置文件的处理
 */
gulp.task('test_config', function() {
    return gulp.src('src/js/config.js')
        .pipe(gulp.dest(test_outdir))
        .pipe(browserSync.stream());
});

/**
 * 创建本地开发服务
 */
gulp.task('dev', ['test_js', 'test_copyjs', 'test_copy_font', 'test_img', 'test_html', 'test_sass', 'test_config'], function() {
    browserSync.init({
        server: './'
    });
    gulp.watch("src/js/*.js", ['test_js']);
    gulp.watch(["src/sass/*.scss"], ['test_sass']);
    gulp.watch(["src/images/*", "src/images/**/*"], ['test_img']);
    gulp.watch(["src/views/*.html", "src/*.html"], ['test_html']);
});
/**
 * 创建测试环境项目
 */
gulp.task('build', ['test_js', 'test_copyjs', 'test_copy_font', 'test_img', 'test_html', 'test_sass', 'test_config'], function() {});

/***==================任务 end======================== */