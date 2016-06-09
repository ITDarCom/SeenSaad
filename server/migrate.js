/**
 * Created by omar on 6/9/16.
 */
Meteor.startup(function () {
    Articles.find({}).forEach(function (elem,val,test) {
        elem.username = Meteor.users.findOne(elem.user).username;
        Articles.update(elem._id,{$set:elem}, {getAutoValues: false});
    });
Messages.find({}).forEach(function (elem,val,test) {
        elem.fromUsername = Meteor.users.findOne(elem.from).username;
    Messages.update(elem._id,{$set:elem}, {getAutoValues: false});
    });

    tempCommentsSchema = new SimpleSchema({
        articleId: {
            type: String,

        },
        createdAt: {
            type: Date,
            autoform: {omit: true},
        },
        commenter: {
            type: String,
            autoform: {omit: true},
        },
        commenterUsername: {
            type: String,
            autoform: {omit: true},
        }
        ,
        commentText: {
            type: String,
            label: 'التعليق',
            min: 1,
            max: 300,

            autoform: {
                afFieldInput: {
                    type: 'textarea',
                    class: 'commentTextarea form-control'
                }
            }
        }

    });
Comments.attachSchema(tempCommentsSchema,{replace:true})
        Comments.find({}).forEach(function (elem,val,test) {

            elem.commenterUsername = Meteor.users.findOne(elem.commenter).username;
            Comments.update({_id:elem._id},{$set:elem}, {getAutoValues: false});
        })
Comments.attachSchema(commentsSchema,{replace:true  })

})