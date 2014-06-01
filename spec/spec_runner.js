var jsdom = require("jsdom");
var fs = require('fs');
var assert = require("assert");
var should = require('should');
var async = require('async');

var afterLoadHtml = function(fname, cb){
  jsdom.env({
    html: fs.readFileSync(__dirname + '/' + fname).toString(),
    scripts: ["http://cdnjs.cloudflare.com/ajax/libs/zepto/1.1.3/zepto.min.js", "../index.js"],
    done: function (errors, window) {
      cb(errors, window);
    }
  });
};

var dateValidator = function(input, options){
  var regexp;
  if(options == 'yyyy/mm/dd'){
      regexp = /[0-9]{4}\/[0-9]{2}\/[0-9]{2}/
  }

  if(!input.match(regexp)){
      return 'Please fill out this filed with ' + options + ' format.';
  }
  return false;
};

describe('mt-validator testing', function(){
  it('In Error case', function(done){

    afterLoadHtml('error.html', function(err, window){

      var $ = window.$;

      $(function(){

        $.mtValidator.fn.date = dateValidator;

        $('#submit').on('click', function(ev){
          ev.preventDefault();
          $('#sampleFrm').mtValidate();
        });

        $('#submit').click();

        var tasks = [];

        var expects = [
          'Please fill out this filed.',
          'Please fill out this filed only ascii charactor.',
          'Please fill out this filed only number.',
          'Please fill out this filed in 0 to 10 character.',
          'Please fill out this filed with yyyy/mm/dd format.',
        ];

        $('.mt-validator-error').each(function(index, el){
          tasks.push(function(cb){
            $(el).html().should.equal(expects[index]);
            cb();
          });
        });

        async.series(tasks, function(){
          done();
        });

      });
    });
  });

  it('In Success case', function(done){

    afterLoadHtml('success.html', function(err, window){

      var $ = window.$;

      $(function(){

        $.mtValidator.fn.date = dateValidator;

        $('#submit').on('click', function(ev){
          ev.preventDefault();
          $('#sampleFrm').mtValidate({
            success: function(){
              var expects = 0;
              $('.mt-validator-error').length.should.equal(expects);
              done();
            }
          });
        });

        $('#submit').click();
      });
    });
  });

});
