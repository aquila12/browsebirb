# browsebirb
Simple website browser to show video thumbnails and information

## Deployment
Just deploy the ui directory to your system - the application expects ui/ to sit at the same level as archive/, which should contain individual streamer directories containing a streamer.json each.  There should be a top-level vods.json within archive/, which should list all of the videos by all streamers.  The current expected format is matched from [xeago/twitch.rb](https://github.com/Xeago/twitch.rb#format):
```
{
  "streamer_name": [
    {
      "meta": "relative/path/to/video.json",
      "video": "relative/path/to/",
      "playable": true,
      "source": "relative/path/to/index.m3u8",
    },
//  ...
  ]
}
```

There is no longer a dependency on the Caddy web server for directory listings.

There's no login handling; the application expects the web server and browser to deal with that itself.

## Dependencies
There are a bunch of JavaScript/CSS dependencies, which are fetched from CDN:
- Bootstrap (and its dependencies)
- vue.js
- lodash
- moment.js
- jQuery
- hls.js

## Testing
There's a basic Sinatra application for testing stuff.  Use `bundle install` if you want to use this utility, and then `user=<user> pass=<pass> rake test.json` to generate a realistic test file.
