require "sinatra"
require_relative "lib/status"
require_relative "lib/scrape"

get "/status" do
  @status ||= Status.new
  message = @status.message(params["train"])
  return [500, {}, ["Something went wrong."]] if message.nil?

  [200, Status::RESP_HEADERS, [{message: message}.to_json]]
end

get "/scrape" do
  @scrape ||= Scrape.new
  count = @scrape.update_cache
  return [500, {}, ["Something went wrong."]] if count.nil?

  [200, Status::RESP_HEADERS, [{count: count}.to_json]]
end

get "/" do
  [200, {}, ["TBD"]]
end
