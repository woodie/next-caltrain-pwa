require "status"

RSpec.describe Status do
  let(:results) { [] }
  let(:gcd) { double("GCD", run: results) }

  before { allow(Google::Cloud::Datastore).to receive(:new).and_return(gcd) }

  describe "::CORS_HEADERS" do
    let(:hash) { Status::CORS_HEADERS }

    it "should include expected key" do
      expect(hash.is_a?(Hash)).to be(true)
      expect(hash.key?("Content-type")).to be(true)
    end
  end

  describe "#delays" do
    before { allow(gcd).to receive_message_chain(:query, :where, :order) }

    it "should return expected message" do
      expect(subject.delays).to eq({})
    end
  end
end
