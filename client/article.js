/**
 * Created by omar on 9/19/15.
 */
Template.article.helpers({
    thisArticle: function () { //get the user object to display it on the template
        return Articles.findOne(Router.current().params.id);
        // used to get the article from db to display it
    },
    canEdit: function () {
        return ((new Date()).getTime() - this.createdAt.getTime()) < (3600 * 1000);
    },
    allowedTime: function () {
        var createdTime = articleTexts.findOne({articleId: this._id}, {sort: {createdAtText: -1}}).createdAtText.getTime();
        if ((new Date()).getTime() - createdTime < (3600 * 1000)) {
            var count = (3600 - parseInt(((new Date()).getTime() - createdTime)) / 1000);
            var counter = setInterval(timer, 1000); //1000 will  run it every 1 second
            function timer() {
                count = count - 1;
                if (count <= 0) {
                    clearInterval(counter);
                    $('#editCounter').text(0);
                    $('.edit').removeClass('btn-warning').addClass('btn-default');
                    return;
                }
                $('#editCounter').text(parseInt(count / 60) + ' د');
            }
        }
        else {
            clearInterval(counter);
            return false;
        }
    },
    allowContributing: function () {  // check if the user is authenticated to commenting
        //this refer to this article that is displayed
        if (Meteor.userId()) {
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
    },
    'click .remove': function () {
        var id = this._id;
        if (confirm(arabicMessages.confirmDelete)) {
            {
                Meteor.call('removeArticle', id, function (err) {
                    Session.set('alert', 'deleteSuccessfully')
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
});
Template.comments.helpers({
    comments: function () {
        return Comments.find({articleId: this.data})
    },
    owner: function () {
        return (Meteor.userId() && Template.parentData(2).user == Meteor.userId())
    }
});
Template.comments.events({
    'click .removeComment': function () {
        if (confirm(arabicMessages.commentDeleteConfirm)) {
            Meteor.call('deleteComment', this._id, function (err, result) {
                if (err) {
                    alert(arabicMessages.commentDeleteFailed)
                }
            })
        }
    }
})