(function($){

  'use strict';

  var settings = {},
  defaultValidator = {},
  fn = {}
  ;

  settings.messages = {
    required: 'Please fill out this filed.',
    onlyAscii: 'Please fill out this filed only ascii charactor.',
    onlyNum: 'Please fill out this filed only number.',
    range: 'Please fill out this filed in {{range}} character.'
  }

  settings.errorHtml = '<p class="mt-validator-error" style="color:#ff0000;">{{errorMessage}}</p>';

  /** Utility functions **/

  function getMessage(key){
    return settings.messages[key];
  }

  function isEmpty(input){
    return contains(['', 0, false], input);
  }

  function contains(arr, value){
    for(var i in arr){
      if(arr[i] == value){
        return true;
      }
    }
    return false;
  }

  function Range(range){
    var r = range.split('..');
    var begin = parseInt(r[0]), last = parseInt(r[1]);

    return {
      include : function(num){
        return num > begin && num < last;
      },
      first: function() {
        return begin
      },
      end: function() {
        return last
      }
    };
  }

  /** Utility functions **/

  /**
  * @param {object} base
  * @param {object} merge
  */
  function extend(base, merge){
    for(var i in merge){ base[i] = merge[i]; }
    return base;
  }

  defaultValidator.required = function(input){

    if(isEmpty(input)){
      return getMessage('required');
    }

    return false;
  };

  defaultValidator.onlyNum = function(input){
    if(isEmpty(input) || !input.match(/^[0-9]*$/)){
        return getMessage('onlyNum');
    }

    return false;
  };

  defaultValidator.onlyAscii = function(input){

    if(isEmpty(input) || !input.match(/^[a-zA-Z0-9._-]*$/)){
        return getMessage('onlyAscii');
    }

    return false;
  };

  defaultValidator.range = function(input, options){
    var range = new Range(options.option);

    if(!range.include(input.length)){
      return getMessage('range').replace('{{range}}', range.first() + ' to ' + range.end());
    }

    return false;
  };


  /**
  * void mtValidate
  * @param {object} options
  * options.asyncValidation (Not implementd yet.)
  */
  $.fn.mtValidate = function(options){

    if(!options){ options = {};}
    if(!options.asyncValidation){ options.asyncValidation = []; }

    var getErrHtm = function(name){ return settings.errorHtml.replace('{{errorMessage}}', name); };

    $('.mt-validator-error').remove();

    var $form = $(this);

    if($form.attr('enable-mt-valdator') !== undefined){

        // var asyncErros = options.asyncValidation.map(function(arg){
        //
        //     var spt = arg.split(' ');
        //     var inputSelector = spt[1] , id = spt[0] , command = spt[2];
        //
        //     if($(inputSelector)[0] == undefined){
        //         $('[validation-id="'+id+'"]').before(getErrHtm(getMessage('required')));
        //     }
        // });

        var validator = extend(defaultValidator, fn);

        $form.find('input,select').each(function(){
            var $el = $(this);
            if(isEmpty($el.val())){
                if($el.attr('required')){
                    $el.before(getErrHtm(getMessage('required')));
                }
            }

            var rules = $el.attr('validation-rule');
            var message = $el.attr('validation-message');

            if(rules !== undefined && rules !== null){

                var associate = $('[validation-associate='+rules+']');

                var ruleArr = rules.split(',');
                var skip = contains(ruleArr, 'allowEmpty') && isEmpty($el.val());

                if(!skip){

                    ruleArr.forEach(function(r){
                        var rule = r.split('['), option = '';

                        if(rule[1]) option = rule[1];

                        if(validator[rule[0]]){

                            var options = {
                              option: option.replace(/]$/, ''),
                              associates: associate.length > 0 ? associate : null
                            }

                            var error = validator[rule[0]]($el.val(), options)
                            if(error){
                                $el.before(getErrHtm(message || error));
                            }
                        }
                    });
                }
            }
        });

        var hasError = $('.mt-validator-error').length > 0;

        if(!hasError){
            if(typeof options.success == 'function'){
                options.success();
            }
        }else{
            if(typeof options.unsuccess == 'function'){
                options.unsuccess();
            }
        }

        return hasError !== false;
    }
  };

  //exports object.
  $.mtValidator = {
    settings: settings,
    fn: fn
  };

}($));
