define(["backbone"], function(/*Backbone*/){
	// create our model
	var Item = Backbone.Model.extend(
		{
			defaults: { firstname: "Not specified", lastname: "Not specified" },
			idAttribute: "_id" // for MongoDB
		}
	);
	// create a collection
	var collection = new Backbone.Collection([], {
		model: Item,
		url: "http://localhost:3000/items"
	});

	return {
		init: function(){
			this.loadedStores.contacts.set("collection", collection);
			// in 2.0 this will be easier cause Dojo API will be more open
			var list = this.list;
			list._createItemProperties = function(item){
				return {
					label: item.get("firstname"),
					rightText: item.get("lastname"),
					id: item.id
				}
			};
			this.add.on("click", function(){
				collection.create({ firstname: "me", lastname: "you"});
			});
			this.remove.on("click", function(){
				collection.get(list.getChildren()[(list.getChildren().length -1)].id).destroy();
			});
		},
		beforeActivate: function(){
			// refresh the view
			this.list.setStore(this.loadedStores.contacts, {});
		}
	};
});