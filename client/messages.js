/**
 * Created by omar on 10/4/15.
 */
Template.messages.events({
    'click .sendMsgBtn': function (e) {
        $('#sendMsgDiv').slideToggle();
    }
});
Template.messages.helpers({
    senders: function () {
        var me = Meteor.userId();
        var contacts = [];
        Messages.find({}, {fields: {to: 1, from: 1}}, {sort: {sendingAt: -1}}).forEach(function (e) {
            if (e.to == me)
                contacts.push(e.from)
            else
                contacts.push(e.to)
        })
        return _.uniq(contacts)
    },
    lastMessage: function () {
        return Messages.find({$or: [{to: this.toString()}, {from: this.toString()}]}, {
            sort: {
                sendingAt: -1,
                limit: 1
            }
        }).fetch()[0].message
    },
    
})
Template.messageStream.helpers({
    fromMe: function () {
        this.seen = true;
        return (this.from == Meteor.userId())
    },
    messages: function () {
        return Messages.find({$or: [{to: Router.current().params.id}, {from: Router.current().params.id}]})
    },
    thisUser: function () {
        return (Router.current().params.id)
    }
})
Template.messageStream.onRendered(function () {
    $(document).on('mouseenter', '.msg', function () {
        $(this).find(":button").show();
    }).on('mouseleave', '.msg', function () {
        $(this).find(":button").hide();
    });
})
Template.messageStream.events({
    'click .delectConversionBtn': function () {
        if (Meteor.userId()) {
            Meteor.call("deleteConversion", Router.current().params.id)
            Router.go('messages')
        }
    },
    'click .deleteMsgBtn': function () {
        if (Meteor.userId())
            Messages.remove({_id: this._id})
    }
})