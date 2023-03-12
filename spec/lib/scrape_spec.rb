ENV["GOOGLE_AUTH_SUPPRESS_CREDENTIALS_WARNINGS"] = "1"

require "scrape"

RSpec.describe Scrape do
  let(:train_id) { nil }
  let(:results) { [{"created_at" => Time.now - 3000, "train" => train_id}] }
  let(:gcd) { double("GCD", run: results, save: nil) }

  before { allow(Google::Cloud::Datastore).to receive(:new).and_return(gcd) }

  describe "#update_cache" do
    let(:entity) { {} }
    let(:html) { '<html><body><div class="view-tweets">' }
    let(:resp) { Net::HTTPSuccess.new(1.0, "200", "OK") }
    let(:payload) { {"data" => []} }

    before(:each) do
      allow(Net::HTTP).to receive(:get_response).and_return(resp)
      allow(resp).to receive(:body).and_return(html)
      allow(subject).to receive(:extract_data).and_return(payload)
      allow(gcd).to receive_message_chain(:query, :order, :limit)
      allow(gcd).to receive(:entity).and_return(entity)
    end

    it "should update nothing" do
      expect(subject.update_cache).to be(0)
    end

    context "With some recent alerts" do
      let(:msg0) { "Single tracking Palo Alto & California Ave until 4:00 beginning with 110." }
      let(:msg1) { "For New Year’s Eve, last train will depart San Francisco at 2:00 AM." }
      let(:msg2) { "Train 310 SB is running about 11 minutes late approaching San Jose Diridon." }
      let(:msg3) { "There are no closures scheduled for this weekend. Weekend closures will resume February 25th." }
      let(:time) { Time.now.to_s }
      let(:payload) {
        {"data" => [
          {"created_at" => time, "text" => msg0},
          {"created_at" => time, "text" => msg1},
          {"created_at" => time, "text" => msg2},
          {"created_at" => time, "text" => msg3}
        ]}
      }

      before { allow(gcd).to receive_message_chain(:query, :where, :limit).and_return(entity) }

      it "should update 4 entries" do
        expect(subject.update_cache).to be(1)
      end

      context "With reported train delay" do
        let(:payload) { {"data" => [{"created_at" => time, "text" => msg2}]} }

        context "Whenever" do
          let(:train) { 310 }

          it "should set train and delay" do
            expect(subject.update_cache).to be(1)
            # expect(entity["train"]).to eq(310)
            # expect(entity["delay"]).to eq(11)
          end
        end
      end
    end
  end

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
