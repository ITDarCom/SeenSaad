/**
 * Created by omar on 9/15/15.
 */
Meteor.methods({
    removeArticle: function (docId) {
        check(docId, String);
        var article = Articles.findOne(docId);
        if (article && article.user == this.userId)
            Articles.remove(docId);
    }
    ,
    favoriteIt: function (docId) {
        check(docId, String);
        var article = Articles.findOne(docId);
        if (article && this.userId) {
            if (!Favorites.findOne({userId: Meteor.userId(), favorites: {$in: [docId]}})) {
                Favorites.upsert({userId: this.userId}, {$push: {favorites: docId}})
            }
            else {
                Favorites.update({userId: this.userId}, {$pull: {favorites: docId}});
            }
        }
    }
    ,
    permissionDeploy: function (articleId) {
        check(articleId, String);
        var doc = Articles.findOne(articleId);
        if (doc && doc.user == this.userId) {
            if (doc.contributingPermissions == 0) {
                doc.readingPermissions = 0;
                doc.contributingIds = null;
            }
            if (doc.readingPermissions == 0)
                doc.readingIds = null;
            if (doc.readingIds != null) {
                _.each(doc.readingIds, function (id) {
                    if (Stream.findOne({userId: id}))
                        Stream.update({userId: id}, {$addToSet: {readingArticles: {id: articleId, seen: false}}});
                    else
                        Stream.upsert({userId: id}, {$addToSet: {readingArticles: {id: articleId, seen: false}}})
                })
            }
            if (doc.contributingIds != null) {
                _.each(doc.contributingIds, function (id) {
                    if (Stream.findOne({userId: id}))
                        Stream.update({userId: id}, {$addToSet: {contributingArticles: {id: articleId, seen: false}}});
                    else
                        Stream.upsert({userId: id}, {$addToSet: {contributingArticles: {id: articleId, seen: false}}})
                })
            }
        }
    }
    ,
    permissionUpdate: function (articleId, oldReadingIds, oldContributingIds) {
        check(articleId, String);
        var doc = Articles.findOne(articleId);
        if (doc && doc.user == this.userId) {
            if (doc.contributingPermissions == 0) {
                Articles.update({_id: articleId}, {
                    $set: {readingPermissions: 0},
                    $unset: {contributingIds: "", readingIds: ""}
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
                        Stream.update({userId: id}, {$addToSet: {contributingArticles: {id: articleId, seen: false}}});
                    else
                        Stream.upsert({userId: id}, {$addToSet: {contributingArticles: {id: articleId, seen: false}}})
                });
            if (deletedContributingIds.length > 0)
                _.each(deletedContributingIds, function (id) {
                    if (Stream.findOne({userId: id}))
                        Stream.update({userId: id}, {$pull: {contributingArticles: {id: articleId}}});
                    else
                        Stream.upsert({userId: id}, {$pull: {contributingArticles: {id: articleId}}})
                });
            if (newReadingIds.length > 0)
                _.each(newReadingIds, function (id) {
                    if (Stream.findOne({userId: id}))
                        Stream.update({userId: id}, {$addToSet: {readingArticles: {id: articleId, seen: false}}});
                    else
                        Stream.upsert({userId: id}, {$addToSet: {readingArticles: {id: articleId, seen: false}}})
                });
            if (deletedReadingIds.length > 0)
                _.each(deletedReadingIds, function (id) {
                    if (Stream.findOne({userId: id}))
                        Stream.update({userId: id}, {$pull: {readingArticles: {id: articleId, seen: false}}});
                    else
                        Stream.upsert({userId: id}, {$pull: {readingArticles: {id: articleId, seen: false}}})
                });
        }

    }
    ,
    readCounter: function (article) {
        check(article, String);
        if (Articles.findOne(article))
            Articles.update({_id: article}, {$inc: {read: 1}})
    }
    ,
    deleteMyPic: function () {
        profilePicture.remove({owner: this.userId})
    }
    ,
    seenChange: function (articleId) {
        Stream.update({
            userId: Meteor.userId(),
            'readingArticles.id': articleId
        }, {$set: {'readingArticles.$.seen': true}});
        Stream.update({
            userId: Meteor.userId(),
            'contributingArticles.id': articleId
        }, {$set: {'contributingArticles.$.seen': true}});
    }
    ,
    seenChangeMsg: function (id) {
        Messages.update({_id: id}, {$set: {reciver: 1}});
    }
    ,
    setNewUserName: function (newName) {
        if (Meteor.isServer) {
            if (newName.indexOf("--") != -1) {
                return false;
            }
            check(newName, String);
            if (!Meteor.users.findOne({username: newName})) {
                //noinspection JSUnresolvedFunction
                Accounts.setUsername(this.userId, newName);
            }
        }
    }
    ,
    addComment: function (doc) {
        check(doc, commentsSchema);
        this.unblock();
        var article = Articles.findOne(doc.articleId);
        if (article) {
            if (article.user == this.userId || article.contributingPermissions == 0 ||
                (article.contributingPermissions == 1 && _.contains(article.contributingIds, this.userId))) {
                Comments.insert(doc)
            }
        }

    }
    ,
    commentsCounter: function (id) {
        var article = Articles.findOne({_id: id}, {fields: {readingPermissions: 1, readingIds: 1, user: 1}});
        if (article.readingPermissions == 0 || article.user == this.userId
            || _.contains(article.readingIds, this.userId)) {
            return [Comments.find({articleId: id}).count(), id];
        }
    }
    ,
    getArticlesCounter: function (id) {
        return Articles.find({user: id}).count()
    }
    ,
    getCommentsCounter: function (id) {
        return Comments.find({commenter: id}).count();
    }
    ,
    deleteComment: function (id) {
        if (Articles.findOne(Comments.findOne(id).articleId).user == this.userId) {
            Comments.remove(id);
        }
    }
    ,
    addText: function (doc) {
        debugger;
        check(doc, ArticleSchema);
        var article = Articles.findOne(doc.articleId);
        if (article && article.user == this.userId) {
            if (doc.text) {
                if (!allowedUpdateTime(articleTexts.findOne({articleId: this._id}, {sort: {createdAtText: -1}}).createdAtText)) {
                    doc.createdAt = new Date();
                    if (articleTexts.find({articleId: article._id}).count() == 0) {
                        articleTexts.insert(doc);
                    }
                }
            }
            var oldContributingIds = article.contributingIds;
            var oldReadingIds = article.readingIds;

            Articles.update({_id: article._id}, {
                $set: {
                    contributingPermissions: doc.contritbutingPermission
                    ,
                    readingPermissions: doc.readingPermissions,
                    readingIds: doc.readingIds,
                    contributingIds: doc.contributingIds
                }
            }, function (err) {
                if (!err) {
                    Meteor.call('permissionUpdate', doc.articleId, oldReadingIds, oldContributingIds)
                }
            })
        }
    },
    addArticle: function (doc) {
        if (Meteor.userId()) {
            var result = Articles.insert(doc, function (err, result) {
                if (!err) {
                    Meteor.call('permissionDeploy', result);
                }
            });
            return result
        }
    },
    updateArticle: function (modifier, docId) {
        check(docId, String);
        check(modifier, Object);
        var article = Articles.findOne(docId);
        if (article.user === Meteor.userId()) {
            modifier.$set.createdAt = undefined;
            modifier.$set.read = undefined;
            modifier.$set.user = undefined;
            modifier.$set._id = undefined;
            if (allowedUpdateTime(article.createdAt)) {

                var oldReadingIds = article.readingIds, oldContributingIds = article.contributingIds;
                var set = {$set: modifier.$set};
                Articles.update({_id: docId}, set, function (err) {
                    if (!err) {
                        Meteor.call("permissionUpdate", docId, oldReadingIds, oldContributingIds)
                    }
                })
            }
            else {
                if (modifier.$set.addition) {
                    var article = Articles.findOne(docId);
                    var body = article.body;
                    if (Meteor.isClient) {
                        var newBody = body + Addition.make(modifier.$set.addition);
                        Articles.update({_id: docId}, {$set: {body: newBody}})
                    }
                    if (Meteor.isServer) {
                        var additions = article.body.match(/<div(.*?)div>/ig);

                        if (additions && additions.length) {
                            var lastAddition = additions[additions.length - 1]
                            if (allowedUpdateTime(Addition.date(lastAddition), true)) {
                                var temp = body.substring(0, body.lastIndexOf('<div') - 1);
                                body = temp;
                                modifier.$set.body = body.concat(Addition.make(modifier.$set.addition));

                            }
                            else {
                                modifier.$set.body = body.concat(Addition.make(modifier.$set.addition));

                            }
                        }
                        else {
                            modifier.$set.body = body.concat(Addition.make(modifier.$set.addition));
                        }
                        delete modifier.$set.createdAt;
                        delete modifier.$set.addition;
                        delete modifier.$set.read;
                        delete modifier.$set.user;
                        Articles.update({_id: docId}, modifier, {getAutoValues: false});
                    }
                }
            }
        }
    }
});

allowedUpdateTime = function (date, flag) {
    var converted;
    if (!flag) {
        converted = date.getTime();
    }
    else {
        converted = date
    }
    if ((new Date()).getTime() - converted < 3600 * 1000) {
        return true;
    }
    else {
        return false;
    }
};

Addition = {
    date: function (addtion) {
        return parseInt(addtion.substring(addtion.indexOf('data-createdAt=') + 15, addtion.indexOf('>')));
    },
    make: function (addition) {
        var sanitizedString = sanitizeHtml(addition, {
            allowedTags: ['a', 'span', 'br', 'p', 'ol', 'li', 'table', 'tbody', 'tr', 'td', 'img'],
            allowedAttributes: {
                '*': ['href', 'align', 'alt', 'center', 'style', 'class', 'src']
            }
        });
        return ("<div class='addition" + Random.id(2) + " well' data-createdAt=" +
        new Date().getTime() + ">" + sanitizedString + "</div>");

    }
}




