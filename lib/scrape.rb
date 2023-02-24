require "time"
require "json"
require "net/http"
require "nokogiri"
require "google/cloud/datastore"

class Scrape
  FALLBACK_TIME = Time.at(0)

  def initialize
    @datastore = Google::Cloud::Datastore.new(project_id: "next-caltrain-pwa")
  end

  def update_cache
    response = status_page
    return nil unless response.is_a?(Net::HTTPSuccess)

    query = @datastore.query("Status").order("created_at", :desc).limit(1)
    entry = @datastore.run(query).first
    last_time = entry.nil? ? FALLBACK_TIME : entry["created_at"]

    count = 0
    extract_data(response.body)["data"].reverse_each do |row|
      this_time = Time.parse(row["created_at"])
      next if last_time >= this_time

      status = @datastore.entity "Status" do |e|
        e["text"] = row["text"]
        # e["train"] = 123
        # e["status"] = "10 minutes late"
        e["created_at"] = this_time
        e["stashed_at"] = Time.now
      end
      @datastore.save status
      count += 1
    end
    count
  end

  def status_page
    uri = URI("https://www.caltrain.com/alerts?active_tab=service_alerts_tab")
    Net::HTTP.get_response(uri)
  end

  def extract_data(html)
    document = Nokogiri::HTML.parse(html)
    payload = {"data" => []}
    tweets = document.at(".view-tweets")
    tweets.css(".views-row").each do |row|
      time = row.at("time").attributes["datetime"].value
      text = row.at("a").text
      payload["data"] << {"created_at" => time, "text" => text}
    end
    payload
  end
end
