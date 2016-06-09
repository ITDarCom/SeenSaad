this.Articles = new Mongo.Collection("articles");
ArticleSchema = new SimpleSchema({  // simpleSchema from package collection2 used to organize the operation of (insert-update)
// opretions in collections
    _id: {
        type: String,
        autoValue: function () {
            if (this.isInsert) {
                var id = Random.id(6);
                while (Articles.findOne(id)) {
                    id = Random.id(6);
                }
                return id;
            }
            else
                this.unset();
        }
    },
    title: {
        type: String,
        label: 'العنوان',
        min: 3,
        max: 250
    },
    body: {
        type: String,
        min: 6,
        custom: function () {
            var regex = /(<([^>]+)>)/ig; //TODO remove br and solve Edtior
            if (this.value.replace(regex, "").replace(/&nbsp;/g, '').length > 10000) {
                return 'maxText'
            }
        },
        label: 'الموضوع',
        autoValue: function () {
            if (Meteor.isServer) {
                if (this.isInsert && this.isSet) { //noinspection JSUnresolvedFunction
                    return sanitizeHtml(this.value, {
                        allowedTags: ['a', 'b', 'u', 'i', 'span', 'ol', 'br', 'p', 'li', 'table', 'tbody', 'tr', 'td', 'hr', 'img'],
                        allowedAttributes: {
                            '*': ['href', 'align', 'alt', 'center', 'target', 'style', 'class', 'src']
                        }
                    });
                }
                if (this.isUpdate && this.isSet) {
                    if (((new Date()).getTime() - Articles.findOne(this.docId).createdAt.getTime()) > 3600 * 1000) {
                        this.unset();
                    }
                    else {
                        return sanitizeHtml(this.value, {
                            allowedTags: ['a', 'b', 'u', 'i', 'span', 'ol', 'br', 'p', 'li', 'table', 'tbody', 'tr', 'td', 'hr', 'img'],
                            allowedAttributes: {
                                '*': ['href', 'align', 'alt', 'center', 'target', 'style', 'class', 'src']
                            }
                        });
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
                    height: 100,
                    //for other options : summernote.org
                    lang: 'ar-AR', height: 200,
                    toolbar: [
                        ['style', ['style', 'bold', 'italic', 'underline', 'clear']],
                        ['fontsize', ['fontsize']],
                        ['para', ['ul', 'ol', 'paragraph']],
                        ['insert', ['picture', 'link', 'table', 'hr']],
                        ['misc', ['undo', 'redo', 'fullscreen', 'help']]
                    ],
                    callbacks: {
                        onImageUpload: function (files) {

                            if (Meteor.isClient) {

                                $summernote = $('.editor');
                                $summernote.summernote("insertImage", "/spinner.gif");
                            }

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
                                            $('.note-editable').find('img[src="/spinner.gif"]').remove();
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
                        },
                        onMediaDelete: function ($target) {
                            var url = $target[0].src;
                            var id = url.substring((url.lastIndexOf("/") + 1));
                            Images.remove({_id: id});
                            $target.remove();
                        }
                    },
                }
            }
        }
    },
    generalDate: {
        type: Date,
        autoValue: function () {
            if (this.isInsert) {
                return new Date();
            }
            if (this.isUpdate) {
                if (!this.field('read').isSet)
                    return new Date()
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
            if (this.isSet && this.operator && this.operator === "$inc") {
                return this.value;
            }
            this.unset(); //if it's not an increase or insert operation we should prevent it
        }
    },
    commentsCounter: {
        type: Number,
        optional: true,
        autoValue: function () {
            return Comments.find({articleId: this.docId}).count();
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
    },
    readingIds: {
        type: [String],
        label: "صلاحيات المشاهدة فقط:",
        optional: true,
    },
    contributingPermissions: {
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
            afFieldInput: {
                type: "text"
            }
        }
    },
    user: {
        type: String,
        autoValue: function () {
            if (this.isInsert) {
                return Meteor.userId();
            }
            if (this.isUpdate) {
                this.unset(); // we should unset every change to this field
            }
        }
    },
    username: {
        type: String,
        autoValue: function () {
            if (this.isInsert) {
                return Meteor.user().username;
            }
        }

    },
    createdAt: {
        type: Date,
        autoValue: function () {
            if (this.isInsert) {
                return new Date();
            }
            if (this.isUpdate) {
                this.unset(); // we should unset every change to this field
            }
        }
    },
    deleted: {
        type: Boolean,
        optional: true,
        autoValue: function () {
            if (Meteor.isClient)
                this.unset();
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
commentsSchema = new SimpleSchema({
    articleId: {
        type: String,
        custom: function () {
            var article = Articles.findOne(this.value);
            if (!article || (article.contributingPermissions != 0 && !_.contains(article.contributingIds, Meteor.userId()) && article.user != Meteor.userId())) {
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
            if(Meteor.isClient) {
                return Meteor.userId();
            }

        }
    },
    commenterUsername: {
        type: String,
        autoform: {omit: true},
        autoValue: function () {
            if (this.isInsert) {
                return Meteor.users.findOne(Meteor.userId()).username;
            }
        }
    }
    ,
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

});
Comments.attachSchema(commentsSchema);
//noinspection JSUnresolvedFunctiona
Articles.initEasySearch(['body', 'title'], {
    'limit': 20,
    'use': 'mongo-db'
});
if (Meteor.isClient) {
    var options = {
        page: 10,
        keepHistory: 1000 * 60 * 5,
        localSearch: true,

    };
    var fields = ['title', 'body'];
    articlesSearch = new SearchSource('articles', fields, options);
}
if (Meteor.isServer) {
    SearchSource.defineSource('articles', function (searchText) {
        var options = {sort: {createdAt: -1}, limit: 20};
        if (searchText.length > 1) {
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
        else if (searchText.length === 0) {
            return []
        }
    });
    function buildRegExp(searchText) {
        // this is a dumb implementation
        var parts = searchText.trim().split(/[\-:]+/);
        return new RegExp("(" + parts.join('|') + ")", "ig");
    }
}
updateSchema = new SimpleSchema([ArticleSchema, {
    addition: {
        type: String,
        min: 3,
        custom: function () {
            if (this.value) {
                var regex = /(<([^>]+)>)/ig;
                if (this.value.replace(regex, "").replace(/&nbsp;/g, '').trim().length > 10000) {
                    return 'maxText'
                }
            }
        },
        optional: true,
        autoValue: function () {
            if (Meteor.isServer) {
                if (this.isInsert && this.isSet) {  // here we don't need to insert or update this field .. we just need it for using in autoform
                    this.unset()
                }
                if (this.isUpdate || this.isUpsert) {
                    this.unset();
                    //}
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
                    callbacks: {
                        onImageUpload: function (files) {
                            if (Meteor.isClient) {

                                $summernote = $('.editor');
                                $summernote.summernote("insertImage", "/spinner.gif");
                            }
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
                                            $('.note-editable').find('img[src="/spinner.gif"]').remove();
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
        }
    }
}]);




