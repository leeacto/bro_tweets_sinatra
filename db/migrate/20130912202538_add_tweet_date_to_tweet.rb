class AddTweetDateToTweet < ActiveRecord::Migration
  def change
  	add_column :tweets, :t_created, :datetime
  end
end
