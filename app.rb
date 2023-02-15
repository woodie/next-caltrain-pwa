require "sinatra"
require_relative "lib/alerts"
require_relative "lib/scrape"
require_relative "lib/status"

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

get "/" do
  [200, {}, ["TBD"]]
end
