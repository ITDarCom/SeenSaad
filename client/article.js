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
            if (this.contributingPermissions == "0" || this.user == Meteor.userId()) { // 0 value mean the article is public contribtion
                return true
            }
            else {
                if (this.contributingIds != null) //  maybe user doesn't enter any user name for contribution
                    return (!_.isEmpty(_.where(this.contributingIds, Meteor.userId()))) //indexOf return -1 if element is not existed
            }
        }
        else return false;
        //is the current article is have the permissions for current user to contribute? ...
        // 1- check id public contribution 2- check if this user is the owner of this article 3- check if this userId is existed in contributing array of ids for this article

    },
    allowReading: function () {
        //this refer to this article that is displayed
        if (this.readingPermissions == "0" || this.contributingPermissions == "0" || this.user == Meteor.userId()) {  // 0 value mean the articel is public contribtion or reading
            return true

        }
        else {
            if (Meteor.userId()) {
                if ((this.readingIds != null) && (!_.isEmpty(_.where(this.readingIds, Meteor.userId())))) {
                    return true
                }// underscorejs lib
                if (this.contributingIds != null)
                    if (!_.isEmpty(_.where(this.contributingIds, Meteor.userId())))
                        return true
            }// underscorejs lib
            else return false; // false mean not premitted
        }
    },
    comments: function () {
        var article = Articles.findOne({_id: this._id});
        return article.comments;
        //return comments for this article
    },
    isPrivate: function () {
        return this.contributingPermissions == 1;
    },
    commentCounter: function () {
        if (this.comments)
        return this.comments.length;
        else return 0
    },
    commenters: function () {
        var commentrs = []
        _.each(this.comments, function (c) {
            if (!_.contains(commentrs, c.commenter))
                commentrs.push(c.commenter)
        })
        return commentrs;
    },
    favoriteCounter: function () {
        if (this.favorite)
            return this.favorite.length
        else return 0
    }
});
Template.article.events({
    'click #editButton': function () {
        Router.go('edit', {id: Router.current().params.id})
    },
    'click .remove': function () {
        var id = this._id;
        if (confirm('هل أنت متأكد من حذف الموضوع؟ ')) {
            Meteor.call("removeArticle", id)
        }
        Router.go('articles')
    },
    'click .dateSwitch': function () {
        var target = $(event.target)
        var temp = target.html()
        target.html(target.attr('title'));
        target.attr('title', temp)
    },
    'click #showInfo': function () {
        $('#infoDiv').slideToggle();
    }
})

