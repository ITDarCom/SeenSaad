Meteor.publish("publicArticles", function () {
    if (!this.userId)
        return Articles.find({$or: [{readingPermissions: '0'}, {contributingPermissions: '0'}, {user: this.userId}]}, {
            fields: {
                title: 1,
                user: 1,
                createdAt: 1
            }
        })
    else {
        var custom = Stream.findOne({userId: this.userId})
        readingArticles = custom.readingArticles ? custom.readingArticles : []
        contributingArticles = custom.contributingArticles ? custom.contributingArticles : [];
        debugger
        return Articles.find({$or: [{readingPermissions: "0"}, {user: this.userId}, {_id: {$in: readingArticles}}, {_id: {$in: contributingArticles}}, {contributingPermissions: "0"}]}, {sort: {createdAt: -1}}, {limit: 50});
    }

});
Meteor.publish("favoritedArticles", function () {
    if (this.userId) {
    var ids = Favorites.findOne({userId: this.userId});
        return Articles.find({_id: {$in: ids.favorites ? ids.favorites : []}}, {sort: {createdAt: -1}});
    }
    return false
});
Meteor.publish("readingArticles", function () {
    if (this.userId) {
    var custom = Stream.findOne({userId: this.userId})
    readingArticles = custom.readingArticles ? custom.readingArticles : []
        return Articles.find({_id: {$in: readingArticles}});
    }
})
Meteor.publish("contributingArticles", function () {
    if (this.userId) {
    var custom = Stream.findOne({userId: this.userId})
    contributingArticles = custom.contributingArticles ? custom.contributingArticles : []
        return Articles.find({_id: {$in: contributingArticles}});
    }
})
Meteor.publish("myArticles", function () {
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
        return Favorites.find({userId: this.userId});
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