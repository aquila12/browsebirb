# browsebirb
Simple website browser to show video thumbnails and information

## Deployment
Just deploy the ui directory to your system - the application expects ui/ to sit at the same level as archive/, which should contain individual streamer directories containing a streamer.json each.  Within those, it expects stream directories each with a single subdirectory containing all the .ts files, the video.json and index.m3u8.

The application currently depends on the Caddy web server or something that produces compatible JSON directory listings.

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
