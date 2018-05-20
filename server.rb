#!/usr/bin/env ruby
# Just a simple sinatra app to test the client

require 'json'
require 'sinatra'

set :public_folder, File.dirname(__FILE__) + '/ui'

# Set up the paths needed (don't you just love metaprogramming?)
JSON.parse(File.read('test.json')).each do |path, object|
  data = JSON.pretty_generate(object)
  get('/archive' + path) do
    content_type 'application/json'
    data
  end
end
