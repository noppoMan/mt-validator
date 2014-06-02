mt-validator
===========

An ui binding simple form validator.
mt-validator promise you Write simple, Easy extended, Rapid development.

## Dependencies
* jQuery compatible library

## Installation
There are 2 ways to install mt-validator

**1. Download as npm module. (Not implemetd yet.)**
```
npm install mt-validator
```

**2. Download source from here.**  
http://goo.gl/r9wzo9

## Usage

**index.html**
```html

<script type="text/javascript" src="./validation.js"></script>

<form id="form" enable-mt-validator>
  <input type="text" required />
  <input type="text" validation-rule="required" />
  <input type="text" validation-rule="onlyAscii" />
  <input type="text" validation-rule="onlyNum" />
  <input type="text" validation-rule="range[1..10]" />

  <!-- Multiple validation supports-->
  <input type="text" validation-rule="onlyAscii, range[1..10]" />

  <input type="submit" value="submit" id="submit"/>
</form>
```

**validation.js**
```javascript

// Get return value.
$('#submit').on('click', function(ev){
  ev.preventDefault(); //if you specified required attributes in element, you need to write this line.
  var hasError = $('#form').mtValidate();
  console.log(hasError);
});

// Using onSuccess or onUnsuccess callback.
$('#submit').on('click', function(ev){
  ev.preventDefault(); //if you specified required attributes in element, you need to write this line.

  $('#form').mtValidate({
    //Will call when throw validation.
    success: function(){
      // write success function here.
      // ....
    },
    unsuccess: function(){
      // write unsuccess function here.
      // ....
    }
  })
});
```


## Adding custom validator

Can add custom validator easily.  
Specifying `[options]` of surround bracket after rule name, can get it as second argument.

**javascript**
```javascript
$.mtValidator.fn.date = function(input, options){

  var regexp;
  if(options == 'yyyy/mm/dd'){
      regexp = /[0-9]{4}\/[0-9]{2}\/[0-9]{2}/
  }

  if(!input.match(regexp)){
      return 'Please fill out this filed with ' + options + ' format';
  }

  return false;
};

```

**html**
```html
<input type="text" validation-rule="date[yyyy/mm/dd]">
```

## Default Supported validation rules

|name           |howto                           |description    |
| ------------- |:------------------------------:|--------------:|
|required|validation-rule="required" or required|not permit empty|
|onlyAscii|validation-rule="onlyAscii"|only ascii charactor|
|onlyNum|validation-rule="onlyNum"|only number|
|range|validation-rule="range[10..100]"|Input length need between n to n|
|allowEmpty|validation-rule="allowEmpty, range[10..100]"|allow empty charactor. had better combinate with other rules|

## Localization or edit default error messages.

You can edit default error messages.  
In $.mtValidator.settings object, Error message corespond with validation-rule name.

**For exapmle for japanese.**
```javascript
$.mtValidator.settings.messages['required'] = '必須項目です。';
$.mtValidator.settings.messages['onlyAschii'] = '半角英数字で入力してください。';
```

## Edit error html
You can edit default error html.

Default is &lt;p class="mt-validator-error" style="color:#ff0000;"&gt;{{errorMessage}}&lt;/p&gt;

```javascript
$.mtValidator.settings.errorHtml = '<span class="mt-validator-error hogeclass">{{errorMessage}}</span>'
```


## Run Test
<pre>
$ npm test
</pre>


## License

(The MIT License)

Copyright (c) 2013 Yuki Takei(Noppoman) <yuki@miketokyo.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
