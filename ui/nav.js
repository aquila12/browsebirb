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

      // Invoke the loader when we go back to the top
      reloadData();
    }
  }
});
