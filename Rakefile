require 'rest-client'
require 'json'

task :default => ['test.json']

task 'test.json' do
  map = {}

  raise 'No username (user) supplied for xeago' unless ENV['user']
  raise 'No password (pass) supplied for xeago' unless ENV['pass']

  archive = RestClient::Resource.new 'https://se.xeago.nl/twitch.tv/', ENV['user'], ENV['pass']

  index_url = 'archive/vods.json'
  map[index_url] = JSON.parse archive[index_url].get( accept: :json )

  # Get all the metadata files
  map[index_url].each do |streamer, vods|
    streamer_url = "archive/#{streamer}/streamer.json"
    map[streamer_url] = JSON.parse archive[streamer_url].get( accept: :json )

    vods.each do |vod|
      vod_url = "archive/#{vod['video']}/video.json"
      map[vod_url] = JSON.parse archive[vod_url].get( accept: :json )
    end
  end

  STDERR.puts 'Map contents:'
  STDERR.puts map.keys.map{ |k| '  ' + k }

  STDERR.puts 'Generating JSON'
  json_data = JSON.pretty_generate map

  File.write 'test.json', json_data
end
