/**
 * Created by omar on 10/4/15.
 */
Template.messages.events({
    'click .sendMsgBtn': function (e) {
        $('#sendMsgDiv').slideToggle();
    }
});
Template.messages.onRendered(function () {
    $('.select2-chosen').val(null)
})
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
    },
    select2opts: function () {

    },
    usersOptions: function () {
        return Meteor.users.find({_id: {$not: Meteor.userId()}}).map(function (c) {
            return {label: c.username, value: c._id};
            // return users name for select2 field
        })
    }
})
Template.messageStream.onRendered(function () {
    $(document).on('mouseenter', '.clearfix', function () {
        $(this).find(":button").removeClass("hidden");
    }).on('mouseleave', '.clearfix', function () {
        $(this).find(":button").addClass("hidden");
    });
})
Template.messageStream.events({
    'click .deleteMsgBtn': function () {
        if (Meteor.userId())
            Messages.remove({_id: this._id})
    }
})