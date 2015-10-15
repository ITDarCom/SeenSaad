/**
 * Created by omar on 9/15/15.
 */

Meteor.methods({
    removeArticle: function (docId) {
        check(docId, String)
        var article = Articles.findOne(docId)
        if (article && article.user == this.userId)
            Articles.remove(docId);
    },
    favoriteIt: function (docId) {
        check(docId, String)
        var article = Articles.findOne(docId)
        if (article && this.userId) {
            if (!Favorites.findOne({userId: Meteor.userId(), favorites: {$in: [docId]}})) {
                Favorites.upsert({userId: this.userId}, {$push: {favorites: docId}})
            }
            else {
                Favorites.update({userId: this.userId}, {$pull: {favorites: docId}})
            }
        }
    },
    permissionDeploy: function (articleId) {
        check(articleId, String);
        var doc = Articles.findOne(articleId);
        if (doc && doc.user == this.userId) {
            if (doc.contributingPermissions == 0) {
                doc.readingPermissions = 0
                doc.contributingIds = null
            }
            if (doc.readingPermissions == 0)
                doc.readingIds = null
            if (doc.readingIds != null) {
                _.each(doc.readingIds, function (id) {
                    if (Stream.findOne({userId: id}))
                        Stream.update({userId: id}, {$push: {readingArticles: articleId}})
                    else
                        Stream.upsert({userId: id}, {$push: {readingArticles: articleId}})
                })
            }
            if (doc.contributingIds != null) {
                _.each(doc.contributingIds, function (id) {
                    if (Stream.findOne({userId: id}))
                        Stream.update({userId: id}, {$push: {contributingArticles: articleId}})
                    else
                        Stream.upsert({userId: id}, {$push: {contributingArticles: articleId}})
                })
            }
        }
    },
    deleteConversion: function (user) {
        if (this.userId) {
            Messages.remove({$and: [{$or: [{to: user}, {from: user}]}, {$or: [{to: this.userId}, {from: this.userId}]}]})
        }
    },
    permissionUpdate: function (articleId, oldReadingIds, oldContributingIds) {
        check(articleId, String);
        var doc = Articles.findOne(articleId);
        if (doc && doc.user == this.userId) {
            if (doc.contributingPermissions == 0) {
                Articles.update({_id: articleId}, {
                    $set: {readingPermissions: 0},
                    $unset: {contributingIds: ""},
                    $unset: {readingIds: ""}
                });
                return
            }
            if (doc.readingPermissions == 0) {
                Articles.update({_id: articleId}, {$unset: {readingIds: ""}})
            }
            var newContributingIds = _.difference(doc.contributingIds, oldContributingIds);
            var deletedContributingIds = _.difference(oldContributingIds, doc.contributingIds);
            var newReadingIds = _.difference(doc.readingIds, oldReadingIds);
            var deletedReadingIds = _.difference(oldReadingIds, doc.readingIds);
            if (newContributingIds.length > 0)
                _.each(newContributingIds, function (id) {
                    if (Stream.findOne({userId: id}))
                        Stream.update({userId: id}, {$push: {contributingArticles: articleId}})
                    else
                        Stream.upsert({userId: id}, {$push: {contributingArticles: articleId}})
                });
            if (deletedContributingIds.length > 0)
                _.each(deletedContributingIds, function (id) {
                    if (Stream.findOne({userId: id}))
                        Stream.update({userId: id}, {$pull: {contributingArticles: articleId}})
                    else
                        Stream.upsert({userId: id}, {$pull: {contributingArticles: articleId}})
                });
            if (newReadingIds.length > 0)
                _.each(newReadingIds, function (id) {
                    if (Stream.findOne({userId: id}))
                        Stream.update({userId: id}, {$push: {readingArticles: articleId}})
                    else
                        Stream.upsert({userId: id}, {$push: {readingArticles: articleId}})
                });
            if (deletedReadingIds.length > 0)
                _.each(deletedReadingIds, function (id) {
                    if (Stream.findOne({userId: id}))
                        Stream.update({userId: id}, {$pull: {readingArticles: articleId}})
                    else
                        Stream.upsert({userId: id}, {$pull: {readingArticles: articleId}})
                });


        }

    },
    readCounter: function (article) {
        check(article, String)
        if (Articles.findOne(article))
            Articles.update({_id: article}, {$inc: {read: 1}})
    }
});


