/**
 * Created by omar on 10/4/15.
 */
Messages = new Meteor.Collection('messages');
messagesSchema = new SimpleSchema({
    from: {
        type: String,
        autoform: {omit: true},
        denyUpdate: true
    },
    fromUsername: {
        type: String
    },

    to: {
        label: "إلى:",
        type: String,
        denyUpdate: true
    },
    toUsername: {
        type: String,
    },
    message: {
        type: String,
        trim:true,
        label: arabicMessages.messageLabel,
        min: 1,
        max: 2000,
        autoValue: function (value) {
            if (this.isInsert && this.isSet) {

                var regex = /(<([^>]+)>)/ig;
                return value.message.replace(regex, "")
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
        denyUpdate: true
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
})
Messages.attachSchema(messagesSchema);
Messages.allow({
    insert: function (userId, doc) {
        if (!Meteor.users.findOne(doc.to) && !Meteor.users.findOne(doc.from)) {
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
                Messages.update({_id: msgId}, {$set: {reciver: 2}}, function () {
                    Meteor.call('refreshChatlist', {userId: msg.to, participant: msg.from});
                })
            }
            if (this.userId == msg.from) {
                Messages.update({_id: msgId}, {$set: {sender: 1}}, function () {
                    Meteor.call('refreshChatlist', {userId: msg.from, participant: msg.to})
                })

            }
        },
        refreshChatlist: function (doc) {
                if (doc.userId == Meteor.userId()) {
                var msg = Messages.find({
                    $or: [{
                        from: doc.userId,
                        to: doc.participant,
                        sender:0
                    }, {from: doc.participant, to: doc.userId, reciver: {$lte: 1}}]
                }, {sort: {sendingAt: -1}, limit: 1}).fetch();
            if (msg.length < 1) {
        Chatlist.remove({userId: doc.userId, participant: doc.participant})
    } else {
        Chatlist.update({
            userId: doc.userId,
            participant: doc.participant,
        }, {
            $set: {
                lastMessage: msg[0].message,
                sentAt: msg[0].sendingAt,
                direction: doc.userId == msg[0].from,
                seen:true
            }
        })
    }

}
}
})

}

Chatlist = new Meteor.Collection("chatlist");

chatlistSchema = new SimpleSchema({
    userId: {
        type: String,
        custom: function () {
            if (!this.value || this.value.length < 1) {
                return "required";
            }
            if (!Meteor.users.findOne({_id: this.value})) {
                return "alreadyExist";
            }
            if (Chatlist.findOne({participant: this.field('participant').value, userId: this.value})) {
                return 'alreadyExist';
            }
        },
        denyUpdate:true

    },
    lastMessage: {
        type: String,
        trim:true,
        autoValue: function () {
            if (this.isSet) {
                var regex = /(<([^>]+)>)/ig;
                return this.value.replace(regex, "")
            }
        }
    }
    ,
    participant: {
        type: String,
        autoValue: function () {
            return Meteor.users.findOne({_id: this.value}).username;
        },
        denyUpdate:true

    },
    sentAt: {
        type: Date,

    },
    direction: {
        type: Boolean,
    },
    participantUsername: {
        type: String,
        denyUpdate:true
    },
    seen:{
        type:Boolean,

    }


});