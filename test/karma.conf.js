module.exports = function(karma) {
  karma.configure({
    basePath: './..',
    frameworks: ["jasmine"],
    files: [
      'components/angular/angular.js',
      'components/angular-mocks/angular-mocks.js',

      'src/*.js',
      'test/unit/*.js'
    ],
    browsers: ['Chrome']
  });
};
