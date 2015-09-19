/**
 * Created by omar on 9/19/15.
 */


Template.article.helpers({
    thisArticle: function () {
        return Articles.findOne(Router.current().params.id);
    }
});
Template.article.events({
    'click #editButton': function () {
        $('.titleLabel').addClass("editable").attr("contentEditable", "true")
        $('.textEditor').addClass("editable").attr("contentEditable", "true")
        if (!$('.editButtons').length) {
            $('.panel-footer').append($('<div class="editButtons pull-left" > <a href="#" id="applyUpdate" class="btn btn-success btn-sm"> حفظ </a> <a href="#" id="cancelUpdate" class="btn btn-default btn-sm">إلغاء</a> </div>'))
            ;
        }
    },
    'click .editButtons': function () {
        $('.editButtons').remove();
        $('.articleButtons').show();
        $('.titleLabel').removeClass("editable").removeAttr("contentEditable")
        $('.textEditor').removeClass("editable").removeAttr("contentEditable")
    },
    'click #applyUpdate': function () {
        if ($('.textEditor').text().replace('\n', '') != this.body && $('.titleLabel').text() != this.title)
            Meteor.call("articleUpdate", $('.textEditor').text().replace('\n', ''), $('.titleLabel').text(), this._id)
        else if ($('.textEditor').text() != this.body)
            Meteor.call("articleUpdate", $('.textEditor').text().replace('\n', ''), null, this._id)
        else if ($('.titleLabel').text() != this.title)
            Meteor.call("articleUpdate", null, $('.titleLabel').text(), this._id)
    }
})