define(["dojo/Deferred", "dojo/_base/lang", "dojo/_base/declare", "dojo/when", "dojo/Stateful", "dojo/aspect",
	"dojo/store/util/QueryResults", "dojo/store/util/SimpleQueryEngine"],
	function(Deferred, lang, declare, when, Stateful, aspect, QueryResults, SimpleQueryEngine){
	return declare(Stateful, {
		constructor: function(){
		},

		queryEngine: SimpleQueryEngine,

		_collectionSetter: function(value){
			this.collection = value;
			// in case we are wrapped in Observable we need to make sure notify will be called
			var store = this;
			var tempIgnore = false;
			aspect.after(value, "set", function(object){
				if(!store._ignoreUpdates && !tempIgnore){
					store.put(object, { ignore: true });
				}
			}, true);
			aspect.before(value, "add", function(object){
				// add is calling set, ignoreUpdates in set while we are in add
				tempIgnore = true;
			});
			aspect.after(value, "add", function(object){
				tempIgnore = false;
				if(!store._ignoreUpdates){
					store.add(object, { ignore: true });
				}
			}, true);
			aspect.after(value, "remove", function(object){
				if(!store._ignoreUpdates){
					store.remove(object.id, { ignore: true });
				}
			}, true);
		},

		getIdentity: function(item){
			return item.id;
		},

		query: function(query){
			var deferred = new Deferred();
			if(this.collection.url){
				this._ignoreUpdates = true;
				this.collection.fetch({success: lang.hitch(this, function(){
					deferred.resolve(this.collection.models.concat([]));
					this._ignoreUpdates = false;
				})});
			}else{
				deferred.resolve(this.collection.modelsconcat([]));
			}
			return new QueryResults(deferred);
		},

		add: function(item, options){
			if(!options || (options && !options.ignore)){
				this.collection.add(item);
			}
			return this.getIdentity(item);
		},

		remove: function(id, options){
			if(!options || (options && !options.ignore)){
				this.collection.remove(this.get(id));
			}
			return true;
		},

		put: function(item, options){
			if(!options || (options && !options.ignore)){
				this.collection.set(item);
			}
			return this.getIdentity(item);
		},

		get: function(id){
			return this.collection.get(id);
		}
	});
});