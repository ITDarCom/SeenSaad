Template.articles.helpers({
    articles: function () {
        return Articles.find({}, {sort: {createdAt: -1}});
    }
});

Template.articles.events({
    'click .remove': function (event) {
        var id = this._id;
        target = $($(event.target).parent()).parent()[0]
        var $warning = $('<div class="deleteWarning alert alert-warning"> <p>هل أنت متأكد؟</p><button  type="button" class="confirmDelete btn btn-danger">نـعم</button> <button  type="button" class="btn btn-default">إلغاء</button> </div>').hide()
        if (!$('.deleteWarning').length) {
            $(target).append($warning)
            $warning.show('slideDown')
            $(event.target).css("color", "red")
        }
        //bootbox.confirm({
        //    size: 'small',
        //    buttons: {
        //        cancel: {
        //            label: "إلغاء",
        //            className: "btn-default",
        //        },
        //        confirm: {
        //            label: "موافق",
        //            className: "btn-danger",
        //            callback: function () {
        //                return true;
        //            }
        //        }
        //    },
        //    message: "هل تريد حذف المقال فعلاً",
        //    callback: function (result) {
        //        if (result) {
        //            Meteor.call("removeArticle", id)
        //            $('#notify').html('<div class="alert alert-success"><a class="close" data-dismiss="alert">×</a><span>' + "تم حذف المقال بنجاح" + '</span></div>')
        //            $('#notify').show()
        //            setTimeout(function () {
        //                $('#notify').hide()
        //            }, 1500)
        //        }
        //        else return
        //    }
        //
        //})
    },
    'click .favorite': function () {
        if (Meteor.userId())
            Meteor.call('favoriteIt', this._id)
    },
    'click .edit': function () {
        Router.go('edit', {id: this._id})
    },
    'click .confirmDelete': function () {
        var id = this._id;
        Meteor.call("removeArticle", id)
        $('#notify').html('<div class="alert alert-success"><a class="close" data-dismiss="alert">×</a><span>' + "تم حذف المقال بنجاح" + '</span></div>')
        $('#notify').show()
        setTimeout(function () {
            $('#notify').hide()
        }, 1500)

    },
    'click': function (event) {
        if (!($(event.target).hasClass("remove")) && !($(event.target).hasClass("deleteWarning")))
            $('.deleteWarning').hide('fold', function () {
                $('.deleteWarning').remove();
                $('.remove').css("color", "darkslategray")
            })
    }
});

