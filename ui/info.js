var infoApp = new Vue({
  el: '#info',
  data: {
    owner: { url: "#", displayName: "Somebody" },
  },
  methods: {
    clearStreamer: function() {
      this.streamer = null;
      streamerlistApp.active = true;
      vodlistApp.active = false;
    }
  }
});
