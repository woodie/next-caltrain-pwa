require "status"

RSpec.describe Status do
  let(:results) { [] }
  let(:gcd) { double("GCD", run: results) }

  before { allow(Google::Cloud::Datastore).to receive(:new).and_return(gcd) }

  describe "::RESP_HEADERS" do
    let(:hash) { Status::RESP_HEADERS }

    it "should include expected key" do
      expect(hash.is_a?(Hash)).to be(true)
      expect(hash.key?("Content-type")).to be(true)
    end
  end

  describe "#message" do
    let(:train_id) { 321 }

    before { allow(gcd).to receive_message_chain(:query, :where, :where, :order, :limit) }

    context "with no result" do
      it "should return empty message" do
        expect(subject.message(train_id)).to be_empty
      end
    end

    context "with a result" do
      let(:delay) { 9 }
      let(:results) { [{"delay" => delay}] }
      let(:message) { "#{delay} minutes late" }

      it "should return expected message" do
        expect(subject.message(train_id)).to eq(message)
      end
    end
  end
end
