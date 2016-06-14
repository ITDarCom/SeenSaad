/**
 * Created by omar on 6/9/16.
 */
//this migration for adding username name to old article & comments and messages documents

Meteor.startup(function () {
    Articles.find({}).forEach(function (elem, val, test) {
        elem.username = Meteor.users.findOne(elem.user).username;
        Articles.update(elem._id, {$set: elem}, {validate: false});
    });
    Messages.find({}).forEach(function (elem, val, test) {
        elem.fromUsername = Meteor.users.findOne(elem.from).username;
        elem.toUsername = Meteor.users.findOne(elem.to).username;
        Messages.update(elem._id, {$set: elem}, {validate: false});
    });
    Comments.find({}).forEach(function (elem, val, test) {

        elem.commenterUsername = Meteor.users.findOne(elem.commenter).username;
        Comments.update({_id: elem._id}, {$set: elem}, {validate: false});
    })

})
