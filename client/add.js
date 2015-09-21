AutoForm.hooks(
    {
        addUpdateArticles: {
            onSuccess: function (insert, result) {
                if (result == 1) {
                    $('.bodyContainer').prepend('<div class="alert alert-success"><a class="close" data-dismiss="alert">×</a><span>' + "تم تعديل الموضوع بنجـاح " + '</span></div>')
                    Router.go("article", {id: this.docId});
                }
                else {
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
            return Meteor.users.find({_id: Meteor.userId()}).map(function (c) {
                return {label: c.username, value: c._id};
            });
        },
        getreadingPermissions: function () {
            if (Router.current().route.getName() == "edit") {
                return ((Articles.findOne(Router.current().params.id)).readingPermissions)
            }
            if (Router.current().route.getName() == "add")
                return 0
        }
    }
)
Template.afSelect2.destroyed = function () {
    this.$('readingIds').select2('destroy');
};
Template.add.onRendered(function () {
    //if (Router.current().route.getName() == "edit")
    //$("#readingPermissions").prop('selectedIndex',(Articles.findOne(Router.current().params.id)).readingPermissions);

})
