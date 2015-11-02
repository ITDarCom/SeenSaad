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
        autoform: {omit: true},
    },
    to: {
        label: "إلى:",
        type: String,
        custom: function () {
            if (!Meteor.users.findOne(this.value))
                return "wrong user .. ";
        },
        autoform: {
            type: function () {
                return "select2"
            },
            options: function () {
                return Meteor.users.find({_id: {$not: Meteor.userId()}}).map(function (c) {
                    return {label: c.username, value: c._id};
                });
            }
        }
    },
    message: {
        type: String,
        label: "الرسالة",
        max: 2000,
        autoValue: function (value) {
            if (this.isInsert) {
                var regex = /(<([^>]+)>)/ig
                return value.message.replace(regex, "").trim()
            }
        },
        autoform: {
            afFieldInput: {
                type: 'textarea',
                class: 'msgTextarea',
                ph: 'نص الرسالة ...'
            }
        }
    },
    sendingAt: {
        type: Date,
        autoform: {omit: true,},
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
    insert: function () {
        return Meteor.userId();
    },
    update: function (userId, doc, fields) {
        if ((userId == doc.to || userId == doc.from ) && (!_.contains(fields, 'message') || !_.contains(fields, 'to') || !_.contains(fields, 'from')))
            return true;
    },
    remove: function () {
        return true
    }
});

if (Meteor.isServer) {
    Meteor.methods({
        removeMessage: function (msgId) {
            debugger
            check(msgId, String);
            msg = Messages.findOne(msgId);
            if (this.userId == msg.to) {
                Messages.update({_id: msgId}, {$set: {reciver: 2}})
            }
            if (this.userId == msg.from) {
                Messages.update({_id: msgId}, {$set: {sender: 1}})
            }
        }
    })

}