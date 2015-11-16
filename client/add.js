AutoForm.hooks(
    {
        addUpdateArticles: {
            onSuccess: function (formType, result) {
                if (formType == 'insert') {
                    Meteor.call("permissionDeploy", result);
                    Router.go("article", {id: result});
                    $('.alert').hide();
                    $('.bodyContainer').prepend('<div class="alert alert-success"><a class="close" data-dismiss="alert">×</a><span>' + "تم إضافة الموضوع بنجـاح " + '</span></div>')
                }
                if (formType == "update") {
                    var oldReadingIds = this.currentDoc.readingIds ? this.currentDoc.readingIds : [];
                    var oldContributingIds = this.currentDoc.contributingIds ? this.currentDoc.contributingIds : [];
                    Meteor.call('permissionUpdate', this.docId, oldReadingIds, oldContributingIds);
                    $('.alert').hide();
                    $('.bodyContainer').prepend('<div class="alert alert-success"><a class="close" data-dismiss="alert">×</a><span>' + "تم تعديل الموضوع بنجـاح " + '</span></div>')
                }
                Router.go("article", {id: this.docId});

            },
            formToDoc: function (doc) {
                if (doc.contributingIds) {
                    intersection = _.intersection(doc.readingIds, doc.contributingIds);
                    _.each(intersection, function (u) {
                        doc.readingIds = _.without(doc.readingIds, u)
                    });
                }
                return doc;
            },
            before: {
                'update': function (doc) {
                    _.each(_.intersection(doc.$set.readingIds, doc.$set.contributingIds), function (u) {
                        doc.$set.readingIds = _.without(doc.$set.readingIds, u);
                    });
                    return doc;
                }
            }
        }
    });
Template.add.helpers(
    {
        canEdit: function () {

            if ((Router.current().params.id) && (Router.current().route.getName() == "edit"))
                return (Articles.findOne(Router.current().params.id).user == Meteor.userId());
            return (Router.current().route.getName() == "add")
        },
        formType: function () {
            if (Router.current().route.getName() == "edit")
                return "update";
            if (Router.current().route.getName() == "add")
                return "insert";
            //to choose form type (insert or update)
        },
        thisArticle: function () {
            if (Router.current().route.getName() == "edit")
                return Articles.findOne({_id: Router.current().params.id});
            // to get the article from collection to display it
        },
        insert: function () {
            return (Router.current().route.getName() == "add")
            // return true if we are in insert operation
        },
        saveButton: function () {
            if (Router.current().route.getName() == "edit")
                return "تحديث"
            if (Router.current().route.getName() == "add")
                return "إضافة"
            // return the correct title for button that used in the form
        },
        usersOptions: function () {
            return Meteor.users.find({_id: {$not: Meteor.userId()}}).map(function (c) {
                return {label: c.username, value: c._id};
                // return users name for select2 field
            });
        },
        s2Opts: function () {
            return {placeholder: ' المشاركة بالردود على الموضوع'};
        },

    }
);
Template.add.events({
    'change #contributingPermissions': function () {
        if ($('#contributingPermissions').val() == 0) {
            $('#readingDiv').hide()
        }
        else {
            $('#readingDiv').show()
        }
        // if contributing permissions is public then we hide the reading permission div
    }
});
Template.autoForm.onRendered(function () {
    if (this.data.id == "addUpdateArticles")
        if (this.data.type == "update") {
            if (Router.current().route.getName() == "edit")
                $('#contributingPermissions').val(this.data.doc.contributingPermissions)
            if (this.data.doc.contributingPermissions == 1) {
                $('#readingPermissions').val(this.data.doc.readingPermissions)
                $('#readingDiv').show()

            }
            else {
                $('#readingDiv').hide()
            }
        }
        else if (this.data.type == "insert") {
            $('#readingDiv').hide()


        }
    //after bug founded in autoform ... in readingPemissions field or contributingPermissions field we get wrong value from the doc (always return 0 value) ... so it's a renedering problem in autoform
    //  so in this function we feed the field with the original value from db and show and hide readingPermission div according to contributing fields
});
