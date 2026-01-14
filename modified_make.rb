#!/usr/bin/env ruby

# Convert text output from the modified schedule PDF.

require "csv"

%w[north south].each do |direction|
  CSV.open("data/modified_#{direction}_tmp.csv", "w") do |csv|
    lines = File.open("data/modified_#{direction}.txt").readlines
    lines.each do |line|
      words = line.split(/\s/)
      next if %w[Northbound Southbound].include? words.first

      out = []
      if words[0..1] == %w[Train No.] # header
        out = [nil] + words[2..]
      else # body
        station = words[0..3].select { |w| !(w =~ /:|–/) }.join(" ")
        station = "Tamien" if station.start_with?("Tamien")
        station = "California Ave" if station.start_with?("California")
        station = "So San Francisco" if station.start_with?("S. San")
        times = words.select { |w| w =~ /:|–/ }
        times.map! do |str|
          if str == "-"
            nil
          else
            next unless str.include?(":")

            h, m = str.split(":")
            h = h.to_i + (m.end_with?("p") ? 12 : 0)
            "#{h}:#{m.to_i}:00"
          end
        end
        out = times.unshift(station)
      end
      csv << out
    end
  end
end
