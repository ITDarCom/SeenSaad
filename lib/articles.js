Articles = new Mongo.Collection("articles");
Articles.allow({
    insert: function (userId) {
        return userId;
    },
    remove: function (userId, doc) {
        return (doc.user == userId)
    },
    update: function (userId, doc, fields, modifier) {
        if ((doc.user == userId)) {
            {
                return true;
            }
        }
        //noinspection JSUnresolvedVariable
        if (_.contains(doc.contributingIds, userId) || doc.contributingPermissions == 0) {
            {
                if ((modifier["$push"] && modifier["$push"].comments) || (modifier["$inc"] && modifier["$inc"].read)
                    || (modifier["$addToSet"] && modifier["$addToSet"].readers))
                    return true;
            }

        }
    }
});
Articles.deny({
    update: function (userId, doc, fields) {
        var now = new Date();
        var createdAt = doc.createdAt;
        debugger;
        if ((now.getTime() - createdAt.getTime() > (600 * 1000)) && !_.isEmpty(_.intersection(fields, ['body', 'title']))) {
            return true;
        }
        if (doc.user != userId) {
            //noinspection JSUnresolvedVariable
            _.each(fields, function (f) {
                //noinspection JSUnresolvedVariable
                if (_.contains(['title', 'body', 'contributingIds', 'contributingPermissions', 'readingIds', 'readingPermissions'], f))
                    return true;
            })
        }

    }
});
//noinspection JSUnusedGlobalSymbols
ArticleSchema = new SimpleSchema({  // simpleSchema from package collection2 used to organize the operation of (insert-update)
// opretions in collections
    _id: {
        type: String,
        autoValue: function () {
            if (this.isInsert && !this.isSet) {
                var id = Random.id(6);
                while (Articles.findOne(id)) {
                    id = Random.id(6);
                }
                return id;
            }
            else
                return this.value;
        },
        unique: true
    },
    title: {
        type: String,
        label: 'العنوان',
        min: 3,
        max: 250
    },
    body: {
        type: String,
        label: 'الموضوع',
        min: 3,
        max: 10000,
        autoValue: function () {
            if (Meteor.isServer) {
                if (this.isInsert && this.isSet) { //noinspection JSUnresolvedFunction
                    return sanitizeHtml(this.value, {
                        allowedTags: ['a', 'span', 'br', 'p', 'ol', 'li', 'table', 'tbody', 'tr', 'td', 'img'],
                        allowedAttributes: {
                            '*': ['href', 'align', 'alt', 'center', 'style', 'class', 'src']
                        }
                    });
                }
                if (this.isUpdate) {
                    if (((new Date()).getTime() - Articles.findOne(this.docId).createdAt) > 600 * 1000) {
                        this.unset();
                    }
                }
            }
            else {
                return this.value;
            }
        },
        autoform: {
            afFieldInput: {
                type: 'summernote',
                class: 'editor', // optional
                settings: {
                    //for other options : summernote.org
                    lang: 'ar-AR', height: 200,
                    toolbar: [
                        ['style', ['style', 'bold', 'italic', 'underline', 'clear']],
                        ['fontsize', ['fontsize']],
                        ['para', ['ul', 'ol', 'paragraph']],
                        ['insert', ['picture', 'link', 'table', 'hr']],
                        ['misc', ['undo', 'redo', 'fullscreen', 'help']]
                    ],
                    onImageUpload: function (files) {
                        var fsFile = new FS.File(files[0]);
                        fsFile.owner = this.userId;
                        Images.insert(fsFile, function (err, fileObj) {
                            // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
                            if (err) {
                            }
                            else {
                                Tracker.autorun(function (computation) {
                                    var file = Images.findOne(fileObj._id);
                                    if (file.url()) {
                                        $('.editor').summernote('insertImage', file.url());
                                        $('img').addClass('img-responsive');
                                        return;
                                        // Thumbnail is available. Do something.
                                        //noinspection UnreachableCodeJS
                                        computation.stop();
                                    }
                                });
                            }
                        })
                    }
                    ,
                    onMediaDelete: function ($target) {
                        var url = $target[0].src;
                        var id = url.substring((url.lastIndexOf("/") + 1));
                        Images.remove({_id: id});
                        $target.remove();
                    }
                }
            }
        }
    },
    read: {
        type: Number,
        autoform: {omit: true},
        autoValue: function () {
            if (this.isInsert) {
                return 0;
            }
        }
    },
    readingPermissions: {
        type: String,
        label: 'المشاهدة',
        optional: true,
        autoform: {
            afFieldInput: {
                type: "select"
            },
            defaultValue: 0,
            firstOption: false,
            options: function () {
                return [
                    {label: "عام", value: 0},
                    {label: "خاص", value: 1}
                ];
            }
        }
    }, readingIds: {
        type: [String],
        label: "صلاحيات المشاهدة فقط:",
        optional: true,
        autoform: {
            type: function () {
                return "select2"
            },
            afFieldInput: {
                multiple: true
            }
        }
    }, contributingPermissions: {
        type: String,
        label: 'المشاركة',
        autoform: {
            type: "select",
            firstOption: false,
            defaultValue: 0,
            options: function () {
                return [
                    {label: 'عام', value: 0},
                    {label: 'خاص', value: 1}
                ];
            }
        }
    },
    contributingIds: {
        type: [String],
        optional: true,
        autoform: {
            type: "select2",
            afFieldInput: {
                multiple: true
            }
        }
    },
    user: {
        type: String,
        autoform: {omit: true},
        autoValue: function () {
            if (this.isInsert) {
                return this.userId;
            }
            if (this.isUpdate) {
                this.unset();
            }
        }
    },
    createdAt: {
        type: Date,
        autoform: {omit: true},
        autoValue: function () {
            if (this.isInsert) {
                return new Date();
            }
            if (this.isUpdate) {
                this.unset();
            }
        }
    }
});
Articles.attachSchema(ArticleSchema);
//==========
Comments = new Mongo.Collection('comments');
Comments.allow({
    insert: function (userId, doc) {
        var article = Articles.findOne(doc.articleId);
        if (article && (article.user == this.userId || article.contributingPermissions == 0
            || _.contains(article.contributingIds, this.userId))) {
            return true;
        }
    }
});
commentsSchema = (new SimpleSchema({
    articleId: {
        type: String,
        custom: function () {
            var article = Articles.findOne(this.value);
            if (!article || (article.contributingPermissions != 0 && !_.contains(article.contributingIds, this.userId))) {
                return 'not a permitted';
            }
        }

    },
    createdAt: {
        type: Date,
        autoform: {omit: true},
        autoValue: function () {
            return new Date();
        }
    },
    commenter: {
        type: String,
        autoform: {omit: true},
        autoValue: function () {
            return this.userId;
        }
    },
    commentText: {
        type: String,
        label: 'التعليق',
        min: 1,
        max: 300,
        autoValue: function () {
            if (this.isInsert && this.isSet) {
                var regex = /(<([^>]+)>)/ig;
                return this.value.replace(regex, "").trim()
            }
        },
        autoform: {
            afFieldInput: {
                type: 'textarea',
                class: 'commentTextarea form-control'
            }
        }
    }

}));
Comments.attachSchema(commentsSchema);
//noinspection JSUnresolvedFunctiona
Articles.initEasySearch(['body', 'title'], {
    'limit': 20,
    'use': 'mongo-db'
});
if (Meteor.isClient) {
    var options = {
        keepHistory: 1000 * 60 * 5,
        localSearch: true
    };
    var fields = ['title', 'body', 'username'];
    articlesSearch = new SearchSource('articles', fields, options);
}
if (Meteor.isServer) {
    SearchSource.defineSource('articles', function (searchText) {
        var options = {sort: {createdAt: -1}, limit: 20};
        if (searchText) {
            var regExp = buildRegExp(searchText);
            var selectorSearch = {
                $or: [
                    {title: regExp},
                    {body: regExp},
                    {username: regExp}
                ]
            };
            var custom = Stream.findOne({userId: this.userId});
            var selectorPermissions;
            if (custom) {
                var readingArticles = custom.readingArticles ? custom.readingArticles : [];
                var contributingArticles = custom.contributingArticles ? custom.contributingArticles : [];
                selectorPermissions = {
                    $or: [{readingPermissions: "0"}, {_id: {$in: readingArticles}}
                        , {_id: {$in: contributingArticles}}, {contributingPermissions: "0"}, {user: this.userId}]
                };
                return Articles.find({$and: [selectorSearch, selectorPermissions]}, options).fetch();
            }
            else {
                selectorPermissions = {
                    $or: [{readingPermissions: "0"}, {contributingPermissions: "0"}, {user: this.userId}]
                };
                return Articles.find({$and: [selectorSearch, selectorPermissions]}, options).fetch();
            }
        }
    });
    function buildRegExp(searchText) {
        // this is a dumb implementation
        var parts = searchText.trim().split(/[\-:]+/);
        return new RegExp("(" + parts.join('|') + ")", "ig");
    }
}
articlesExtension = new Mongo.Collection('articlesExtensions');
extensionSchema = new SimpleSchema({
    articleId: {
        type: String,
        autoform: {omit: true},
        custom: function () {
            var article = Articles.findOne(this.value);
            if (!article || article.user != this.userId) {
                return 'not permitted';
            }
        }
    },
    extensionText: {
        type: String,
        min: 3,
        max: 1000,
        autoValue: function () {
            if (Meteor.isServer) {
                if (this.isInsert && this.isSet) { //noinspection JSUnresolvedFunction
                    return sanitizeHtml(this.value, {
                        allowedTags: ['a', 'span', 'br', 'p', 'ol', 'li', 'table', 'tbody', 'tr', 'td', 'img'],
                        allowedAttributes: {
                            '*': ['href', 'align', 'alt', 'center', 'style', 'class', 'src']
                        }
                    });
                }
                if (this.isUpdate) {
                    if (((new Date()).getTime() - articlesExtension.findOne(this.docId).createdAt) > 600 * 1000) {
                        this.unset();
                    }
                }
            }
            else {
                return this.value;
            }
        },
        autoform: {
            afFieldInput: {
                type: 'summernote',
                class: 'editor', // optional
                settings: {
                    //for other options : summernote.org
                    lang: 'ar-AR', height: 200,
                    toolbar: [
                        ['style', ['style', 'bold', 'italic', 'underline', 'clear']],
                        ['fontsize', ['fontsize']],
                        ['para', ['ul', 'ol', 'paragraph']],
                        ['insert', ['picture', 'link', 'table', 'hr']],
                        ['misc', ['undo', 'redo', 'fullscreen', 'help']]
                    ],
                    onImageUpload: function (files) {
                        var fsFile = new FS.File(files[0]);
                        fsFile.owner = this.userId;
                        Images.insert(fsFile, function (err, fileObj) {
                            // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
                            if (err) {
                            }
                            else {
                                Tracker.autorun(function (computation) {
                                    var file = Images.findOne(fileObj._id);
                                    if (file.url()) {
                                        $('.editor').summernote('insertImage', file.url());
                                        $('img').addClass('img-responsive');
                                        return;
                                        // Thumbnail is available. Do something.
                                        //noinspection UnreachableCodeJS
                                        computation.stop();
                                    }
                                });
                            }
                        })
                    }
                    ,
                    onMediaDelete: function ($target) {
                        var url = $target[0].src;
                        var id = url.substring((url.lastIndexOf("/") + 1));
                        Images.remove({_id: id});
                        $target.remove();
                    }
                }
            }
        }
    },
    createdAt: {
        type: Date,
        autoform: {omit: true},
        autoValue: function () {
            if (this.isInsert) {
                return new Date();
            }
            if (this.isUpdate) {
                this.unset();
            }
        }
    }
})
articlesExtension.attachSchema(extensionSchema);
//Articles.helpers({
//    commentsCounter: function () {
//        return Comments.find({articleId: this._id}).count();
//    }
//});
articlesExtension.allow({
    update: function (userId, doc) {
        var article = Articles.findOne(doc.articleId);
        if (article.user == userId) {
            if (allowedUpdateTime(doc.createdAt))
                return true
        }
        return false;
    }
});