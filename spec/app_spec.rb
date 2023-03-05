ENV["APP_ENV"] = "test"

require_relative "../app"
require "rack/test"

RSpec.describe "App" do
  include Rack::Test::Methods

  def app
    Sinatra::Application
  end

  subject { last_response }

  describe "/status" do
    let(:results) { nil }
    let(:gcd) { double("GCD", run: results) }

    before { allow(Google::Cloud::Datastore).to receive(:new).and_return(gcd) }

    context "with no results found" do
      let(:results) { [] }

      before { allow(gcd).to receive_message_chain(:query, :where, :where, :order, :limit) }

      it "should return 200 with RESP headers" do
        get "/status"
        expect(subject.status).to eq 200
        expect(subject.body).to eq({"message" => ""}.to_json)
        expect(subject.content_type).to eq "application/json; charset=utf-8"
      end
    end
  end
end
