Articles = new Mongo.Collection("articles");
Articles.allow({
    insert: function (userId) {
        return userId;
    },
    remove: function (userId, doc) {
        return (doc.user == userId)
    },
    update: function (userId, doc) {
        return (doc.user == userId)
    },
    fetch: ['user']
});
Articles.attachSchema(new SimpleSchema({
    title: {
        type: String,
        label: "العنوان",
        min: 3,
        max: 250
    },
    body: {
        type: String,
        label: "نص الموضوع",
        min: 3,
        max: 10000,
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
                        fsFile.owner = Meteor.userId();
                        Images.insert(fsFile, function (err, fileObj) {
                            // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
                            if (err) {
                            }
                            else {
                                Tracker.autorun(function (computation) {
                                    var file = Images.findOne(fileObj._id);
                                    if (file.isUploaded()) {
                                        $('#textEditor').summernote('insertImage', file.url());
                                        console.log("uploaded" + file.url())
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
                        console.log("after remove")
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
            return 0;
        }
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
        label: "صلاحيات مشاهدة الموضوع والمشاركة فيه"
    },
    user: {
        type: String,
        autoform: {omit: true,},
        autoValue: function () {
            return Meteor.userId();
        }
    },
    createdAt: {
        type: Date,
        autoform: {omit: true},
        autoValue: function () {
            if (this.isInsert)
                return new Date();
            if (this.isUpdate)
                this.unset;
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
        label: "أضف تعليقاً",
        min: 1,
        max: 100,
        autoform: {
            afFieldInput: {
                type: "textarea"

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
            return Meteor.userId()
        }
    }
}))
