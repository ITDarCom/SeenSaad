Meteor.subscribe('Articles');

//Articles.insert({ title: "Hello world!", body: "This is a text body..", user: "khalid", createdAt: new Date() });

Template.articles.helpers({
	articles: function(){
		return Articles.find({},{sort: {dateAdded: -1}});
	}
});


