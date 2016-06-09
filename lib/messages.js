/**
 * Created by omar on 10/4/15.
 */
Messages = new Meteor.Collection('messages');
Messages.attachSchema(new SimpleSchema({
    from: {
        type: String,
        autoValue: function () {
            if (this.isInsert)
                return Meteor.userId();
        },
        autoform: {omit: true}
    },
    fromUsername:{
        type:String,
        autoValue: function () {
            if(this.isInsert){
                return Meteor.user().username;
            }

        }
    },

    to: {
        label: "إلى:",
        type: String,
    },
    toUsername:{
        type:String,
        autoValue: function () {
            if(this.isInsert){
                if(Meteor.isClient){
                    return $('.select2-chosen').text()
                }
                if(Meteor.isServer) {
                    return Meteor.users.findOne(this.field('to').value).username;
                }
            }

        }

    },
    message: {
        type: String,
        label: arabicMessages.messageLabel,
        min: 1,
        max: 2000,
        autoValue: function (value) {
            if (this.isInsert && this.isSet) {
                var regex = /(<([^>]+)>)/ig;
                return value.message.replace(regex, "").trim()
            }
        },
        autoform: {
            afFieldInput: {
                type: 'textarea',
                class: 'msgTextarea'
            }
        }
    },
    sendingAt: {
        type: Date,
        autoform: {omit: true},
        autoValue: function () {
            if (this.isInsert) {
                return new Date();
            }
        }
    },
    sender: {
        type: Number,
        defaultValue: 0,
        allowedValues: [0, 1]
    },
    reciver: {
        type: Number,
        defaultValue: 0,
        allowedValues: [0, 1, 2]

    }
}));
Messages.allow({
    insert: function (userId,doc) {
        if(!Meteor.users.findOne(doc.to) && !Meteor.users.findOne(doc.from)){
            throw new Meteor.Error(500, 'There was an error processing your request');
        }
        return Meteor.userId();
    },
    update: function (userId, doc, fields) {
        if ((userId == doc.to || userId == doc.from ) && (!_.contains(fields, 'message') && !_.contains(fields, 'to') && !_.contains(fields, 'from'))) {
            return true;
        }
    },
    remove: function () {
        return false;
    }
});

if (Meteor.isServer) {
    Meteor.methods({
        removeMessage: function (msgId) {
            check(msgId, String);
            var msg = Messages.findOne(msgId);
            if (this.userId == msg.to) {
                Messages.update({_id: msgId}, {$set: {reciver: 2}})
            }
            if (this.userId == msg.from) {
                Messages.update({_id: msgId}, {$set: {sender: 1}})
            }
        }
    })

}