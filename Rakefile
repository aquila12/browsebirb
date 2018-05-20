require 'rest-client'
require 'json'

task :default => ['test.json']

def each_directory_in(directory, listing)
  dirs = listing.find_all{ |i| i['IsDir'] }
  total = dirs.length
  dirs.each_with_index do |i,n|
    path = directory + i['URL'].sub(/^.\//, '')
    yield path, n, total
  end
end

task 'test.json' do
  map = {}

  raise 'No username (user) supplied for xeago' unless ENV['user']
  raise 'No password (pass) supplied for xeago' unless ENV['pass']

  archive = RestClient::Resource.new 'https://se.xeago.nl/for/lara6683/and/birbs/archive', ENV['user'], ENV['pass']

  map['/'] = JSON.parse archive['/'].get( accept: :json )

  each_directory_in '/', map['/'] do |subdir, n, total|
    STDERR.puts "Traversing #{subdir} (#{n+1}/#{total})"
    map[subdir] = JSON.parse archive[subdir].get( accept: :json )

    # There should be only one!
    each_directory_in subdir, map[subdir] do |videodir|
      map[videodir + 'video.json'] = JSON.parse archive[videodir + 'video.json'].get
    end
  end

  STDERR.puts 'Map contents:'
  STDERR.puts map.keys.map{ |k| '  ' + k }

  STDERR.puts 'Generating JSON'
  json_data = JSON.pretty_generate map

  File.write 'test.json', json_data
end
