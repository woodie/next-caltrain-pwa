require "sinatra"
require_relative "lib/status"

get "/status" do
  @status ||= Status.new
  message = @status.message(params["train"])
  return [500, {}, ["Something went wrong."]] if message.nil?

  [200, Status::RESP_HEADERS, [{message: message}.to_json]]
end

get "/scrape" do
  [200, {}, ["TBD"]]
end

get "/" do
  [200, {}, ["TBD"]]
end
