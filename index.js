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
  settings.prependError = true;

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

  function objectEach(obj, fn){
    for(var i in obj){
      fn(obj[i], i);
    }
  }

  function parseRule(s){
    var rule = s.split('['), option = '';

    if(rule[1]) option = rule[1];

    return {
      rule: rule[0],
      option: option.replace(/]$/, '')
    }
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

  defaultValidator.range = function(input, option){
    var range = new Range(option);

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

    if($form.attr('enable-mt-validator') !== undefined){

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

        var errorList = [];

        $form.find('input,select').each(function(){
            var $el = $(this);
            if(isEmpty($el.val())){
                if($el.attr('required')){
                  errorList.push({el:$el, content:getMessage('required')})
                }
            }

            var rules = $el.attr('validation-rule');
            var message = $el.attr('validation-message');

            if(rules !== undefined && rules !== null){

                var ruleArr = rules.split(',');
                var skip = contains(ruleArr, 'allowEmpty') && isEmpty($el.val());

                if(!skip){

                  ruleArr.forEach(function(r){
                    var parserd = parseRule(r);
                    if(validator[parserd.rule]){
                      var error = validator[parserd.rule]($el.val(), parserd.option)
                      if(error){
                        errorList.push({el:$el, content: message || error})
                      }
                    }
                  });
                }
            }
        });

        if(options.associateRules){

          objectEach(options.associateRules, function(rules, associateName){
            var $el = $("[validation-associate="+associateName+"]")
            rules.forEach(function(rule){
              var parserd = parseRule(rule);
              var erros = $el.map(function(i, el){
                return validator[rule]($(el).val(), parserd.option);
              });
              if(erros[0]){
                errorList.push({el:$($el[0]), content:erros[0]})
              }
            });

          });
        }

        var hasError = errorList.length > 0;

        if(!hasError){
            if(typeof options.success == 'function'){
                options.success();
            }
        }else{

          if(options.beforeShowError){
            options.beforeShowError(errorList);
          }
          if(settings.prependError){
            errorList.forEach(function(error){
              error.el.before(getErrHtm(error.content));
            });
          }

          if(typeof options.unsuccess == 'function'){
            setTimeout(function(){
              options.unsuccess(errorList);
            }, 10);
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
