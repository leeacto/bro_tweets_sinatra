class CreateTweetsTable < ActiveRecord::Migration
  def change
  	create_table :tweets do |t|
      t.integer :tweeter_id
      t.string :handle
      t.string :content
      t.float :latitude
      t.float :longitude
      t.text   :pic
      t.timestamps
    end
  end
end
