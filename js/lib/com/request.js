/**
 * Created by xiongze on 2014-12-19.
 */
define(function(){
    var request = {
        QueryString : function(val,text) {
            var uri = text||window.location.search||window.location.hash;
            var re = new RegExp("" + val + "=([^&?#]*)", "ig");
            return ((uri.match(re)) ? (uri.match(re)[0].substr(val.length + 1))
                : null);
        },
        getHash : function(text){
            var uri = text||window.location.hash;
            var re = new RegExp("#([^&?#]*)", "ig");
            return ((uri.match(re)) ? (uri.match(re)[0].substr(1))
                : null);
        }
    };
    return request;
});
