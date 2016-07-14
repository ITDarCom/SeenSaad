/**
 * Created by omar on 10/4/15.
 */
//noinspection JSUnusedGlobalSymbols
Template.messages.helpers({
    senders: function () {
        var me = Meteor.userId();
        var contacts = [];
        Messages.find({$or: [{to: Meteor.userId()}, {from: me}]},
            {sort: {sendingAt: -1}}).forEach(function (e) {
            if (e.to == me) {
                contacts.push({
                    id: e.from,
                    sendingAt: e.sendingAt,
                    fromUsername: e.fromUsername,
                    toUsername: e.toUsername
                });
            }
            else {
                contacts.push({
                    id: e.to,
                    sendingAt: e.sendingAt,
                    fromUsername: e.fromUsername,
                    toUsername: e.toUsername
                });
            }
        });
        return _.sortBy(_.uniq(contacts, false, function (c) {
            return c.id
        }), 'sendingAt').reverse();
    },
    lastMessage: function () {
        var message = Messages.find({$or: [{to: this.id.toString()}, {from: this.id.toString()}]}, {
            sort: {
                sendingAt: -1,
                limit: 1
            }
        }).fetch()[0].message;

        if (message.length > 80) {
            return (message.substring(1, 80) + '....');
        }
        else {
            return message;
        }
    },
    lastMessageSendingAt: function () {
        return Messages.find({$or: [{to: this.id.toString()}, {from: this.id.toString()}]}, {
            sort: {
                sendingAt: -1,
                limit: 1
            }
        }).fetch()[0].sendingAt;
    },
    isNew: function () {
        var message = Messages.find({$or: [{to: this.id.toString()}, {from: this.id.toString()}]}, {
            sort: {
                sendingAt: -1,
                limit: 1
            }
        }).fetch()[0];
        if (message.reciver == 0 && message.from != Meteor.userId()) {
            return '<span class="badge redDiv" title=' + arabicMessages.newLabel
                + '><i class="fa fa-comment"></i></span>';
        }


    },
    getUsername: function () {
        if (Meteor.user().username == this.fromUsername) {
            return this.toUsername
        }
        else {
            return this.fromUsername
        }
    }

});
Template.messageStream.helpers({
    fromMe: function () {
        //noinspection JSUnresolvedVariable
        return (this.from == Meteor.userId());
    },
    messages: function () {
        return Messages.find({$or: [{to: Router.current().params.id}, {from: Router.current().params.id}]});
    },
    thisUser: function () {
        return (Router.current().params.id );
    },
    thisUsername: function () {
        if (registerHelpers.currentId()) {
            if (Messages.findOne({to: registerHelpers.currentId()})) {
                return Messages.findOne({to: registerHelpers.currentId()}).toUsername;
            }
            if (Messages.findOne({from: registerHelpers.currentId()})) {
                return Messages.findOne({from: registerHelpers.currentId()}).fromUsername;
            }
        }

    },
    seenChange: function (id) {
        Tracker.nonreactive(function () {
            Meteor.call("seenChangeMsg", id);
        })
    }

});
Template.messageStream.onRendered(function () {
    var stream = $('.messagesStream');
    stream.scrollTop(stream[0].scrollHeight);


});
Template.messageStream.events({
    'click .deleteMsgBtn': function () {

        if (Meteor.userId()) {
            Meteor.call('removeMessage', this._id);
        }
    },
    'mouseenter .clearfix ': function (event, template) {
        event.preventDefault();
        $(event.target).find("button").css('display', 'inline-block');
        //console.log(template.find(":button"));

    },
    'mouseleave .clearfix': function (event, template) {
        event.preventDefault();

        $(event.target).find("button").css('display', 'none');
        //console.log(template.find(":button"));

    },
    'keydown': function (e) {

        if (e.keyCode == 13) {
            $('#sendMsgToUser').submit();
        }
    }


});
Template.messages.events({
    'click .clickableDiv': function () {
        Router.go('messageStream', {id: this.id});
    },
});
Template.messages.onRendered(function () {
    $('.select2-chosen').text(arabicMessages.messageToLabel);
});


Template.afQuickField.onRendered(function () {

    if (this.data.name == 'to') {
        $("#to").select2({
            ajax: {
                dataType: "json",
                data: function (params) {
                    return {
                        q: params
                    };
                },
                results: function (data, params) {
                    var results = [];
                    _.each(data.results, function (result) {
                        if (result._id != Meteor.userId())
                            results.push({
                                id: result._id,
                                text: result.username
                            });
                    });
                    return {
                        results: results
                    };

                },
                transport: function (params, success, failure) {
                    Meteor.call('usernamesSearch', params.data.q, function (err, results) {
                        if (err) {
                            params.failure(err);
                            return;
                        }

                        params.success(results);
                    });
                }

            },
            minimumInputLength: 1,
            language: 'ar',
            minimumInputLength: 2,
            minimumResultsForSearch: 10,
        })
    }
});
AutoForm.hooks({
    sendMsg: {
        onSuccess: function () {
            $('.select2-chosen').text('إلى')
        }
    },
    sendMsgToUser: {
        onSuccess: function () {
            var stream = $('.messagesStream');
            stream.scrollTop(stream[0].scrollHeight);
        }
    }
});
Template.messageStream.onCreated(function () {
    var instance = this;
    instance.autorun(function () {
        if (Messages.find({to: Meteor.userId()}).count() > 0) {
            var current = $('.messagesStream').scrollTop();
            $('.messagesStream').scrollTop(current + $('.clearfix').height())
        }
    })
});
