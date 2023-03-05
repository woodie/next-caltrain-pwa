require "cgi"
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

    q1 = @datastore.query("Status").order("created_at", :desc).limit(1)
    entry = @datastore.run(q1).first
    last_time = entry.nil? ? FALLBACK_TIME : entry["created_at"]

    count = 0
    extract_data(response.body)["data"].reverse_each do |row|
      this_time = Time.parse(row["created_at"])
      next if last_time >= this_time

      this_text = CGI.unescapeHTML(row["text"])
      train = parse_train(this_text)
      delay = parse_delay(this_text)
      next if train.nil?

      status = @datastore.entity "Status" do |e|
        e["train"] = train
        e["delay"] = delay
        e["created_at"] = this_time
        e["stashed_at"] = Time.now
      end
      @datastore.save status
      count += 1
    end
    count
  end

  private

  def parse_train(text)
    train_text = text.scan(/Train \d\d\d .B/).join("")
    return nil if train_text.empty?

    train_text.split[1].to_i
  end

  def parse_delay(text)
    return nil unless text.include?("minutes late")

    text.split("minutes late").first.split(" ").last.to_i
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
