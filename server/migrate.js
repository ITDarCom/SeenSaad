///**
// * Created by omar on 6/9/16.
// */

//migration to add general date toa the articles
//Meteor.startup(function () {
//    Articles.find().forEach(function (a) {
//        if (!a.generalDate) {
//            a.generalDate = a.createdAt;
//            Articles.update({_id: a._id}, {$set: a})
//        }
//    })
//});

//====================================


////this migration for adding username name to old article & comments and messages documents
//

//Meteor.startup(function () {
//    Articles.find({}).forEach(function (elem) {
//        if (!elem.username) {
//            var user = Meteor.users.findOne(elem.user);
//            if (user) {
//                elem.username = user.username;
//            }
//            Articles.update(elem._id, {$set: elem}, {validate: false});
//        }
//    });
//    Messages.find({}).forEach(function (elem) {
//        var user = Meteor.users.findOne(elem.from)
//        if (!elem.fromUsername && user) {
//            elem.fromUsername = user.username;
//        }
//        user = Meteor.users.findOne(elem.to)
//        if (!elem.toUsername && user) {
//            elem.toUsername = Meteor.users.findOne(elem.to).username;
//        }
//        Messages.update(elem._id, {$set: elem}, {validate: false});
//    });
//    Comments.find({}).forEach(function (elem) {
//        var user = Meteor.users.findOne(elem.commenter);
//        if (user && !elem.commenterUsername) {
//            elem.commenterUsername = user.username;
//            Comments.update({_id: elem._id}, {$set: elem}, {validate: false});
//        }
//    })
//
//});


//==================================