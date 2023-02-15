require "time"
require "json"
require "google/cloud/datastore"

class Alerts
  MIN_RESULTS = 5
  MAX_RESULTS = 25

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

  def data(max_results = "")
    limit = max_results.to_i.clamp(MIN_RESULTS, MAX_RESULTS)
    query = @datastore.query("Status").order("created_at", :desc).limit(limit)
    payload = []
    @datastore.run(query).each do |row|
      payload << {"created_at" => row["created_at"], "text" => row["text"]}
    end
    payload
  end
end
