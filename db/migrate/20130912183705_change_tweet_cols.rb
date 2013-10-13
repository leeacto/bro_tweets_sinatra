class ChangeTweetCols < ActiveRecord::Migration
  def change
    add_column :tweets, :tweet_id, :string
    remove_column :tweets, :handle
  end
end
