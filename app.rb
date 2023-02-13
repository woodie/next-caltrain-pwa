require "sinatra"
require "json"
require_relative "lib/status"

get "/status" do
  @status ||= Status.new
  message = @status.message(params["train"])
  return [500, {}, ["Something went wrong."]] if message.nil?

  [200, Status::RESP_HEADERS, [{message: message}.to_json]]
end

get "/scrape" do
  <<~HTML
    <p>TBD</p>
  HTML
end

get "/" do
  <<~HTML
    <p>TBD</p>
  HTML
end
