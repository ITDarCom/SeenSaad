/**
 * Created by omar on 10/4/15.
 */
Messages = new Meteor.Collection('messages');
Messages.attachSchema(new SimpleSchema({
    from: {
        type: String,
        autoValue: function () {
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
            firstOption: false,
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
        autoform: {
            afFieldInput: {
                type: "textarea",
                rows: 5
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
    seen: {
        type: Boolean,
        defaultValue: false,
        autoform: {omit: true}
    }
}));
Messages.allow({
    insert: function () {
        return Meteor.userId();
    },
    update: function () {
        return Meteor.userId();
    },
    remove: function (userId, doc) {
        return (doc.to == userId || doc.from == userId )
    }
});

