require "time"
require "json"
require "net/http"
require "nokogiri"

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
end
