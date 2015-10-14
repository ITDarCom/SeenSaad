Meteor.publish(null, function () {   // Articles publishment
    if (this.userId) {
        var userStream = Stream.findOne({userId: this.userId});
        var userFavorites = Favorites.findOne({userId: this.userId});
        var publicReadingArticles = {readingPermissions: 0}, publicContributingArticles = {contributingPermissions: '0'}, myArticles = {user: this.userId};
        var myReadingArticles = {_id: {$in: userStream.readingArticles}}, myContributingArticles = {_id: {$in: userStream.contributingArticles}}, favoriteArticles = {_id: {$in: userFavorites.favorites}};
        return Articles.find({$or: [publicReadingArticles, publicContributingArticles, myArticles, myReadingArticles, myContributingArticles, favoriteArticles]}, {
            fields: {
                title: 1,
                username: 1,
                createdAt: 1
            }
        })
    }
    else {
        return Articles.find({$or: [{readingPermissions: '0'}, {contributingPermissions: '0'}]}, {
            fields: {
                title: 1,
                username: 1,
                createdAt: 1
            }
        })


    }
});

Meteor.publish(null, function () { //favorites row for user
    if (this.userId)
        return Favorites.find({userId: this.userId});
});
Meteor.publish("Article", function (articleId) {  // Article details

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

Meteor.publish(null, function () {  //usersNames publish
    if (this.userId)
        return Meteor.users.find();
    else
        return Meteor.users.find({}, {fields: {username: 1}})
});
Meteor.publish(null, function () {   // messages publish
    if (this.userId)
        return Messages.find({$or: [{to: this.userId}, {from: this.userId}]})
})
Meteor.publish(null, function () {  //publish stream
    if (this.userId)
        return Stream.find({userId: this.userId})
})