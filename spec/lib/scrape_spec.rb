ENV["GOOGLE_AUTH_SUPPRESS_CREDENTIALS_WARNINGS"] = "1"

require "scrape"

RSpec.describe Scrape do
  describe "#status_page" do
    it "should fetch a page" do
      expect(Net::HTTP).to receive(:get_response)
      subject.send(:status_page)
    end
  end

  describe "#extract_data" do
    let(:html) { '<html><body><div class="view-tweets">' }
    let(:resp) { {"data" => []} }

    it "should return and empty string" do
      expect(subject.send(:extract_data, html)).to eq(resp)
    end
  end
end
