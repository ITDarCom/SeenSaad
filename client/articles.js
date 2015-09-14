Template.articles.helpers({
	articles: function(){
		return Articles.find({},{sort: {createdAt: -1}});
	}
});

Template.addPlayerForm.events({
	'click .remove': function(){
		Meteor.call('removeArticle', this._id);
	}
});


Meteor.methods({
	'removeArticle': function(ArticleId){
		Articles.remove(ArticleId);
	}
});

