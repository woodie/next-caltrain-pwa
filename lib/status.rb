require "time"
require "json"
require "net/http"
require "nokogiri"
require "google/cloud/datastore"

class Status
  RESP_HEADERS = {"Content-type" => "application/json; charset=utf-8"}

  def initialize
    @datastore = Google::Cloud::Datastore.new(project_id: "next-caltrain-pwa")
  end

  def message(train_id)
    query = @datastore.query("Status")
      .where("train", "=", train_id.to_i)
      .where("created_at", ">", Time.now - 32400) # 9 hours
      .order("created_at", :desc).limit(1)
    result = @datastore.run(query)
    return "" if result.empty?

    delay = result.first["delay"]
    "#{delay} minutes late"
  end

  def delays
    query = @datastore.query("Status")
      .where("created_at", ">", Time.now - 32400) # 9 hours
      .order("created_at", :desc)
    result = @datastore.run(query)
    return {} if result.empty?

    payload = {}
    result.each do |e|
      train_id = e["train"]
      next if train_id.nil? || payload.has_key?(train_id)
      payload[train_id] = e["delay"]
    end
    payload
  end
end
