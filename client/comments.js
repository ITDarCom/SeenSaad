/**
 * Created by omar on 6/30/16.
 */

Template.comments.helpers({
    comments: function () {
        return Comments.find({articleId: Template.instance().articleId}, {
            limit: Template.instance().state.get('limit'),
            skip: Template.instance().state.get('skip'),
            sort: {createdAt: 1}
        })
    },
    articleOwner: function () {
        return (Meteor.userId() && Template.parentData(1).user == Meteor.userId() && Meteor.userId() && this.commenter == Meteor.userId() && !Template.parentData(1).deleted)
    },
    hasMore: function () {
        var limit = Template.instance().state.get('limit');
        var commentsCounter = Template.instance().data.commentsCounter
        return limit <= commentsCounter;
    },
    canEdit: function () {

        if (Meteor.userId() && this.commenter == Meteor.userId() && !Template.parentData(1).deleted) {
            return (new Date().getTime() - this.createdAt.getTime() < 600 * 1000)
        }
    }, allowContributing: function () {  // check if the user is authenticated to commenting
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
    'click .pagerControl': function (event, template) {
        var type = $(event.target).attr("type") ? $(event.target).attr("type") : $(event.target).parent().attr("type");
        var skip = template.state.get("skip");
        switch (type) {
            case "next":
                template.state.set('skip', skip > 5 ? skip - 5 : 0);
                break;
            case "previous":
                var newSkip = skip + 5;
                if (newSkip < this.commentsCounter) {
                    template.state.set('skip', newSkip);
                }
                break;
            case "last":
                template.state.set("skip", 0);
                break;
            case "first":
                template.state.set("skip", this.commentsCounter > 5 ? this.commentsCounter - 5 : 0);
                break;
        }
        $('html, body').animate({
            scrollTop: $(".panel-info").offset().top
        }, 500);
    },
    'click .previousBtn': function (event, template) {
        console.log(template.state.get('skip'));
        var skip = template.state.get('skip') || 0;
        template.state.set('skip', skip >= 5 ? skip - 5 : 0);
    },
    'click .nextBtn': function (event, template) {
        var skip = template.state.get('skip') || 0;
        template.state.set('skip', skip < template.data.commentsCounter ? skip + 5 : template.data.commentsCounter - 5);
    },
});
var commentsSubscribtion = new SubsManager();
Template.comments.onCreated(function () {
    var instance = this;
    instance.articleId = Router.current().params.id;
    instance.state = new ReactiveDict();
    var limit = 5;
    debugger;
    //if (instance.data.commentsCounter % 5 != 0) {
    //    limit = instance.data.commentsCounter % 5;
    //}
    instance.state.set('limit', limit);
    instance.state.set('skip', 0);


    instance.autorun(function () {
        commentsSubscribtion.subscribe("comments", instance.articleId);
    });


});

AutoForm.hooks({
    addCommentForm: {
        beginSubmit: function () {
            $('#addCommentForm > :submit').prop("disabled", true);

        },
        endSubmit: function () {
            $('#addCommentForm > :submit').prop("disabled", false);
            this.template.parent().state.set('skip',this.template.parent().data.commentsCounter - 5 )
        }
    }

});
