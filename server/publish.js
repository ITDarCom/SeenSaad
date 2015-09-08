Meteor.publish(null, function () {
	return Articles.find({});
});