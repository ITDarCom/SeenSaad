Articles = new Mongo.Collection("articles");
Articles.allow({
    insert: function () {
        return true;
    },
    remove: function () {
        return true;
    },
    update: function (userId, doc) {
        return (doc.user == userId)
    }
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
        autoValue: function () {
            return 0;
        }
    },
    readingPermissions: {
        type: String,
        label: "المشاهدة",
        optional: true,
        autoform: {
            type: "select",
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
        custom: function () {
            if (this.field("readingPermissions").value == '1' && !this.isSet && (!this.operator || (this.value === null || this.value === ""))) {
                //  return "required";
            }
        },
        autoform: {
            type: "select2",
            afFieldInput: {
                multiple: true
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
    comments: {
        type: Array,
        optional: true
    }, 'comments.$': {
        type: Object
    },
    'comments.$.commentText': {
        type: String,
        label: "أضف تعليقاً",
        autoform: {
            afFieldInput: {
                type: "textarea"
            }
        }
    },
    user: {
        type: String,
        autoValue: function () {
            return Meteor.userId();
        }
    },
    createdAt: {
        type: Date,
        autoValue: function () {
            if (this.isInsert)
                return new Date();
            if (this.isUpdate)
                this.unset;
        }
    }
}))
/*
 Meteor.methods({
 'insertArticle': function(title, body, user){
 Articles.insert({
 title: title,
 body: body,
 user: user,
 createdAt: new Date()
 });
 }
 });
 */

//Articles.insert({ title: "Hello world!", body: "This is a text body..", user: "khalid", createdAt: new Date() });
