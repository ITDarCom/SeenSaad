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
                Articles.update({_id: docId}, {$addToSet: {favorite: this.userId}})
                Favorites.upsert({userId: this.userId}, {$push: {favorites: docId}})
            }
            else {
                Favorites.update({userId: this.userId}, {$pull: {favorites: docId}})
                Articles.update({_id: docId}, {$pull: {favorite: this.userId}})
            }
        }
    },
    permissionDeploy: function (articleId) {
        debugger
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
                        Stream.update({userId: id}, {$addToSet: {readingArticles: {id: articleId, seen: false}}})
                    else
                        Stream.upsert({userId: id}, {$addToSet: {readingArticles: {id: articleId, seen: false}}})
                })
            }
            if (doc.contributingIds != null) {
                _.each(doc.contributingIds, function (id) {
                    if (Stream.findOne({userId: id}))
                        Stream.update({userId: id}, {$addToSet: {contributingArticles: {id: articleId, seen: false}}})
                    else
                        Stream.upsert({userId: id}, {$addToSet: {contributingArticles: {id: articleId, seen: false}}})
                })
            }
        }
    },
    permissionUpdate: function (articleId, oldReadingIds, oldContributingIds) {
        debugger
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
                        Stream.update({userId: id}, {$addToSet: {contributingArticles: {id: articleId, seen: false}}})
                    else
                        Stream.upsert({userId: id}, {$addToSet: {contributingArticles: {id: articleId, seen: false}}})
                });
            if (deletedContributingIds.length > 0)
                _.each(deletedContributingIds, function (id) {
                    if (Stream.findOne({userId: id}))
                        Stream.update({userId: id}, {$pull: {contributingArticles: {id: articleId}}})
                    else
                        Stream.upsert({userId: id}, {$pull: {contributingArticles: {id: articleId}}})
                });
            if (newReadingIds.length > 0)
                _.each(newReadingIds, function (id) {
                    if (Stream.findOne({userId: id}))
                        Stream.update({userId: id}, {$addToSet: {readingArticles: {id: articleId, seen: false}}})
                    else
                        Stream.upsert({userId: id}, {$addToSet: {readingArticles: {id: articleId, seen: false}}})
                });
            if (deletedReadingIds.length > 0)
                _.each(deletedReadingIds, function (id) {
                    if (Stream.findOne({userId: id}))
                        Stream.update({userId: id}, {$pull: {readingArticles: {id: articleId, seen: false}}})
                    else
                        Stream.upsert({userId: id}, {$pull: {readingArticles: {id: articleId, seen: false}}})
                });


        }

    },
    readCounter: function (article, user) {
        check(article, String)
        if (Articles.findOne(article))
            if (user)
                Articles.update({_id: article}, {$inc: {read: 1}, $addToSet: {readers: user}})
            else  Articles.update({_id: article}, {$inc: {read: 1}})
    },
    deleteMyPic: function () {
        profilePicture.remove({owner: this.userId})
    },
    updateProfile: function (user) {
        mobileRegex = /^[0-9]{2,30}$/
        if (user.email && !SimpleSchema.RegEx.Email.test(user.email))
            return
        else if (user.mobile && !mobileRegex.test(user.mobile))
            return

        if ((typeof(user.email) != 'undefined' && SimpleSchema.RegEx.Email.test(user.email)))
            Meteor.users.update({_id: Meteor.userId()}, {$set: {email: user.email}})
        if (typeof(user.mobile) != 'undefined' && mobileRegex.test(user.mobile))
            Meteor.users.update({_id: Meteor.userId()}, {$set: {mobile: user.mobile}})
        if (typeof(user.firstName) != 'undefined')
            Meteor.users.update({_id: Meteor.userId()}, {$set: {firstName: user.firstName}})
        if (typeof(user.familyName) != 'undefined')
            Meteor.users.update({_id: Meteor.userId()}, {$set: {familyName: user.familyName}})
        if (typeof(user.gender) != 'undefined')
            Meteor.users.update({_id: Meteor.userId()}, {$set: {gender: user.gender}})
    },
    seenChange: function (articleId) {
        Stream.update({
            userId: Meteor.userId(),
            'readingArticles.id': articleId
        }, {$set: {'readingArticles.$.seen': true}})
        Stream.update({
            userId: Meteor.userId(),
            'contributingArticles.id': articleId
        }, {$set: {'contributingArticles.$.seen': true}})
    }

})
;
var pwd = AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');
AccountsTemplates.addFields([
    {
        _id: "username",
        type: "text",
        displayName: "اسم المستخدم",
        placeholder: 'اسم المستخدم',
        required: true,
        minLength: 3,
        func: function (value) {
            re = /^[a-zA-Z]+[a-z0-9\.\-]{4,30}$/
            if (!re.test(value))
                return true
            if (value.indexOf(".-") != -1 || value.indexOf(".-") != -1)
                return true;
            var dotCounter = dashCounter = 0
            _.each(value, function (e) {
                if (e == '.')
                    dotCounter++
                if (e == '-')
                    dashCounter++
            })
            if (dashCounter > 1 || dotCounter > 1)
                return true
            return false
        },

        errStr: 'يجب ألا يحوي إلا أحرفاً أجنبية أو أرقام ومسموح بنقطة واحدة أو إشارة - واحد',
    },
    pwd
]);
AccountsTemplates.configure({
    enablePasswordChange: true,
})