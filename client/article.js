/**
 * Created by omar on 9/19/15.
 */
Template.article.helpers({
    thisArticle: function () {
        return Articles.findOne(Router.current().params.id);
        // used to get the article from db to display it
    },
    allowContributing: function () {
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
        if (this.readingPermissions == '0' || this.contributingPermissions == '0' || this.user == Meteor.userId()) {  // 0 value mean the article is public contribution or reading
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
    comments: function () {
        var article = Articles.findOne({_id: this._id});
        return article.comments;
        //return comments for this article
    },
    isPrivate: function () {
        //noinspection JSUnresolvedVariable
        return this.contributingPermissions == 1;
    },
    commentCounter: function () {
        if (this.comments)
        return this.comments.length;
        else return 0
    },
    commenters: function () {
        var commentrs = [];
        //noinspection JSUnusedAssignment,JSUnresolvedVariable
        _.each(this.comments, function (c) {
            //noinspection JSUnresolvedVariable
            if (!_.contains(commentrs, c.commenter)) {        //noinspection JSUnresolvedVariable
                commentrs.push(c.commenter);
            }
        });
        return commentrs;
    },
    favoriteCounter: function () {
        //noinspection JSUnresolvedVariable
        if (this.favorite) {//noinspection JSUnresolvedVariable
            return this.favorite.length;
        }
        else {
            return 0
        }
    },
    seenChange: function () {
        Tracker.nonreactive(function () {
            Meteor.call('seenChange', Router.current().params.id)
        })
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
                Meteor.call('removeArticle', id);
            }
        }
        Router.go('articles');
    }
});

