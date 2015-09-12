Template.articles.events({
	'submit form': function(event){
		event.preventDefault();
		Articles.insert({
			title: event.target.title.value,
			body: event.target.body.value,
			user: Meteor.userId(),
			createdAt: new Date()
		});
	}
});







//Articles.insert({ title: "Hello world!", body: "This is a text body..", user: "khalid", createdAt: new Date() });
