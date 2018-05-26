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

      vod.info   = metadata;
      vod.twitch = vod.info['@url'];

      // Unplayable VODs link to twitch
      if(! vod.playable) {
        vod.href   = vod.twitch;
        vod.target = "_blank";
      }

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
    vods: [],
    index: {}
  },
  computed: {
    sortedVods: function() {
      return _.sortBy(this.vods, 'timestamp').reverse();
    }
  },
  methods: {
    fetch: function(streamer) {
      this.loading = false;
      this.active = true;
      this.vods = [];
      this.error = null;
      this.base_url = streamer.directory;
      this.streamer = streamer;

      this.vods = [];
      var view = this;

      var streamer_key = streamer.info['@display_name']
      var videos = this.index[streamer_key];
      _.forEach(videos, function(video) {
        var dir = _.replace(video.video, /video\.json$/, '');
        var vod = {
          loading: true,
          loaded: false,
          timestamp: 0,
          playable:     video.source ? true : false,
          url:          archive_url + video.source,
          metadata:     archive_url + video.meta,
          href:   "#",
          target: ""
        };

        view.vods.push(vod);
        getVodInfo(vod);
      });
    },
    play: function(vod) {
      if(vod.playable) {
        vodplayerApp.playVod(vod, this.streamer);
      } else {

      }
    }
  }
});
