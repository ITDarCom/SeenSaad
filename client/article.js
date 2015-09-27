/**
 * Created by omar on 9/19/15.
 */


Template.article.helpers({
    thisArticle: function () {
        return Articles.findOne(Router.current().params.id);
    },
    allowContributing: function () {
        if (Meteor.userId()) {
            if (this.contributingPermissions == "0" || this.user == Meteor.userId()) {
                return true
            }
            else {
                return (this.contributingIds.indexOf(Meteor.userId()) != -1 )
            }
        }
        else return false;
    },
    allowReading: function () {
        if (this.readingPermissions == "0" || this.contributingPermissions == "0" || this.user == Meteor.userId()) {
            return true
        }
        else {
            if (Meteor.userId()) {
                if (this.readingIds != null)
                    return (this.readingIds.indexOf(Meteor.userId()) != -1)
                if (this.contributingIds != null)
                    return (this.contributingIds.indexOf(Meteor.userId()) != -1)
            }
            else return false;
        }
    },
    comments: function () {
        var article = Articles.findOne({_id: this._id});
        return article.comments;
    }
});
Template.article.events({
    'click #editButton': function () {
        Router.go('edit', {id: this._id})
        //$('.titleLabel').addClass("editable").attr("contentEditable", "true")
        //$('.textEditor').addClass("editable").attr("contentEditable", "true")
        //if (!$('.editButtons').length) {
        //    $('.panel-footer').append($('<div class="editButtons pull-left" > <a href="#" id="applyUpdate" class="btn btn-success btn-sm"> حفظ </a> <a href="#" id="cancelUpdate" class="btn btn-default btn-sm">إلغاء</a> </div>'))
        //    ;
        //}
    },
    'click .editButtons': function () {
        $('.editButtons').remove();
        $('.articleButtons').show();
        $('.titleLabel').removeClass("editable").removeAttr("contentEditable")
        $('.textEditor').removeClass("editable").removeAttr("contentEditable")
    },
    'click #applyUpdate': function () {
        if ($('.textEditor').text() != this.body && $('.titleLabel').text() != this.title)
            Meteor.call("articleUpdate", $('.textEditor').html(), $('.titleLabel').text(), this._id)
        else if ($('.textEditor').text() != this.body)
            Meteor.call("articleUpdate", $('.textEditor').text(), null, this._id)
        else if ($('.titleLabel').text() != this.title)
            Meteor.call("articleUpdate", null, $('.titleLabel').text(), this._id)
        alert(this.body)
    }
})
