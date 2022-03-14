'use strict';

(function (angular, buildfire) {
  angular.module('vimeoPluginContent')
    .provider('Buildfire', [function () {
      var Buildfire = this;
      Buildfire.$get = function () {
        return buildfire
      };
      return Buildfire;
    }])
    .factory("DataStore", ['Buildfire', '$q', 'STATUS_CODE', 'STATUS_MESSAGES', function (Buildfire, $q, STATUS_CODE, STATUS_MESSAGES) {
      return {
        get: function (_tagName) {
          var deferred = $q.defer();
          Buildfire.datastore.get(_tagName, function (err, result) {
            if (err) {
              return deferred.reject(err);
            } else if (result) {
              return deferred.resolve(result);
            }
          });
          return deferred.promise;
        },
        save: function (_item, _tagName) {
          var deferred = $q.defer();
          if (typeof _item == 'undefined') {
            return deferred.reject(new Error({
              code: STATUS_CODE.UNDEFINED_DATA,
              message: STATUS_MESSAGES.UNDEFINED_DATA
            }));
          }
          Buildfire.datastore.save(_item, _tagName, function (err, result) {
            if (err) {
              return deferred.reject(err);
            } else if (result) {
              return deferred.resolve(result);
            }
          });
          return deferred.promise;
        }
      }
    }])
    .factory("Utils", [function () {
      return {
        extractSingleVideoIdOrUserID: function (url) {
          var match = url.match(/(\.com)\/(.+)/);
 
        if (match[2].split("/")[1]) {
          match[2]= match[2].split("/")[0] + ":" +match[2].split("/")[1]
        }
          var rgx = /\/.+\/?/g;

          if (match && !rgx.test(match[2])) {
            // normal single videos : should send only the video id
            return match[2].split("/")[0];
          } else if (match && rgx.test(match[2])) {
            // this part for unlisted videos >> it should be sent like this "videoId:privacyHash">> sample: "528104478:257ef1e75a"
            return match[2].split("/")[0]+":"+match[2].split("/")[1];
          } else {
            return null;
          }
        },
        extractFeedID: function (url) {
          var match = url.match(/(channels)\/(.+)/);
          if (match)
            return match[2];
          else
            return null;
        }
      }
    }]);

})(window.angular, window.buildfire);