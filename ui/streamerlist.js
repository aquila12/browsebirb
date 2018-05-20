var streamers_url = '../streamers/';

// Fetch the streamer directory listing
function initializeStreamers(view) {
  $.get(streamers_url, null, null, "json")
    .done( function(streamerlist){
      console.log( "Got streamer listing");
      var dirs = _.filter(streamerlist, { 'IsDir': true });
      _.forEach(dirs, function(dir, index) {
        var url = dir.URL;
        if( _.startsWith( url, './' ) ) url = url.slice(2);

        var streamer = {
          loading: true,
          loaded: false,
          name: "",
          directory: streamers_url + url,
          metadata: streamers_url + url + 'streamer.json'
        };
        view.streamers.push(streamer);

        getStreamerInfo(streamer);
      });
    } )
    .fail( function(){
      console.log( "No streamer listing");
      view.error = "Streamer listing not found";
    } )
    .always( function(){
      view.loading = false;
    });;
}

// Fetch the metadata for a streamer from streamer.json
function getStreamerInfo(streamer) {
  var metadataUrl = streamer.metadata;
  console.log( "Get metadata " + streamer.metadata);
  $.get(metadataUrl, null, null, "json")
    .done( function(metadata){
      //console.log( "Got metadata " + streamer.metadata);
      if(!metadata) {
        streamer.error = "Failed to get streamer info";
        return;
      }

      streamer.info = metadata;
      streamer.name = metadata['@display_name'] || metadata['@login'];
      streamer.loaded = true;
    } )
    .fail( function(){
      console.log( "No metadata " + streamer.metadata);
      streamer.error = "Metadata not found";
    } )
    .always( function(){
      streamer.loading = false;
    });
}

var streamerlistApp = new Vue({
  el: '#streamerlist',
  data: {
    error: null,
    loading: true,
    streamers: []
  },
  computed: {
    sortedStreamers: function() {
      return _.sortBy(this.streamers, 'name');
    }
  }
});

initializeStreamers(streamerlistApp);
