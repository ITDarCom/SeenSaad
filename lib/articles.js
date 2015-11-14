Articles = new Mongo.Collection("articles");
Articles.allow({
    insert: function (userId) {
        return userId;
    },
    remove: function (userId, doc) {
        return (doc.user == userId)
    },
    update: function (userId, doc, fields, modifier) {
        if ((doc.user == userId))
            return true;
        if (_.contains(doc.contributingIds, userId) || doc.contributingPermissions == 0) {
            if ((modifier["$push"] && modifier["$push"].comments) || (modifier["$inc"] && modifier["$inc"].read) || (modifier["$addToSet"] && modifier["$addToSet"].readers))
                return true;

        }
    }
});
Articles.deny({
    update: function (userId, doc, fields) {

        if (doc.user != userId)
            _.each(fields, function (f) {
                if (_.contains(['title', 'body', 'contributingIds', 'contributingPermissions', 'readingIds', 'readingPermissions'], f))
                    return true;
            })

    }
})
Articles.attachSchema(new SimpleSchema({  // simpleSchema from package collection2 used to organize the operation of (insert-update) opretions in collections
    _id: {
        type: String, //TODO _id may duplicated
        autoValue: function () {
            if (this.isInsert && !this.isSet) {
                var d = new Date().getTime();
                var uuid = 'xxxxxx'.replace(/[xy]/g, function (c) {
                    var r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                });
                Meteor.call("checkId", uuid)
                return uuid;
            }
            else
                return this.value;
        },
        unique: true
    },
    title: {
        type: String,
        label: "العنوان",
        min: 3,
        max: 250
    },
    body: {
        type: String,
        label: "الموضوع",
        min: 3,
        max: 10000,
        autoValue: function () {
            if (Meteor.isServer) {
                if (this.isInsert && this.isSet)
                    return sanitizeHtml(this.value, {
                        allowedTags: ['a', 'span', 'br', 'p', 'ol', 'li', 'table', 'tbody', 'tr', 'td', 'img'],
                        allowedAttributes: {
                            '*': ['href', 'align', 'alt', 'center', 'style', 'class', 'src']
                        }
                    });
            } else {
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
                        fsFile = new FS.File(files[0]);
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
                                        return
                                        // Thumbnail is available. Do something.
                                        computation.stop();
                                    }
                                });
                            }
                        })
                    }
                    ,
                    onMediaDelete: function ($target, editor, $editable) {
                        var url = $target[0].src
                        var id = url.substring((url.lastIndexOf("/") + 1));
                        Images.remove({_id: id})
                        $target.remove();
                    }
                }
            }
        }
    },
    read: {
        type: Number,
        autoform: {omit: true,},
        autoValue: function () {
            if (this.isInsert)
                return 0;
        }
    },
    readers: {
        type: [String],
        optional: true,
        autoform: {omit: true}
    },
    favorite: {
        type: [String],
        optional: true,
        autoform: {omit: true}

    },
    readingPermissions: {
        type: String,
        label: "المشاهدة",
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
        label: "المشاركة",
        autoform: {
            type: "select",
            firstOption: false,
            defaultValue: 0,
            options: function () {
                return [
                    {label: "عام", value: 0},
                    {label: "خاص", value: 1}
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
        },
    },
    user: {
        type: String,
        autoform: {omit: true,},
        autoValue: function () {
            if (this.isInsert)
                return this.userId;
            if (this.isUpdate)
                this.unset();
        }
    }, username: {
        type: String,
        autoform: {omit: true,},
        autoValue: function () {
            if (this.isInsert) {
                var user = Meteor.users.findOne(Meteor.users.findOne({_id: this.userId}))
                return user.username
            }
            if (this.isUpdate)
                this.unset();

        }
    },
    createdAt: {
        type: Date,
        autoform: {omit: true},
        autoValue: function () {
            if (this.isInsert)
                return new Date();
            if (this.isUpdate)
                this.unset();
        }
    },
    comments: {
        type: Array,
        optional: true
    }, 'comments.$': {
        type: Object
    },
    'comments.$.commentText': {
        type: String,
        label: "التعليق",
        min: 1,
        max: 300,
        autoValue: function (value) {
            var regex = /(<([^>]+)>)/ig
            return this.value.replace(regex, "").trim()
        },
        autoform: {
            afFieldInput: {
                type: 'textarea',
                class: 'commentTextarea form-control',
            }
        }
    },
    'comments.$.createdAt': {
        type: Date,
        autoform: {omit: true},
        autoValue: function () {
            return new Date();
        }
    }, 'comments.$.commenter': {
        type: String,
        autoform: {omit: true},
        autoValue: function () {
            return this.userId
        }
    }
}))
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
    SearchSource.defineSource('articles', function (searchText, options) {
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
            var custom = Stream.findOne({userId: this.userId})
            readingArticles = custom.readingArticles ? custom.readingArticles : []
            contributingArticles = custom.contributingArticles ? custom.contributingArticles : [];
            var selectorPermissions = {$or: [{readingPermissions: "0"}, {_id: {$in: readingArticles}}, {_id: {$in: contributingArticles}}, {contributingPermissions: "0"}, {user: this.userId}]}
            return Articles.find({$and: [selectorSearch, selectorPermissions]}, options).fetch();
        }
    });
    function buildRegExp(searchText) {
        // this is a dumb implementation
        var parts = searchText.trim().split(/[\-\:]+/);
        return new RegExp("(" + parts.join('|') + ")", "ig");
    }
}
if (Meteor.isServer) {
    Meteor.methods({
            checkId: function (id) {
                return Articles.findOne(id);
            }
        }
    )
}
