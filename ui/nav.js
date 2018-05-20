var navApp = new Vue({
  el: '#nav',
  data: {
    streamer: null,
  },
  methods: {
    clearStreamer: function() {
      this.streamer = null;
      streamerlistApp.active = true;
      vodlistApp.active = false;
    }
  }
});
