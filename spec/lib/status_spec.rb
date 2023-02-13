require "status"

RSpec.describe Status do
  describe "::RESP_HEADERS" do
    let(:hash) { Status::RESP_HEADERS }

    it "should include expected key" do
      expect(hash.is_a?(Hash)).to be(true)
      expect(hash.key?("Content-type")).to be(true)
    end
  end

  describe "#message" do
    let(:msg0) { "We're waiting for electrification." }
    let(:msg1) { "Train 432 SB is running 9 minutes late approaching Nirvana." }
    let(:msg2) { "SB514 boarding on the northbound platform Santa Clara." }
    let(:msg3) { "We're working on electrification." }
    let(:msg4) { "We're starting with electrification." }
    let(:recent) { Time.now - Status::STALE_SECONDS + 200 }
    let(:past) { Time.now - Status::STALE_SECONDS - 200 }
    let(:time) { past }
    let(:json) {
      {"data" => [
        {"created_at" => time, "text" => msg0},
        {"created_at" => time, "text" => msg1},
        {"created_at" => time, "text" => msg2},
        {"created_at" => time, "text" => msg3},
        {"created_at" => past, "text" => msg4}
      ]}.to_json
    }
    let(:payload) {
      <<-HTML
      <html><body><div class="view-tweets">
      <div class="views-row"><a>#{msg0}</a><time datetime="#{time}"></time></div>
      <div class="views-row"><a>#{msg1}</a><time datetime="#{time}"></time></div>
      <div class="views-row"><a>#{msg2}</a><time datetime="#{time}"></time></div>
      <div class="views-row"><a>#{msg3}</a><time datetime="#{time}"></time></div>
      <div class="views-row"><a>#{msg4}</a><time datetime="#{past}"></time></div>
      </div></body></html>
      HTML
    }
    let(:resp) { Net::HTTPSuccess.new(1.0, "200", "OK") }
    let(:train_id) { "321" }

    context "with invalid twitter response" do
      before { allow(Net::HTTP).to receive(:get_response) }

      it "should return nil" do
        expect(subject.message(train_id)).to be_nil
      end
    end

    context "with multiple requests" do
      before(:each) { expect(resp).to receive(:body).and_return(payload).twice }

      context "within refresh time" do
        let(:next_time) { Time.now + 2 }

        it "should hit twitter API once" do
          expect(Net::HTTP).to receive(:get_response).and_return(resp).once
          expect(subject.message("")).to be_empty
          subject.instance_variable_set(:@refresh_time, next_time)
          expect(subject.message("")).to be_empty
        end
      end

      context "outside refresh time" do
        let(:next_time) { Time.now - 2 }

        it "should hit twitter API twice" do
          expect(Net::HTTP).to receive(:get_response).and_return(resp).twice
          expect(subject.message("")).to be_empty
          subject.instance_variable_set(:@refresh_time, next_time)
          expect(subject.message("")).to be_empty
        end
      end
    end

    context "with valid twitter response" do
      before(:each) do
        allow(Net::HTTP).to receive(:get_response).and_return(resp)
        allow(resp).to receive(:body).and_return(payload)
      end

      context "with stale messages" do
        let(:time) { past }

        it "should return empty string" do
          expect(subject.message(train_id)).to be_empty
        end
      end

      context "with recent messages" do
        let(:time) { recent }

        context "with just train ID in the feed" do
          let(:train_id) { "432" }

          it "should return expected response" do
            expect(subject.message(train_id)).to eq(msg1)
          end
        end

        context "with train combo ID in the feed" do
          let(:train_id) { "514" }

          it "should return expected response" do
            expect(subject.message(train_id)).to eq(msg2)
          end
        end

        context "without train ID in the feed" do
          let(:train_id) { "123" }

          it "should return expected response" do
            expect(subject.message(train_id)).to eq(msg0)
          end
        end
      end
    end
  end

  describe "#status_page" do
    before(:each) { expect(Net::HTTP).to receive(:get_response) }

    it "should reset refresh_time" do
      rt = subject.instance_variable_get(:@refresh_time)
      subject.send(:status_page)
      expect(subject.instance_variable_get(:@refresh_time)).not_to eq(rt)
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
