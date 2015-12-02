module.exports = {
  angular:{
    src:[
      'src/vendor/jquery/jquery.min.js',
      'src/vendor/angular/angular.js',
      'src/vendor/angular/**/*.js',
      'src/js/*.js',
      'src/js/directives/*.js',
      'src/js/services/*.js',
      'src/js/filters/*.js',
      'src/js/controllers/bootstrap.js'
    ],
    dest:'angular/js/dist.js'
  },
  html:{
    src:[
      'src/vendor/jquery/jquery.min.js',
      'src/vendor/jquery/*.js'
    ],
    dest:'html/js/app.js'
  }
}