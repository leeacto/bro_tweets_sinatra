class RemoveTweetPicField < ActiveRecord::Migration
  def change
  	remove_column :tweets, :pic
  	add_column :tweeters, :pic, :text
  end
end
