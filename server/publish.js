Meteor.publish(null, function () {
	return Articles.find({});
});
Meteor.publish(null, function () {
	return Favorites.find({userId: this.userId});
});
Meteor.publish(null, function () {
	console.log("invoked")
	return Meteor.users.find();
});