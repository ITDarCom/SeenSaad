Template.articles.helpers({
    articles: function () {
        return Articles.find({}, {sort: {createdAt: -1}});
    },
    isOwner: function () {
        return (Meteor.userId() == this.user)
    }
});

Template.articles.events({
    'click .remove': function () {
        var id = this._id;

        bootbox.confirm({
            size: 'small',
            buttons: {
                cancel: {
                    label: "إلغاء",
                    className: "btn-default",
                },
                confirm: {
                    label: "موافق",
                    className: "btn-danger",
                    callback: function () {
                        return true;
                    }
                }
            },
            message: "هل تريد حذف المقال فعلاً",
            callback: function (result) {
                if (result) {
                    Meteor.call("removeArticle", id)
                    $('#notify').html('<div class="alert alert-success"><a class="close" data-dismiss="alert">×</a><span>' + "تم حذف المقال بنجاح" + '</span></div>')
                    $('#notify').show()
                }
                else return
            }

        })
    },
    'click .favorite': function () {
        if (Meteor.userId())
            Meteor.call('favoriteIt', this._id)
    }
});

