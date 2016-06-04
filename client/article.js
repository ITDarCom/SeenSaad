/**
 * Created by omar on 9/19/15.
 */

//var isSubmitting = new ReactiveVar(false);

AutoForm.hooks({
    addCommentForm: {

        onSubmit: function (insertDoc, updateDoc, currentDoc) {
            this.event.preventDefault();
            alert();
            this.done();
            // else {
            //    this.done(new Error("Submission failed"));
            //}
            return false;
        },

        endSubmit: function() {
            var isDirty = false
            if (!this.validationContext.isValid()){ 
                isDirty = true                 
            }
            Session.set('formIsDirty', isDirty)
        },        

    }

})

Template.article.helpers({
    isSubmitting: function () {
        //return isSubmitting.get()
    },
    bodyText: function () {
        if (this.body.indexOf("<div") != -1) {
            return this.body.slice(0, this.body.indexOf('<div'));
        }
        else {
            return this.body;
        }
    },
    thisArticle: function () { //get the user object to display it on the template
        return Articles.findOne(Router.current().params.id);
        // used to get the article from db to display it
    },
    canEdit: function () {
        return ((new Date()).getTime() - this.createdAt.getTime()) < (3600 * 1000);
    },
    allowContributing: function () {  // check if the user is authenticated to commenting
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

    },
    allowReading: function () {
        //this refer to this article that is displayed
        //noinspection JSUnresolvedVariable
        if (this.readingPermissions == '0' || this.contributingPermissions == '0' || this.user == Meteor.userId()) {
            // 0 value mean the article is public contribution or reading
            return true;
        }
        else {
            if (Meteor.userId()) {
                //noinspection JSUnresolvedVariable
                if ((this.readingIds != null) && (!_.isEmpty(_.where(this.readingIds, Meteor.userId())))) {
                    return true
                }// underscore lib
                //noinspection JSUnresolvedVariable
                if (this.contributingIds != null) { //noinspection JSUnresolvedVariable
                    if (!_.isEmpty(_.where(this.contributingIds, Meteor.userId())))
                        return true
                }
            }// underscorejs lib
            else return false; // false mean not permitted
        }
    },
    seenChange: function () {
        Tracker.nonreactive(function () {
            Meteor.call('seenChange', Router.current().params.id)
        })
    },
    commentCounter: function () {
        return Comments.find({articleId: this._id}).count();
    }
});
Template.article.events({
    'click #editButton': function () {
        Router.go('edit', {id: Router.current().params.id})
    }
    //  "submit #addCommentForm": function (event) {
    //      event.preventDefault();
    //          var comment= {commentText:$('.commentTextarea').val(),articleId:Router.current().params.id};
    //      commentsSchema.clean(comment);
    //if(!commentsSchema.validate(comment)){
    //    Meteor.call('addComment',comment,function(){
    //        console.log('added');
    //    })
    //}
    //
    //  }
    ,
    'click .remove': function () {
        var id = this._id;
        if (confirm(arabicMessages.confirmDelete)) {
            {
                Meteor.call('removeArticle', id, function (err) {
                    $('.alert').remove();
                    Session.set('alert', 'deleteSuccessfully');
                    Router.go('mine');
                });
            }
        }
    },
    'click .favorite': function () {
        if (Meteor.userId())
            Meteor.call('favoriteIt', this._id);
        else
            Router.go('signIn');
    },
    'change #addCommentForm': function () {
        Session.set('formIsDirty', true)
    }
});
Template.comments.helpers({
    comments: function () {
        return Comments.find({articleId: this.data},{sort: {createdAt: 1}})
    },
    articleOwner: function () {
        return (Meteor.userId() && Template.parentData(2).user == Meteor.userId())
    },
    canEdit: function () {
        if (Meteor.userId() && this.commenter == Meteor.userId()) {
            return (new Date().getTime() - this.createdAt.getTime() < 600 * 1000)
        }
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
                    "<button class='btn btn-xs btn-success'><i class='fa fa-check okUpdate '></i></button></div>");
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
});
Template.additions.helpers({
    additions: function (id) {
        var article = Articles.findOne(id);
        var additions = Addition.getAdditions(article.body);
        var data = [];
        if (additions) {
            additions.forEach(function (s, index) {
                var createdAt = new Date(Addition.date(s));
                var text = Addition.getText(s);
                if (index == additions.length - 1 && Router.current().route.getName() == 'edit') {
                    if (allowedUpdateTime(Addition.date(s), true)) { // to prevent show the last addition in edit page
                        return;
                    }
                    else {
                        data.push({
                            createdAt: createdAt,
                            text: text,
                            id: index
                        })
                    }
                }
                else {
                    data.push({
                        createdAt: createdAt,
                        text: text,
                        id: index
                    })
                }
            });
            return data;
        }
    },
    owner: function () {
        if (Template.parentData(2)) {
            return (Template.parentData(2).user === Meteor.userId());
        }
    }
});

Template.additions.events({
    'mouseenter .well': function (event) {
        $(event.target).find('.removeAddition').show()
    },
    'mouseleave .well': function (event) {
        $(event.target).find('.removeAddition').hide()
    },
    'click .removeAddition': function (event) {
        if (Template.parentData(1).user === Meteor.userId())
            if (confirm(arabicMessages.additionDeleteConfirm)) {
                Meteor.call("removeAddition", Template.parentData(1)._id, this.id, function (err, result) {
                    if (!err) {
                        Session.set('alert', 'deleteSuccessfully')
                    }
                })
            }

    }

});

Template.additions.onRendered(function () {
    $('.removeAddition').hide();
});
