class Tweet < ActiveRecord::Base
  # Remember to create a migration!
  belongs_to :tweeter
  validates :tweet_id, :uniqueness => true

  def with_tweeter
  	send_hash = {}
    send_hash[:id] = self.tweet_id
  	send_hash[:lat] = self.latitude
  	send_hash[:lon] = self.longitude
  	send_hash[:created] = self.t_created
    send_hash[:html] = "<center>#{self.tweeter.handle}<br><img src=""#{self.tweeter.pic}""><br>#{self.content}</center>"
    send_hash

  end
end
