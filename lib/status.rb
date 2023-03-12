require "time"
require "json"
require "google/cloud/datastore"

class Status
  OPTS_HEADERS = {
    "Access-Control-Allow-Origin" => "*",
    "Access-Control-Allow-Methods" => "GET",
    "Access-Control-Allow-Headers" => "Content-Type",
    "Access-Control-Max-Age" => "3600"
  }

  CORS_HEADERS = {
    "Access-Control-Allow-Origin" => "*",
    "Content-type" => "application/json; charset=utf-8"
  }

  def initialize
    @datastore = Google::Cloud::Datastore.new(project_id: "next-caltrain-pwa")
  end

  def alerts
    query = @datastore.query("Status")
      .order("created_at", :desc).limit(99)
    payload = []
    @datastore.run(query).each { |row| payload << row.properties.to_h }
    payload
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
