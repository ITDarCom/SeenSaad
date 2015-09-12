Template.articles.helpers({
	articles: function(){
		return Articles.find({},{sort: {dateAdded: -1}});
	}
});