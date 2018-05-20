var base_url = '../archive/';

// Fetch the archive directory listing
function initialize(view) {
  $.get(base_url, null, null, "json")
  .done( function(listing){
    console.log( "Got archive listing");
    var dirs = _.filter(listing, { 'IsDir': true });
    _.forEach(dirs, function(dir, index) {
      var url = dir.URL;
      if( _.startsWith( url, './' ) ) url = url.slice(2);

      var vod = {
        loading: true,
        loaded: false,
        directory: base_url + url
      };
      view.vods.push(vod);

      getVodSubdir(vod);
    });
    view.loading = false;
  } ).fail( function(){
    console.log( "No archive listing");
    view.loading = false;
    view.error = "Archive listing not found";
  } );
}

// Fetch the subdirectory listing for a vod (so we can find video.json)
function getVodSubdir(vod) {
  var dirUrl = vod.directory;
  $.get(dirUrl, null, null, "json")
    .done( function(listing){
      //console.log( "Got directory listing " + vod.directory);
      if(!listing) {
        vod.error = "Directory listing failed";
        return;
      }

      var dirs = _.filter(listing, { 'IsDir': true });
      if(dirs.length == 0)  vod.error = "Directory contained no subdirectories"
      else if(dirs.length > 1)   vod.error = "Directory contained multiple subdirectories"
      else {
        var url = dirs[0].URL;
        if( _.startsWith( url, './' ) ) url = url.slice(2);

        var dataDir = dirUrl +  url;
        vod.metadata = dataDir + 'video.json';
        vod.url      = dataDir + 'index.m3u8';
        getVodInfo(vod);
      }
    } )
    .fail( function(){
      console.log( "No directory listing " + vod.directory);
      vod.error = "Directory listing not found";
      vod.loading = false;
    } );
}

// Fetch the metadata for a vod from video.json
function getVodInfo(vod) {
  var metadataUrl = vod.metadata;
  //console.log( "Get metadata " + vod.metadata);
  $.get(metadataUrl, null, null, "json")
    .done( function(metadata){
      //console.log( "Got metadata " + vod.metadata);
      if(!metadata) {
        vod.error = "Failed to get metadata";
        return;
      }

      vod.info = metadata;
      vod.loading = false;

      if(vod.info) {
        var url = vod.info["@thumbnail_url"];
        var date = vod.info["@published_at"];

        if(url) {
          url = _.replace(url, '%{width}', '286');
          url = _.replace(url, '%{height}', '180');
          vod.thumbnail = url;
        }

        if(date) {
          var d = moment(date, "YYYY-MM-DD hh:mm:ss UTC");
          vod.when = d.calendar();
        }
      }

      vod.loaded = true;
    } )
    .fail( function(){
      console.log( "No metadata " + vod.metadata);
      vod.error = "Metadata not found";
      vod.loading = false;
    } );
}

var listingApp = new Vue({
  el: '#listing',
  data: {
    error: null,
    loading: true,
    vods: []
  }
});

initialize(listingApp);
