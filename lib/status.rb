require "time"
require "json"
require "net/http"
require "nokogiri"

class Status
  STALE_SECONDS = 32400 # 9 hours
  REFRESH_SECONDS = 300 # 5 minutes
  RESP_HEADERS = {"Content-type" => "application/json; charset=utf-8"}

  def initialize(bearer_token = "")
    @bearer_token = bearer_token
    @refresh_time = Time.now
  end

  def message(train_id)
    @response = status_page unless @response && @refresh_time > Time.now
    return @response = nil unless @response.is_a?(Net::HTTPSuccess)

    fallback = ""
    combo = train_id.to_i.even? ? "SB#{train_id}" : "NB#{train_id}"
    extract_data(@response.body)["data"].each do |row|
      return fallback if (Time.now - Time.parse(row["created_at"])).to_i > STALE_SECONDS

      parts = row["text"].split
      next unless parts.size > 1 && parts[0].size > 1

      if parts[0] == combo || row["text"].start_with?("Train #{train_id} ")
        return row["text"]
      elsif fallback.empty? && (parts[0][1] != "B" && parts[0].size != 5) && parts[0] != "Train"
        fallback = row["text"]
      end
    end
    fallback
  end

  private

  def status_page
    @refresh_time = Time.now + REFRESH_SECONDS
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
