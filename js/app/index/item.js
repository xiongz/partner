define(["com/init","com/util"],function(init,util) {
  var venue = [];
  var sport = [];

  var sport = avalon.define({
    $id:"sport",
    sport: sport
  });
  var online = avalon.define({
    $id:"online",
    venue: venue
  });


  util.getAjaxData("pub/sportctg", "query", {},function(data){

  });

  util.getAjaxData("web/venue", "query", {},function(data){
    online.venue = data.rs.data;
  });
  avalon.scan();
  return avalon;
});
