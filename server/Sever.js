/**
 * Created by omar on 21/11/15.
 */
Meteor.methods({
    isAdmin: function () {
        if (this.userId) {
            if (_.contains(Admins, Meteor.users.findOne(this.userId).username)) {
                return true;
            }
        }
        else {
            throw new Meteor.Error(403, 'you are not an admin!')
        }
    },
    impersonate: function (userId) {
        check(userId, String);
        if (!_.contains(Admins, Meteor.users.findOne(this.userId).username)) {
            throw new Meteor.Error(403, 'Permission denied');
        }
        if (!Meteor.users.findOne(userId)) {
            throw new Meteor.Error(404, 'User not found');
        }

        this.setUserId(userId);
    },
    setUserBlocked: function (userId, blocked) {
        check(userId, String);
        check(blocked, Boolean);

        if (_.contains(Admins, Meteor.users.findOne(this.userId).username)) {
            if (Meteor.users.findOne(userId)) {
                Meteor.users.update({_id: userId}, {$set: {blocked: blocked}})
            }
        }
    },
    deleteUser: function (userId) {

        check(userId, String);
        if (_.contains(Admins, Meteor.user().username)) {
            if (Meteor.users.findOne(userId)) {

                Articles.find({user: userId}).forEach(function (elem) {
                    if (elem.readingIds && elem.readingIds.length > 0) {
                        _.each(elem.readingIds, function (value) {
                            Stream.update({userId: value}, {$pull: {readingArticles: {id: elem._id}}});
                        })
                        _.each(elem.contributingIds, function (value) {
                            Stream.update({userId: value}, {$pull: {contributingArticles: {id: elem._id}}});
                        })
                    }

                })

                Stream.remove({userId: userId}, function () {
                    Comments.remove({commenter: userId}, function () {
                        Messages.remove({$or: [{to: userId}, {from: userId}]}, function () {
                            Meteor.users.remove({_id: userId});
                        });
                    });
                });

            }
        }
    }

});

Admins = ['SeenSaad'];

Meteor.users.allow({
    remove: function () {
        return (_.contains(Admins, Meteor.users.findOne(this.userId).username))
    }
});
registerHelpers = {
    isAdmin: function () {
        if (this.userId) {
            return (_.contains(Admins, Meteor.users.findOne(Meteor.userId()).username));
        }
    }
};

Meteor.startup(function () {

})
