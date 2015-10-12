Meteor.publish("publicArticles", function () {
    return Articles.find({$or: [{readingPermissions: '0'}, {contributingPermissions: '0'}]}, {
            fields: {
                title: 1,
                username: 1,
                createdAt: 1
            }
        })
});
Meteor.publish(null, function () {
    if (this.userId) {
    var ids = Favorites.findOne({userId: this.userId});
        if (ids)
            return Articles.find({_id: {$in: ids.favorites ? ids.favorites : []}});
    }
    return false
});
Meteor.publish(null, function () {
    if (this.userId) {
        var custom = Stream.findOne({userId: this.userId});
        if (custom) {
            readingArticles = custom.readingArticles ? custom.readingArticles : [];
            return Articles.find({_id: {$in: readingArticles}});
        }
    }
})
Meteor.publish(null, function () {
    if (this.userId) {
    var custom = Stream.findOne({userId: this.userId})
        if (custom) {
            contributingArticles = custom.contributingArticles ? custom.contributingArticles : []

            return Articles.find({_id: {$in: contributingArticles}});
        }
    }
})
Meteor.publish(null, function () {
    if (this.userId) {
        return Articles.find({user: this.userId})
    }
})
Meteor.publish("Article", function (articleId) {
    debugger
    var article = Articles.findOne({_id: articleId})
    if (article.user === this.userId)
        return Articles.find({_id: articleId})
    if (article.contributingPermissions == '0')
        return Articles.find({_id: articleId})
    else {
        if (article.contributingIds)
            if (!_.isEmpty(_.where(article.contributingIds, this.userId)))
                return Articles.find({_id: articleId})
        if (article.readingPermissions == '0')
            return Articles.find({_id: articleId}, {fields: {comments: 0}})
        else if (article.readingIds)
            if (!_.isEmpty(_.where(article.readingIds, this.userId)))
                return Articles.find({_id: articleId}, {fields: {comments: 0}})
    }
})
Meteor.publish(null, function () {
    if (this.userId)
        return Favorites.find({userId: this.userId}) ? Favorites.find({userId: this.userId}) : null;
});
Meteor.publish(null, function () {
    if (this.userId)
        return Meteor.users.find();
    else
        return Meteor.users.find({}, {fields: {username: 1}})
});
Meteor.publish(null, function () {
    if (this.userId)
        return Messages.find({$or: [{to: this.userId}, {from: this.userId}]})
})
Meteor.publish(null, function () {
    if (this.userId)
        return Stream.find({userId: this.userId})
})