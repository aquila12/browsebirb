function imageUrlFromTemplate(template, width, height) {
  var url = template;
  url = _.replace(url, '%{width}',  width.toString());
  url = _.replace(url, '%{height}', height.toString());
  return url;
}

// Fetch the metadata for a vod from video.json
function getVodInfo(vod) {
  if(!vod.info) {
    vod.error = "No metadata for VOD";
    return;
  }

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
      vod.thumbnail = imageUrlFromTemplate(url, 286,  180);
      vod.poster    = imageUrlFromTemplate(url, 1280, 720);
    }

    if(date) {
      var d = moment.utc(date, "YYYY-MM-DD hh:mm:ss");
      vod.when = d.local().calendar(null, {sameElse: 'Do MMM YYYY'});
      vod.timestamp = d.valueOf();
    }
  }

  vod.loaded = true;
  vod.loading = false;
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
        var vod = {
          loading: true,
          loaded: false,
          timestamp: 0,
          playable:     video.source ? true : false,
          url:          archive_url + video.source,
          metadataUrl:  archive_url + video.meta, // Deprecated
          info:         video.twitch,
          href:   "#",
          target: ""
        };

        view.vods.push(vod);
        getVodInfo(vod);
      });
    },
    play: function(vod) {
      if(vod.playable) vodplayerApp.playVod(vod, this.streamer);
    }
  }
});
