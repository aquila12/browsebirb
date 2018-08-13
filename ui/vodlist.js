function imageUrlFromTemplate(template, width, height) {
  var url = template;
  url = _.replace(url, '%{width}',  width.toString());
  url = _.replace(url, '%{height}', height.toString());
  return url;
}

function initVod(video) {
  var vod = {
    timestamp: 0,
    playable:     video.playable,
    url:          archive_url + video.source,
    metadataUrl:  archive_url + video.meta, // Deprecated
    info:         video.twitch,
    href:         video.playable? "#" : video.twitch['@url'],
    target:       video.playable? ''  : '_blank',
  };

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

  return vod;
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
        view.vods.push( initVod(video) );
      });
    },
    play: function(vod) {
      if(vod.playable) vodplayerApp.playVod(vod, this.streamer);
    }
  }
});
