Template.articles.helpers({
    articles: function () {
        return Articles.find({}, {sort: {createdAt: -1}});
    },
    isOwner: function () {
        retur(Meteor.userId() == this._id)
    }
});

Template.articles.events({
    'click .remove': function () {
        var id = this._id;
        var isDeleted = false
        bootbox.confirm({
            size: 'small',
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

