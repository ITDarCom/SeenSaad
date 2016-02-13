/**
 * Created by omar on 21/11/15.
 */
Meteor.methods({
    isAdmin: function () {
        if (this.userId) {
            if (_.contains(Admins, Meteor.users.findOne(this.userId).username))
                return true;
        }
        else
            throw new Meteor.Error(403, 'you are not an admin!')
    },
    impersonate: function (userId) {
        check(userId, String);
        if (!_.contains(Admins, Meteor.users.findOne(this.userId).username))
            throw new Meteor.Error(403, 'Permission denied');
        if (!Meteor.users.findOne(userId))
            throw new Meteor.Error(404, 'User not found');

        this.setUserId(userId);
    },
    deleteUser: function (userId) {
        check(userId, String);
        if (_.contains(Admins, Meteor.users.findOne(this.userId).username))
            if (Meteor.users.findOne(userId)) {
                Articles.remove({user: userId});
                Stream.remove({userId: userId});
                Comments.remove({commenter: userId})
                Meteor.users.remove({_id: userId});


            }
    }
});
Admins = ['SeenSaad'];

Meteor.users.allow({
    remove: function (userId) {
        return (_.contains(Admins, Meteor.users.findOne(this.userId).username))
    }
});
registerHelpers = {
    isAdmin: function () {
        if (this.userId) {
            return (_.contains(Admins, Meteor.users.findOne(Meteor.userId()).username));
        }
    }
}

Meteor.startup(function () {
    Articles.find().forEach(function (a) {
        if (!a.generalDate) {
            a.generalDate = a.createdAt;
            Articles.update({_id: a._id}, {$set: a})
        }
    })
});
