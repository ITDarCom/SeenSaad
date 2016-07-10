/**
 * Created by omar on 6/30/16.
 */

Template.comments.helpers({
    comments: function () {
        return Comments.find({articleId: Template.instance().articleId}, {
            sort: {createdAt: 1},
            limit: 5,
            skip: Template.instance().state.get('skip')
        })
    },
    articleOwner: function () {
        return (Meteor.userId() && Template.parentData(1).user == Meteor.userId() && Meteor.userId() && this.commenter == Meteor.userId() && !Template.parentData(1).deleted)
    },
    canEdit: function () {

        if (Meteor.userId() && this.commenter == Meteor.userId() && !Template.parentData(1).deleted) {
            return (new Date().getTime() - this.createdAt.getTime() < 600 * 1000)
        }
    },    allowContributing: function () {  // check if the user is authenticated to commenting
        //this refer to this article that is displayed
        if (Meteor.userId() && !this.deleted) {
            //noinspection JSUnresolvedVariable
            if (this.contributingPermissions == '0' || this.user == Meteor.userId()) { // 0 value mean the
                // article is public contribution
                return true
            }
            else {
                //noinspection JSUnresolvedVariable
                if (this.contributingIds != null) //  maybe user doesn't enter any user name for contribution
                { //noinspection JSUnresolvedVariable
                    return (!_.isEmpty(_.where(this.contributingIds, Meteor.userId())));
                } //indexOf return -1
                // if element is not existed
            }
        }
        else return false;
        //is the current article is have the permissions for current user to contribute? ...
        // 1- check id public contribution 2- check if this user is the owner of this article 3- check if this userId is
        // existed in contributing array of ids for this article

    }
});

Template.comments.events({
    'click .removeComment': function () {
        if (confirm(arabicMessages.commentDeleteConfirm)) {
            Meteor.call('deleteComment', this._id, function (err, result) {
                if (err) {
                    alert(arabicMessages.deleteTryAgain)
                }
            })
        }
    },
    'click .updateComment': function (event) {
        var commentBody = $(event.currentTarget).parents('.panel-body').find('.commentText').attr('contentEditable', true).focus().parent();
        if (commentBody.find('.okUpdate,NoCancel').length == 0) {
            commentBody
                .append("<div class='updateButtonsPanel pull-left'><button class='btn btn-xs btn-danger NoCancel '><i class='fa fa-times'></i></button>" +
                    "<button class='btn btn-xs btn-success okUpdate '><i class='fa fa-check  '></i></button></div>");
        }
    },
    'click .okUpdate': function (event) {
        var textDiv = $(event.target).parents('.panel-body').find('.commentText');
        var text = textDiv.text().trim();
        if (text.length < 3) {
            alert(arabicMessages.commentMinString);
        }
        else {
            Meteor.call('updateComment', this._id, text, function (err, result) {
                if (!err) {
                    alert(arabicMessages.commentEditedSuccessfully)
                }
                else {

                }
                textDiv.attr('contentEditable', false).parent().find('.updateButtonsPanel').remove();
            });
        }
    },
    'click .NoCancel': function (event) {
        $(event.target).parents('.panel-body').find('.commentText')
            .attr('contentEditable', false).parent().find('.updateButtonsPanel').remove();
    },
    'click .previousBtn': function (event) {
        debugger;
        var skip = Template.instance().state.get('skip') || 0;
        Template.instance().state.set('skip', skip >= 5 ? skip - 5 : 0);
    },
    'click .nextBtn': function (event) {
        debugger;
        var skip = Template.instance().state.get('skip') || 0;
        Template.instance().state.set('skip', skip < Template.instance().data.commentsCounter ? skip + 5 : Template.instance().data.commentsCounter-5);
    }
});
var commentsSubscribtion = new SubsManager();
Template.comments.onCreated(function () {


    var instance = this;
    instance.articleId = Router.current().params.id;
    instance.state = new ReactiveDict();
    instance.state.set('limit', 5);
    instance.state.set('skip', 0);


    instance.autorun(function () {        var limit = instance.state.get('limit') || 5;
        var skip = instance.state.get('skip') || 0;
        commentsSubscribtion.subscribe("comments", Router.current().params.id, skip, limit);
    });
})
