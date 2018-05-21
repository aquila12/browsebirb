var vodplayerApp = new Vue({
  el: '#vodplayer',
  data: {
    active: false,
    loaded: false,
    error: null,
    vod: {info:{}},
    streamer: {info:{}},
    url: "#",
  },
  methods: {
    playVod: function(vod, streamer) {
      this.close();
      this.active = true;
      this.vod = vod;
      this.streamer = streamer;
      this.url = vod.url;

      var video = vodplayerApp.$refs.video;
      video.poster = vod.poster;

      if(Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(this.url);
        hls.attachMedia(video);
        console.log('attached hls')
        hls.on( Hls.Events.MANIFEST_PARSED,function() {
          console.log('playing')
          video.play();
        } );

        this.hls = hls;
        this.loaded = true;
        this.error = null;
      }
      else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = this.url;
        video.addEventListener('canplay',function() {
          console.log('src-play')
          video.play();
        });
        this.loaded = true;
        this.error = null;
      }
      else {
        this.error = "The player isn't compatible with your system (apparently)"
        console.log('else');
      }
    },

    close: function() {
      if(this.hls) this.hls.destroy()
      delete this.hls;
      if(this.video) {
        this.video.stop();
        this.video.src = "";
      }
      this.active = false;
      this.loaded = false;
      this.url = "#";

      this.vod = {info:{}};
      this.streamer = {info:{}};
    }
  }
});
