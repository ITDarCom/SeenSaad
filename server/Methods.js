/**
 * Created by omar on 1/24/16.
 */

Meteor.methods({
    removeArticle: function (docId) {
        check(docId, String);
        var article = Articles.findOne(docId);
        if (article && article.user == this.userId)
            Articles.update({_id: docId}, {$set: {deleted: true}}, {filter: false}, function (err, result) {
                Meteor.call("removePermissions", article._id);
            });
    },
    removePermissions: function (articleId) {
        var article = Articles.findOne(articleId);
        if (article && article.user == Meteor.userId()) {
            if (article.readingPermissions == 0 && article.contributingPermissions == 0) {
                return;
            }
            if (article.readingPermissions == 1 && article.readingIds.length > 0) {
                revokePermissions(article.readingIds);
            }
            if (article.contributingPermissions == 1 && article.contributingIds.length > 0) {
                revokePermissions(article.contributingIds, true);
            }


            revokePermissions = function (ids, flag) {
                _.each(ids, function (id) {
                    if (flag)
                        Stream.upsert({userId: id}, {
                            $pull: {
                                contributingArticles: {
                                    id: articleId,
                                    seen: false,
                                    newComment: false
                                }
                            }
                        });

                    else
                        Stream.upsert({userId: id}, {
                            $pull: {
                                readingArticles: {
                                    id: articleId,
                                    seen: false,
                                    newComment: false
                                }
                            }
                        });
                })
            }
        }
    },
    'setNewPasswd': function (userId,pwd) {
        if (_.contains(Admins, Meteor.user().username)) {
            Accounts.setPassword(userId, pwd)
        }

    }

})
