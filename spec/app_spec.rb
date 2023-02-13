ENV["APP_ENV"] = "test"

require_relative "../app"
require "rack/test"

RSpec.describe "App" do
  include Rack::Test::Methods

  def app
    Sinatra::Application
  end

  subject { last_response }

  context "with placeholder endpoints" do
    it "should respond with TDB" do
      get "/"
      expect(subject.body).to match("TBD")
    end

    it "should respond with TDB" do
      get "/scrape"
      expect(subject.body).to match("TBD")
    end
  end

  context "with invalid response" do
    before { expect(Net::HTTP).to receive(:get_response) }

    it "should return 500 with failure message" do
      get "/status"
      expect(subject.status).to eq 500
      expect(subject.body).to eq "Something went wrong."
    end
  end

  context "with valid response" do
    let(:resp) { Net::HTTPSuccess.new(1.0, "200", "OK") }
    let(:data) { '<html><body><div class="view-tweets"></div></body></html>' }

    before do
      expect(Net::HTTP).to receive(:get_response).and_return(resp)
      expect(resp).to receive(:body).and_return(data)
    end

    it "should return 200 with RESP headers" do
      get "/status"
      expect(subject.status).to eq 200
      expect(subject.body).to eq({"message" => ""}.to_json)
      expect(subject.content_type).to eq "application/json; charset=utf-8"
    end
  end
end
