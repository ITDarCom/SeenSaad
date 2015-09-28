Meteor.publish(null, function () {
    if (this.userId)
	return Articles.find({});
    else
        return Articles.find({$or: [{readingPermissions: '0'}, {contributingPermissions: '0'}]})
});
Meteor.publish(null, function () {
    if (this.userId)
	return Favorites.find({userId: this.userId});
});
Meteor.publish(null, function () {
    if (this.userId)
        return Meteor.users.find();
    else
        return Meteor.users.find({}, {fields: {username: 1}})
});
Meteor.publish(
    "myFavorites", function () {
        var ids = Favorites.findOne({userId: this.userId()});
        return Articles.find({_id: {$in: ids.favorites ? ids.favorites : []}}, {sort: {createdAt: -1}});
    }
)