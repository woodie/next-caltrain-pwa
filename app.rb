require "cgi"
require "sinatra"
require_relative "lib/alerts"
require_relative "lib/scrape"
require_relative "lib/status"

set :public_folder, 'webapp'

get "/" do
  send_file File.join(settings.public_folder, 'index.html')
end

get "/alerts" do
  return [204, Alerts::OPTS_HEADERS, []] if request.options?

  @alerts ||= Alerts.new
  data = @alerts.data(params["max_results"])
  return [500, {}, ["Something went wrong."]] if data.nil?

  [200, Alerts::CORS_HEADERS, [{data: data}.to_json]]
end

get "/scrape" do
  @scrape ||= Scrape.new
  count = @scrape.update_cache
  return [500, {}, ["Something went wrong."]] if count.nil?

  [200, Status::RESP_HEADERS, [{count: count}.to_json]]
end

get "/status" do
  @status ||= Status.new
  message = @status.message(params["train"])
  return [500, {}, ["Something went wrong."]] if message.nil?

  [200, Status::RESP_HEADERS, [{message: message}.to_json]]
end

get "/delays" do
  platform = request.env["HTTP_USER_AGENT"].to_s.split.last
  trip = URI.decode_www_form_component(request.fullpath).split("=").last
  logger.info "#{platform}: #{trip}"
  @status ||= Status.new
  delays = @status.delays
  return [500, {}, ["Something went wrong."]] if delays.nil?

  [200, Status::RESP_HEADERS, [delays.to_json]]
end
