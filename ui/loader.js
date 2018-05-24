// This is responsible for loading the index file and prodding the other components

var archive_url = '../archive/';

// Fetch the streamer directory listing
function reloadData() {
  $.get(archive_url + 'vods.json', null, null, "json")
    .done( function(data){
      console.log( "Got streamer listing");

      // Get the directory names from the keys
      var streamerdirs = _.keys(data);
      streamerlistApp.reload(archive_url, streamerdirs);

      // Give the vodlistApp the whole index
      vodlistApp.index = data;
    } )
    .fail( function(){
      console.log( "No streamer listing");
      streamerlistApp.error = "Streamer listing not found";
      vodlistApp.error = "VOD listing not found";
    } )
    .always( function(){
      streamerlistApp.loading = false;
      vodlistApp.loading = false;
    });
}

reloadData();
