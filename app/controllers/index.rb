require 'twitter'
require 'debugger'

get '/' do
  erb :index
end

post '/' do
  OpenSSL::SSL::VERIFY_PEER = OpenSSL::SSL::VERIFY_NONE
  latitude = params['latlon']['lat']
  longitude = params['latlon']['lon']
  geo = latitude.to_s + ',' + longitude.to_s + ',6mi'
  terms = params['list'].values
  terms.each do |t|
    res = Twitter.search(t, :geocode => geo, :result_type => "recent")
    tweets =  res.to_hash[:statuses]
    tweets.each do |k|
      unless k[:coordinates].nil? || k[:geo].nil?
        tweeter = Tweeter.where(:handle => k[:user][:screen_name]).first_or_create
        tweeter.handle = k[:user][:screen_name]
        tweeter.pic = Twitter.user(k[:user][:id])[:attrs][:profile_image_url]
        tweeter.save
        tweet = Tweet.new
        tweet.content = k[:text]
        tweet.latitude = k[:coordinates][:coordinates][1]
        tweet.longitude = k[:coordinates][:coordinates][0]
        tweet.tweet_id = k[:id_str]
        tweet.tweeter_id = tweeter.id
        tweet.t_created = k[:created_at]
        tweet.save
      end
    end
  end
end

get '/markers' do
  send_hash = {}
  tweet_hash = {}
  Tweet.all.each do |t|
    tweet_hash[t.id] = t.with_tweeter if t.created_at > Time.now - 60
  end
  send_hash = { :tweet => tweet_hash }
  send_hash.to_json
end