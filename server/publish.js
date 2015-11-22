//Meteor.publish(null, function () {
//    return Articles.find({$or: [{readingPermissions: '0'}, {contributingPermissions: '0'}]}, {
//        fields: {
//            title: 1,
//            username: 1,
//            createdAt: 1,
//            user: 1
//        }
//    })
//});
Meteor.publish(null, function () {
    if (this.userId) {
        var ids = Favorites.findOne({userId: this.userId});
        if (ids)
            return Articles.find({_id: {$in: ids.favorites ? ids.favorites : []}}, {
                fields: {
                    title: 1,
                    username: 1,
                    createdAt: 1,
                    user: 1
                }
            });
    }
    return false
});
Meteor.publish(null, function () {
    if (this.userId)
        return Favorites.find({userId: this.userId}) ? Favorites.find({userId: this.userId}) : null;
});
Meteor.publish(null, function () {
    if (this.userId) {
        var custom = Stream.findOne({userId: this.userId});
        if (custom) {
            var readingArticles = custom.readingArticles ? _.pluck(custom.readingArticles, 'id') : [];
            return Articles.find({_id: {$in: readingArticles}}, {
                fields: {
                    title: 1,
                    username: 1,
                    createdAt: 1,
                    user: 1,
                    readingPermissions: 1
                }
            });
        }
    }
});
Meteor.publish(null, function () {
    if (this.userId) {
        var custom = Stream.findOne({userId: this.userId});
        if (custom) {
            var contributingArticles = custom.contributingArticles ? _.pluck(custom.contributingArticles, 'id') : [];

            return Articles.find({_id: {$in: contributingArticles}}, {
                fields: {
                    title: 1,
                    username: 1,
                    createdAt: 1,
                    user: 1,
                    contributingPermissions: 1
                }
            });
        }
    }
});
Meteor.publish(null, function () {

    if (this.userId) {
        return Articles.find({user: this.userId})
    }
});
Meteor.publish("Article", function (articleId) {
    debugger;
    var article = Articles.findOne({_id: articleId});
    if (article.user === this.userId) {
        Meteor.call("readCounter", articleId);
        return Articles.find({_id: articleId})
    }
    if (article.contributingPermissions == '0') {
        Meteor.call("readCounter", articleId, this.userId);
        return Articles.find({_id: articleId})
    }
    else {
        if (article.contributingIds)
            if (!_.isEmpty(_.where(article.contributingIds, this.userId))) {
                Meteor.call("readCounter", articleId, this.userId);
                return Articles.find({_id: articleId})
            }
        if (article.readingPermissions == '0') {
            Meteor.call("seenChange", articleId);
            Meteor.call("readCounter", articleId, this.userId);
            return Articles.find({_id: articleId})
        }
        else if (article.readingIds)
            if (!_.isEmpty(_.where(article.readingIds, this.userId))) {
                if (Articles.find({_id: articleId})) {
                    Meteor.call("readCounter", articleId, this.userId);
                    return Articles.find({_id: articleId}, {comments: 0})
                }
            }
    }
});
Meteor.publish(null, function () {
    return Meteor.users.find({}, {fields: {username: 1}});
//TODO is maybe a big problem >> to send all usernames to non-user >> even to user
});
Meteor.publish(null, function () {
    return Meteor.users.find({_id: this.userId})
});
Meteor.publish('specificUser', function (userId) {

    var user = Meteor.users.findOne(userId);
    var projections = {};
    for (var property in user) {
        if (user.hasOwnProperty(property)) {
            if (user[property].permission)
                projections[property] = 1;
        }
    }
    return Meteor.users.find({_id: userId}, {fields: projections})
});
Meteor.publish(null, function () {
    if (this.userId) {
        if (_.contains(Admins, Meteor.users.findOne(this.userId).username)) {
            return Messages.find({});
        }
    }
    if (this.userId)
        return Messages.find({$or: [{to: this.userId, reciver: {$lte: 1}}, {from: this.userId, sender: 0}]}, {
            sender: 0,
            reciver: 0
        })
});
Meteor.publish(null, function () {
    if (this.userId)
        return Stream.find({userId: this.userId})
});
Meteor.publish(null, function () {
    return profilePicture.find({})
});
Meteor.publish(null, function () {
    return Images.find();
});
Meteor.publish('articles', function (limit) {
    if (this.userId) {
        if (_.contains(Admins, Meteor.users.findOne(this.userId).username)) {
            return Articles.find({});
        }
    }
    return Articles.find({$or: [{readingPermissions: '0'}, {contributingPermissions: '0'}]}, {
        fields: {
            title: 1,
            username: 1,
            createdAt: 1,
            user: 1
        }
        , limit: limit
    });
});

