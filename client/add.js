AutoForm.hooks(
    {
        addUpdateArticles: {
            onSuccess: function (insert, result) {
                if (result == 1) {
                    $('.bodyContainer').prepend('<div class="alert alert-success"><a class="close" data-dismiss="alert">×</a><span>' + "تم تعديل الموضوع بنجـاح " + '</span></div>')
                    Router.go("article", {id: this.docId});
                }
                else {
                    Meteor.call("permissionDeploy", result)
                    Router.go("article", {id: result});
                    $('.bodyContainer').prepend('<div class="alert alert-success"><a class="close" data-dismiss="alert">×</a><span>' + "تم إضافة الموضوع بنجـاح " + '</span></div>')
                }
                setTimeout(function () {
                    $('.alert-success').remove()
                }, 1500)
            }
        }
    })
Template.add.helpers(
    {
        formType: function () {
            if (Router.current().route.getName() == "edit")
                return "update"
            if (Router.current().route.getName() == "add")
                return "insert"
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
        }
    }
)
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
})
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
})
