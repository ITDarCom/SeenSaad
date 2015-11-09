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
        check(user, personalInformationSchema)

        Meteor.users.update({_id: this.userId}, {$set: user});
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
    },
    seenChangeMsg: function (id) {
        Messages.update({_id: id}, {$set: {reciver: 1}})
    }

});
var mySubmitFunc = function (error, state) {
    debugger
    if (!error) {
        if (state === "signUp") {
            Stream.insert({userId: Meteor.userId()})
            Favorites.insert({userId: Meteor.userId()})
        }
    }
};

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
            re = /^[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]$/
            if (!re.test(value))
                return true
            if (value.indexOf("--") != -1)
                return true;
            return false
        },

        errStr: 'اسم المستخدم يجب أن لا يحتوي سوى أحرف انجليزية واشارة - بشرط أن لا تتكرر اثنتان متتاليتان',
    },
    pwd
]);
AccountsTemplates.configure({
    enablePasswordChange: true,
    focusFirstInput: true,
    showLabels: false,
    showPlaceholders: true,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,
    homeRoutePath: '/profile',
    onSubmitHook: mySubmitFunc,
    enablePasswordChange: true,
    showForgotPasswordLink: true,
    enablePasswordChange: true,

});


emailSchema = new SimpleSchema({
    address: {
        type: String,
        optional: true,
        regEx: SimpleSchema.RegEx.Email,
        custom: function () {
            var user = Meteor.users.findOne({_id: Meteor.userId()});
            if (user.email) {
                if (user.email.address && user.email.address != this.value && Meteor.users.findOne({'email.address': this.value})) {
                    return "emailUsed"
                }
            }
            else {
                if (this.value && Meteor.users.findOne({'email.address': this.value})) {
                    return "emailUsed"
                }
            }

        }
    },
    verified: {
        type: Boolean,
        optional: true,
        autoform: {omit: true}
    },
    permission: {
        type: Boolean,
        autoform: {type: 'boolean-checkbox'},
        label: "مرئي؟"
    }
});
mobileSchema = new SimpleSchema({
    number: {
        type: Number,
        optional: true,
        regEx: /^[0-9]{2,30}$/,
    },
    verified: {
        type: Boolean,
        //defalutValue: false,
        optional: true,
        autoform: {omit: true}
    },
    permission: {
        type: Boolean,
        autoform: {type: 'boolean-checkbox'},
        label: "مرئي؟"
    }
});
SimpleSchema.messages({
    "usedUserName": "اسم المستخدم مستخدم من قبل .. يرجى استخدام غيره",
    "emailUsed": 'الايميل الذي أدخلته مستخدم مسبقاً'
})
SimpleSchema.messages({
    required: "هذا الحقل مطلوب ولا بدّ من إدخاله",
    regEx: [
        {msg: "[label] failed regular expression validation"},
        {
            exp: /^[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]$/,
            msg: "اسم المستخدم يجب أن لا يحتوي سوى أحرف انجليزية واشارة - بشرط أن لا تتكرر اثنتان متتاليتان"
        },
        {exp: SimpleSchema.RegEx.Email, msg: "بريد الكتروني خاطئ"}
    ],
})
personalInformationSchema = new SimpleSchema({
    username: {
        type: String,
        regEx: /^[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]$/,
        min: 3,
        max: 40,
        custom: function () {
            user = Meteor.users.findOne(Meteor.userId());
            if (Meteor.users.findOne({username: this.value}) && user.username != this.value)
                return "usedUserName"
        }
    },
    fullName: {
        type: Object,
        optional: true
    },
    'fullName.name': {
        type: String,
        min: 3,
        max: 30,
        optional: true,
    },
    'fullName.permission': {
        type: Boolean,
        autoform: {type: 'boolean-checkbox'},
        label: "مرئي؟"
    },
    email: {
        type: emailSchema,
        optional: true,
    },
    birthday: {type: Object, optional: true},
    'birthday.date': {
        type: Date,
        min: new Date(1980, 1, 1),
        max: new Date(2000, 1, 1),
        optional: true,
    },
    'birthday.permission': {
        type: Boolean,
        autoform: {type: 'boolean-checkbox'},
        label: "مرئي؟"
    },
    mobile: {
        type: mobileSchema,
        optional: true,
    }, gender: {type: Object, optional: true},
    'gender.value': {
        type: String,
        allowedValues: ['male', 'female'],
        autoform: {
            type: 'select-radio-inline',
            options: [{value: 'male', label: 'ذكر'}, {value: 'female', label: 'أنثى'}]
        },
        optional: true,
    },
    'gender.permission': {
        type: Boolean,
        autoform: {type: 'boolean-checkbox'},
        label: "مرئي؟"
    }
});