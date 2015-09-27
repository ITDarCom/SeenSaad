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
        },
        thisArticle: function () {
            if (Router.current().route.getName() == "edit")
                return Articles.findOne(Router.current().params.id);
        },
        insert: function () {
            return (Router.current().route.getName() == "add")
        },
        saveButton: function () {
            if (Router.current().route.getName() == "edit")
                return "تحديث"
            if (Router.current().route.getName() == "add")
                return "إضافة"
        },
        usersOptions: function () {
            return Meteor.users.find({_id: {$not: Meteor.userId()}}).map(function (c) {
                return {label: c.username, value: c._id};
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
    }
})
Template.autoForm.onRendered(function () {
    if ((this.data.id == "addUpdateArticles") && (this.data.type == "update")) {
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
})

