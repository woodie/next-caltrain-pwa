require "cgi"
require "sinatra"
require_relative "lib/scrape"
require_relative "lib/status"

set :public_folder, "webapp"

get "/" do
  send_file File.join(settings.public_folder, "index.html")
end

get "/alerts" do
  return [204, Status::OPTS_HEADERS, []] if request.options?

  @status ||= Status.new
  alerts = @status.alerts
  return [500, {}, ["Something went wrong."]] if alerts.nil?

  [200, Status::CORS_HEADERS, [alerts.to_json]]
end

get "/delays" do
  return [204, Status::OPTS_HEADERS, []] if request.options?

  @status ||= Status.new
  delays = @status.delays
  return [500, {}, ["Something went wrong."]] if delays.nil?

  [200, Status::CORS_HEADERS, [delays.to_json]]
end

get "/scrape" do
  @scrape ||= Scrape.new
  count = @scrape.update_cache
  return [500, {}, ["Something went wrong."]] if count.nil?

  [200, Status::CORS_HEADERS, [{count: count}.to_json]]
end
