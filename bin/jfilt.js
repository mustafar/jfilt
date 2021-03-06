/**
* $.parseParams - parse query string paramaters into an object.
* via https://gist.github.com/kares/956897
*/
;(function($) {
  var re = /([^&=]+)=?([^&]*)/g;
  var decodeRE = /\+/g;  // Regex for replacing addition symbol with a space
  var decode = function (str){
    return decodeURIComponent( str.replace(decodeRE, " ") );
  };
  $.parseParams = function(query) {
    var params = {}, e;
    while ( e = re.exec(query) ) {
      var k = decode( e[1] ), v = decode( e[2] );
      if (k.substring(k.length - 2) === '[]') {
        k = k.substring(0, k.length - 2);
        (params[k] || (params[k] = [])).push(v);
      }
      else params[k] = v;
    }
    return params;
  };
})(jQuery);

/**
 * jFilt!!
 */
;(function($, window){
  var _this = this, jFOptions, jFQuery;
  function readUrlParams() {
    return $.parseParams(window.location.search
      .replace(/(?:^[^?#]*\?([^#]*).*$)?.*/, '$1'));
  }
  function refillValues(e) {
    var urlParams = readUrlParams();
    for(var key in urlParams) {
      e.find("[name='" + key + "']").each(function() {
          if ($(this).is(':checkbox, :radio')) {
            var checkedVals = urlParams[key].split(',');
            $.inArray($(this).val(), checkedVals) > -1
              ? $(this).prop('checked', true) :$(this).prop('checked', false);
          } else {
            $(this).val(urlParams[key]);
          }
        });
    }
  }
  function handleChange(e) {
    if (!e.is(_this.jFOptions.ignore.join()) && history.pushState) {
      _this.jFQuery = _this.JFQuery || {};
      var val = e.val();
      if (e.is(':checkbox')) {
        var allChecks = e.parent()
              .find("input:checkbox[name='" + e.attr('name') + "']:checked");
        val = $.map(allChecks, function(e){ return $(e).val(); }).join();
      }
      _this.jFQuery[e.attr('name')] = val;
      var url = window.location.origin + window.location.pathname,
          params = $.extend(false, readUrlParams(), _this.jFQuery),
          paramStr = $.param($.each(params, function(key, value) {
            if (value === ''){ delete params[key]; }
          }));
      window.history.pushState(
        window.history.state, document.title,
        url + (paramStr.length > 0 ? '?' + paramStr : '') );
    }
  }
  $.fn.jFilt = function(options) {
    _this.jFOptions = options || {};
    _this.jFOptions['ignore'] = [':password']
      .concat(_this.jFOptions['ignore'] || []);
    refillValues($(this));
    $(this).find(':input').change(function() {
      handleChange($(this))
    });
  }
})(jQuery, window);
