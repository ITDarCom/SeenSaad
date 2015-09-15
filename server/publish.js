Meteor.publish(null, function () {
	return Articles.find({});
});
Meteor.publish(null, function () {
	return Favorites.find({userId: this.userId});
});
