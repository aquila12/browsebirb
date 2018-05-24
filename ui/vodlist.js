// Fetch the streamer vod directory listing
function initializeVods(view) {
  $.get(view.base_url, null, null, "json")
    .done( function(vodlist){
      console.log( "Got video listing");
      var dirs = _.filter(vodlist, { 'IsDir': true });
      _.forEach(dirs, function(dir, index) {
        var url = dir.URL;
        if( _.startsWith( url, './' ) ) url = url.slice(2);

        var vod = {
          loading: true,
          loaded: false,
          timestamp: 0,
          directory: view.base_url + url
        };
        view.vods.push(vod);

        getVodSubdir(vod);
      });
    } ).fail( function(){
      console.log( "No video listing");
      view.error = "Video listing not found";
    } )
    .always( function(){
      view.loading = false;
    });
}

// Fetch the subdirectory listing for a vod (so we can find video.json)
function getVodSubdir(vod) {
  var dirUrl = vod.directory;
  $.get(dirUrl, null, null, "json")
    .done( function(vodlist){
      //console.log( "Got directory listing " + vod.directory);
      if(!vodlist) {
        vod.error = "Directory listing failed";
        return;
      }

      var dirs = _.filter(vodlist, { 'IsDir': true });
      if(dirs.length == 0)  vod.error = "Directory contained no subdirectories"
      else if(dirs.length > 1)   vod.error = "Directory contained multiple subdirectories"
      else {
        var url = dirs[0].URL;
        if( _.startsWith( url, './' ) ) url = url.slice(2);

        var dataDir = dirUrl +  url;
        vod.subdirectory = dataDir;
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

      if(vod.info) {
        var url = vod.info["@thumbnail_url"];
        var date = vod.info["@published_at"];

        if(url) {
          var thumburl     = url;
          var posterurl = url;
          thumburl = _.replace(thumburl, '%{width}', '286');
          thumburl = _.replace(thumburl, '%{height}', '180');
          posterurl = _.replace(posterurl, '%{width}', '1280');
          posterurl = _.replace(posterurl, '%{height}', '720');
          vod.thumbnail = thumburl;
          vod.poster = posterurl;
        }

        if(date) {
          var d = moment.utc(date, "YYYY-MM-DD hh:mm:ss");
          vod.when = d.local().calendar(null, {sameElse: 'Do MMM YYYY'});
          vod.timestamp = d.valueOf();
        }
      }

      vod.loaded = true;
    } )
    .fail( function(){
      console.log( "No metadata " + vod.metadata);
      vod.error = "Metadata not found";
    } )
    .always( function(){
      vod.loading = false;
    });
}

var vodlistApp = new Vue({
  el: '#vodlist',
  data: {
    error: null,
    loading: true,
    active: false,
    base_url: '../',
    vods: []
  },
  computed: {
    sortedVods: function() {
      return _.sortBy(this.vods, 'timestamp').reverse();
    }
  },
  methods: {
    fetch: function(streamer) {
      this.loading = true;
      this.active = true;
      this.vods = [];
      this.error = null;
      this.base_url = streamer.directory;
      this.streamer = streamer;

      initializeVods(this);
    },
    play: function(vod) {
      vodplayerApp.playVod(vod, this.streamer);
    }
  }
});
