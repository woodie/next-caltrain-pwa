ENV["GOOGLE_AUTH_SUPPRESS_CREDENTIALS_WARNINGS"] = "1"

require "scrape"

RSpec.describe Scrape do
  describe "#status_page" do
    it "should fetch a page" do
      expect(Net::HTTP).to receive(:get_response)
      subject.send(:status_page)
    end
  end

  # combo = train_id.to_i.even? ? "SB#{train_id}" : "NB#{train_id}"
  # let(:msg1) { "Train 432 SB is running 9 minutes late approaching Nirvana." }
  # let(:msg2) { "SB514 boarding on the northbound platform Santa Clara." }

  describe "#extract_data" do
    let(:html) { '<html><body><div class="view-tweets">' }
    let(:resp) { {"data" => []} }

    it "should return and empty string" do
      expect(subject.send(:extract_data, html)).to eq(resp)
    end
  end
end
