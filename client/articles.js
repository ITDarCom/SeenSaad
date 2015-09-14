Template.articles.helpers({
	articles: function(){
		return Articles.find({},{sort: {createdAt: -1}});
	}
});

Template.articles.events({
	'click .remove': function(){
		Articles.remove(this._id);
		//Meteor.call('removeArticle', this._id);
	}
});

/*
Meteor.methods({
	'removeArticle': function(ArticleId){
		Articles.remove(ArticleId);
	}
});
*//////
