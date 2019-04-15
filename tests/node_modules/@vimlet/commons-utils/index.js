#!/usr/bin/env node

// @function json (public) [Json utils]
module.exports.json = {
    // @function deepMerge (public) [Merge two objects] @param args
    deepMerge : function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var merged = {};
        var merge = function (obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    if (obj[prop] && typeof obj[prop] == 'object' && !Array.isArray(obj[prop])) {                        
                        merged[prop] = module.exports.json.deepMerge(merged[prop], obj[prop]);
                    } else {
                        merged[prop] = obj[prop];
                    }
                }
            }
        };
        for (var i = 0; i < arguments.length; i++) {
            var obj = arguments[i];
            merge(obj);
        }
        return merged;
    }
};

// @function string (public) [string utils]
module.exports.string = {
    // @function asyncReplace (public) [Asynchronous strin replace] @param str @param re [Regex] @param replacer [Function]
    asyncReplace : function(str, re, replacer) {
        return Promise.resolve().then(() => {
          var fns = []
          str.replace(re, (m, ...args) => {
            fns.push(replacer(m, ...args))
            return m
          });
          return Promise.all(fns).then(replacements => {
            return str.replace(re, () => replacements.shift())
          });
        });
      }
};
