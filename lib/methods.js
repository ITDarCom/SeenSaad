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
    setPersonalInformation: function (field, newValue) {
        check(field, String);
        check(newValue, String);
        if (this.userId)
            switch (field) {
                case "profile.emails":
                    re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/igm
                    if (re.test(newValue)) {
                        email = {address: newValue, verified: false}
                        Meteor.users.update({_id: this.userId}, {$unset: {emails: ""}})
                        Meteor.users.update({_id: this.userId}, {$push: {emails: email}})
                    }
                    break;
                case "profile.firstName" :
                    Meteor.users.update({_id: this.userId}, {$set: {firstName: newValue}})
                    break;
                case "profile.familyName":
                    Meteor.users.update({_id: this.userId}, {$set: {familyName: newValue}})
                    break;
                case "profile.mobile":
                    if (newValue.match(/^(\+\d{1,3}[- ]?)?\d{10}$/))
                        Meteor.users.update({_id: this.userId}, {$set: {mobile: newValue}})
                    break;
            }

    }
});
var pwd = AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');
AccountsTemplates.addFields([
    {
        _id: "username",
        type: "text",
        re: / ^[a-zA-Z]+[a-z0-9]{4,30}$/,
        displayName: "اسم المستخدم",
        placeholder: 'اسم المستخدم',
        func: function (value) {
            if (_.contains(value, "-.") || _.contains(value, ".-"))
                return false;
            var dotCounter = dashCounter = 0
            _.each(value, function (e) {
                if (e == '.')
                    dotCounter++
                if (e == '-')
                    dashCounter++
            })
            if (dashCounter > 1 || dotCounter > 1)
                return false
            return true
        },
        required: true,
        minLength: 3
    },
    pwd
]);
AccountsTemplates.configure({
    enablePasswordChange: true,
})