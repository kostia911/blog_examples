var gulp = require('gulp'),
    ts = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    merge = require('merge2'),
    del = require('del'),
    rename = require('gulp-rename'),
    runSequence = require('run-sequence'),
    exec = require('child_process').exec,
    spawn = require('child_process').spawn,
    argv = require('yargs').argv;

gulp.task('process-ts', function () {
    var tsProject = ts.createProject('tsconfig.json');
    var tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject))
        .on('error', function() { process.exit(1) });
    return merge([
        tsResult.js
            .pipe(sourcemaps.write({ includeContent: true, sourceRoot: '/src' }))
            .pipe(gulp.dest('./dist')),
        tsResult.dts.pipe(gulp.dest('./dist'))
    ]);
});

gulp.task('clean', function () {
    return del(['dist']);
});


gulp.task('build', () => runSequence('clean', 'process-ts'));

gulp.task('test', (cb) => {
    // Default suite and env values
	var param = argv.specs ? '--specs' : '--suite';
	var value = argv.specs || argv.suite ;

    // Account for windows
	var command = process.platform === 'win32' ? 'node.exe' : 'node';
	var params = ['node_modules/protractor/bin/protractor', param, value];
	
    var child = spawn(command, params);
    child.stdout.on('data', function (data) { process.stdout.write(data); });
    child.stderr.on('data', function (data) { process.stdout.write(data); });
    child.on('close', cb);
});

gulp.task('run', () => runSequence('clean', 'process-ts', 'test'));