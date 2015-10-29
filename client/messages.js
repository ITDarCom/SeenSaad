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
    s2Opts: function () {
        return {
            placeholder: "tesssst",
            allowClear: true
        };
    },
    lastMessage: function () {
        return Messages.find({$or: [{to: this.toString()}, {from: this.toString()}]}, {
            sort: {
                sendingAt: -1,
                limit: 1
            }
        }).fetch()[0].message
    },
    lastMessageSendingAt: function () {

        return Messages.find({$or: [{to: this.toString()}, {from: this.toString()}]}, {
            sort: {
                sendingAt: -1,
                limit: 1
            }
        }).fetch()[0].sendingAt
    }

})
Template.messageStream.helpers({
    fromMe: function () {
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
    $(document).on('mouseenter', '.clearfix', function () {
        $(this).find(":button").removeClass("hidden");
    }).on('mouseleave', '.clearfix', function () {
        $(this).find(":button").addClass("hidden");
    });
})
Template.messageStream.events({
    'click .deleteMsgBtn': function () {
        if (Meteor.userId())
            Meteor.call('removeMessage', this._id);
    }
})
AutoForm.hooks({
    sendMsgToUser: {
        onSuccess: function (formType) {
            if (formType == 'insert')
                $('.msgTextarea').empty();
        }
    },
    sendMsg: {
        onSuccess: function (formType) {
            if (formType == 'insert')
                $('.msgTextarea').empty();
        }
    }

})
Template.messages.onRendered(function () {
    $('.select2-chosen').text('إلـى');
})