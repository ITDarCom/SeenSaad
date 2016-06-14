/**
 * Created by omar on 1/24/16.
 */

Meteor.methods({

    'setNewPasswd': function (userId, pwd) {
        if (_.contains(Admins, Meteor.user().username)) {
            Accounts.setPassword(userId, pwd)
        }

    },
    'setNewUserName': function (newName) {
        if (newName == Meteor.user().username) {
            return;
        }
        var regex = new RegExp(["^", newName, "$"].join(""), "i");
        if (Meteor.users.findOne({$and: [{username: regex}, {id: {$ne: Meteor.userId()}}]})) {
            throw new Meteor.Error(500, 'There was an error processing your request');

        }
        if (newName.indexOf("--") != -1) {
            return false;
        }
        check(newName, String);
        if (!Meteor.users.findOne({username: newName})) {
            //noinspection JSUnresolvedFunction
            Accounts.setUsername(Meteor.userId(), newName);
            Meteor.users.update(Meteor.userId(),{$set:{lastUsernameChange:new Date()}},{validate:false,getAutoValues:false});
            this.unblock();
            Meteor.call('refreshUsernames');

        }
    },
    'refreshUsernames': function () {
        var i = 0;
        Articles.find({user: Meteor.userId()}).forEach(function (elem) {
            elem.username = Meteor.user().username;
            Articles.update(elem._id, {$set: elem});
        });

        Messages.find({from: Meteor.userId()}).forEach(function (elem) {
            elem.fromUsername = Meteor.user().username;
            elem.toUsername = Meteor.users.findOne(elem.to).username;
            Messages.update(elem._id, {$set: elem})
            console.log(i++)
        });
        Comments.find({commenter: Meteor.userId()}).forEach(function (elem) {
            elem.commenterUsername = Meteor.user().username;
            Comments.update(elem._id, {$set: elem});
            console.log(i++);
        })
    }


})
