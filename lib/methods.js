/**
 * Created by omar on 9/15/15.
 */
Meteor.methods({
    favoriteIt: function (docId) {
        check(docId, String);
        var article = Articles.findOne(docId);
        if (article && this.userId) {
            if (!Favorites.findOne({userId: Meteor.userId(), favorites: {$in: [docId]}})) {
                Favorites.upsert({userId: this.userId}, {$push: {favorites: docId}});
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
                        Stream.update({userId: id}, {$addToSet: {readingArticles: {id: articleId, seen: false,newComment:false}}});
                    else
                        Stream.upsert({userId: id}, {$addToSet: {readingArticles: {id: articleId, seen: false,newComment:false}}})
                })
            }
            if (doc.contributingIds != null) {
                _.each(doc.contributingIds, function (id) {
                    if (Stream.findOne({userId: id}))
                        Stream.update({userId: id}, {$addToSet: {contributingArticles: {id: articleId, seen: false,newComment:false}}});
                    else
                        Stream.upsert({userId: id}, {$addToSet: {contributingArticles: {id: articleId, seen: false,newComment:false}}})
                })
            }
        }
    }
    ,
    permissionUpdate: function (articleId, oldReadingIds, oldContributingIds) {
        check(articleId, String);
        var doc = Articles.findOne(articleId);
        revokePermissions = function (ids, flag) {
            _.each(ids, function (id) {
                if (flag)
                    Stream.upsert({userId: id}, {$pull: {contributingArticles: {id: articleId, seen: false,newComment:false}}});

                else
                    Stream.upsert({userId: id}, {$pull: {readingArticles: {id: articleId, seen: false,newComment:false}}});
            })
        }
        grantPermissions = function (ids, flag) {
            _.each(ids, function (id) {
                if (flag)
                    Stream.update({userId: id}, {$addToSet: {contributingArticles: {id: articleId, seen: false,newComment:false}}});

                else
                    Stream.update({userId: id}, {$addToSet: {readingArticles: {id: articleId, seen: false,newComment:false}}});
            });
        }

        if (doc && doc.user == this.userId) {
            if (doc.contributingPermissions == 0) {
                if (doc.readingIds && doc.readingIds.length > 0) {
                    revokePermissions(doc.readingIds, false)
                }
                if (doc.contributingIds && doc.contributingIds.length > 0) {
                    revokePermissions(doc.contributingIds, true)
                }
                Articles.update({_id: articleId}, {
                    $set: {readingPermissions: 0},
                    $unset: {contributingIds: "", readingIds: ""}
                });
                return
            }
            if (doc.readingPermissions == 0) {
                if (doc.readingIds && doc.readingIds.length > 0) {
                    revokePermissions(doc.readingIds, false)
                }

                Articles.update({_id: articleId}, {$unset: {readingIds: ""}})
            }
            var newContributingIds = _.difference(doc.contributingIds, oldContributingIds);
            var deletedContributingIds = _.difference(oldContributingIds, doc.contributingIds);
            var newReadingIds = _.difference(doc.readingIds, oldReadingIds);
            var deletedReadingIds = _.difference(oldReadingIds, doc.readingIds);
            if (newContributingIds.length > 0) {
                grantPermissions(newContributingIds, true);
            }
            if (deletedContributingIds.length > 0)
                revokePermissions(deletedContributingIds, true);
            if (newReadingIds.length > 0) {
                grantPermissions(newReadingIds, false);
            }
            if (deletedReadingIds.length > 0)
                revokePermissions(deletedReadingIds, false);
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
        }, {$set: {'readingArticles.$.seen': true, 'readingArticles.$.newComment': false}});
        Stream.update({
            userId: Meteor.userId(),
            'contributingArticles.id': articleId
        }, {$set: {'contributingArticles.$.seen': true, 'contributingArticles.$.newComment': false}});
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
                Accounts.setUsername(Meteor.userId(), newName);
            }
        }
    }
    ,
    addComment: function (doc) {
        //if (Meteor.isServer) {
        //    Meteor._sleepForMs(2000);
        //}
         doc.commenter = Meteor.userId();
        doc.createdAt = new Date();
        check(doc, commentsSchema);
        this.unblock();
        var article = Articles.findOne(doc.articleId);
        if (article) {
            if (article.user == this.userId || article.contributingPermissions == 0 ||
                (article.contributingPermissions == 1 && _.contains(article.contributingIds, this.userId))) {
                Comments.insert(doc, function (err, result) {
                    if (!err) {
                        Articles.update({_id: doc.articleId}, {$inc: {commentsCounter: 1}});//for reactivity we make 2 command
                        Articles.update({_id: doc.articleId}, {$set: {generalDate: new Date()}});
                        if (article.contributingPermissions == 1 || article.readingPermissions == 1) {
                            _.each(article.contributingIds, function (userId) {
                                Stream.update({
                                    userId: userId,
                                    'contributingArticles.id': doc.articleId
                                }, {$set: {'contributingArticles.$.newComment': true}});
                            });
                            _.each(article.readingIds, function (userId) {
                                Stream.update({userId: userId, 'readingArticles.id': doc.articleId}, {$set: {'readingArticles.$.newComment': true}});
                            });
                        }
                    }
                })
            }
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
        var comment = Comments.findOne(id);
        var article = Articles.findOne(comment.articleId);
        if (article.user == Meteor.userId() || (comment.commenter == Meteor.userId() &&
            (new Date().getTime() - comment.createdAt.getTime() < 600 * 1000) )) {
            Comments.remove(id, function (err, result) {
                if (!err) {
                    Articles.update({_id: article._id}, {$inc: {commentsCounter: -1}});
                }
            });
        }
    },
    updateComment: function (id, newText) {
        var comment = Comments.findOne(id);
        if (comment.commenter == Meteor.userId()) {
            if (new Date().getTime() - comment.createdAt.getTime() < 600 * 1000) {
                Comments.update({_id: comment._id}, {$set: {commentText: newText}})
            }
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
        if (modifier.$set.contributingIds) {
            if (modifier.$set.readingIds) {
                _.each(_.intersection(modifier.$set.readingIds, modifier.$set.contributingIds), function (u) {
                    modifier.$set.readingIds = _.without(modifier.$set.readingIds, u);
                });
            }
        }
        var article = Articles.findOne(docId);
        if (article.user === Meteor.userId()) {
            var oldReadingIds = article.readingIds, oldContributingIds = article.contributingIds;
            modifier.$set._id = modifier.$set.user = undefined;
            modifier.$set.read = modifier.$set.createdAt = undefined;
            var unsetPermission;
            if (allowedUpdateTime(article.createdAt)) {
                var oldReadingIds = article.readingIds, oldContributingIds = article.contributingIds;

                if (modifier.$unset) {
                    var unsetPermission = _.pick(modifier.$unset, ['readingIds', 'contributingIds']);
                }
                var set = {$set: modifier.$set, $unset: unsetPermission}; //remove the other modifiers
                Articles.update({_id: docId}, set, function (err) {
                    if (!err) {
                        Meteor.call("permissionUpdate", docId, oldReadingIds, oldContributingIds)
                    }
                })
            }
            else {
                modifier.$set.body = undefined;// for  to editing the body
                modifier.$set.title = undefined;//for  to editing the title
                if (modifier.$set.addition) {
                    var article = Articles.findOne(docId);
                    var body = article.body;
                    if (Meteor.isServer) {
                        var additions = Addition.getAdditions(article.body);
                        if (additions && additions.length) {
                            var lastAddition = additions[additions.length - 1]
                            if (allowedUpdateTime(Addition.date(lastAddition), true)) {
                                var temp = body.slice(0, body.lastIndexOf('<div'));
                                var additionCreatedAt = Addition.date(lastAddition);
                                body = temp;
                                modifier.$set.body = body.concat(Addition.make(modifier.$set.addition, additionCreatedAt));
                            }
                            else {
                                modifier.$set.body = body.concat(Addition.make(modifier.$set.addition));
                            }
                        }
                        else {
                            modifier.$set.body = body.concat(Addition.make(modifier.$set.addition));
                        }
                    }
                }
                if (modifier.$unset) {
                    var unsetPermission = _.pick(modifier.$unset, ['readingIds', 'contributingIds']);
                }
                var set = {$set: modifier.$set, $unset: unsetPermission}; //remove the other modifiers
                Articles.update({_id: docId}, set, {getAutoValues: false}, function (err, result) {
                    if (!err) {
                        if (Meteor.isClient) {
                            Router.go('global', {id: docId});
                        }
                        Meteor.call("permissionUpdate", docId, oldReadingIds, oldContributingIds);
                    }
                });
            }
        }
    },
    removeAddition: function (articleId, addition) {
        var article = Articles.findOne(articleId)
        if (article.user === Meteor.userId()) {
            var additions = Addition.getAdditions(article.body);
            if (additions && additions[addition]) {
                delete  additions[addition];
                var Body = article.body.slice(0, article.body.lastIndexOf('<div'))
                Articles.update({_id: articleId}, {$set: {body: Body.concat(additions)}}, {getAutoValues: false})
            }
        }
    },
    usernamesSearc: function (partialName) {
        check(partialName, String);
        var results = Meteor.users.find({
            username: {
                '$regex': '^' + partialName,
                '$options': 'i'
            },
            limit: 5,
            fields: {
                _id: 1,
                username: 1
            }
        }).fetch();

        return {
            results: results
        };
    },
    usernamesSearch: function (partialName) {
        check(partialName, String);

        var results = Meteor.users.find({
            username: {
                '$regex': '^' + partialName,
                '$options': 'i'
            }
        }, {
            limit: 10,
            fields: {
                _id: 1,
                username: 1
            }
        }).fetch();

        return {
            results: results
        };
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
    date: function (addition) {
        return parseInt(addition.substring(addition.indexOf('data-createdAt=') + 15, addition.indexOf('>')));
    },
    make: function (addition, createdAt) {
        var sanitizedString = sanitizeHtml(addition, {
            allowedTags: ['a', 'span', 'br', 'p', 'ol', 'li', 'table', 'tbody', 'tr', 'td', 'img'],
            allowedAttributes: {
                '*': ['href', 'align', 'alt', 'center', 'style', 'class', 'src']
            }
        });
        return ("<div class='addition" + Random.id(2) + " well' data-createdAt=" +
        (createdAt || new Date().getTime()) + ">" + sanitizedString + "</div>");

    },
    getAdditions: function (body) {
        return body.match(/<div(.*?)div>/ig)
    },
    getText: function (addition) {
        return addition.slice(addition.indexOf('>') + 1, addition.lastIndexOf('<'))
    }
}




