/**
 * Created by omar on 10/4/15.
 */
//noinspection JSUnusedGlobalSymbols
Template.messages.helpers({
    senders: function () {
        return Chatlist.find({userId: Meteor.userId()},{sort:{sentAt:-1}})
    },
    hasMore: function () {
        var limit = Template.instance().state.get('limit');
        var listCounter = Chatlist.find().count();
        return limit <= listCounter;
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
        return Messages.find({$or: [{to: Router.current().params.id}, {from: Router.current().params.id}]}, {sort: {sendingAt: 1}});
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
    },
    hasMore: function () {
        return (Template.instance().state.get('limit') >= Messages.find().count() && Messages.find().count() >= 15 )
    }

});
Template.messageStream.onRendered(function () {


    document.getElementById("msgStream").addEventListener("scroll", Template.instance().listener)
    setTimeout(function () {
        var stream = $('#msgStream');
        stream.scrollTop(stream[0].scrollHeight);
    }, 200);


});
Template.messageStream.events({
    'click .deleteMsgBtn': function () {

        if (Meteor.userId()) {
            Meteor.call('removeMessage', this._id, function (err,result) {
                if(!err){
                    msgStreamSubs.reset();
                }
            });
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
            if($('.msgTextarea').val().length > 1 && $('.msgTextarea').val().trim().length>1 ) {
                $('#sendMsgToUser').submit();
            }
        }
    }


});
Template.messages.events({
    'click .clickableDiv': function () {
        Router.go('messageStream', {id: this.participant});
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
        formToDoc: function (doc) {

            doc.sendingAt = new Date();
            doc.from = Meteor.userId();
            doc.fromUsername = Meteor.user().username;
            doc.toUsername = $('.select2-chosen').text();
            doc.message = doc.message.trim();
            return doc;
        },
        onSuccess: function (result) {
            $('.select2-chosen').text('إلى')
        }
    },
    sendMsgToUser: {
        formToDoc: function (doc) {
            doc.sendingAt = new Date();
            doc.from = Meteor.userId();
            doc.fromUsername = Meteor.user().username;
            doc.toUsername = Meteor.users.findOne({_id: doc.to}).username;
            doc.message = doc.message.trim();
            return doc;
        },
        onSuccess: function () {
            var stream = $('.messagesStream');
            stream.scrollTop(stream[0].scrollHeight);
            var current = $('.messagesStream').scrollTop();
            $('.messagesStream').scrollTop(current + $('.clearfix').height())

        }
    }
});
var msgStreamSubs = new SubsManager();
Template.messageStream.onCreated(function () {
    var instance = this;
    instance.state = new ReactiveDict();
    instance.state.set('limit', 15);

    instance.autorun(function () {
        if (Messages.find({to: Meteor.userId()}).count() > 0) {
            var current = $('.messagesStream').scrollTop();
            $('.messagesStream').scrollTop(current + $('.clearfix').height())
        }
    });
    instance.autorun(function () {
        if (instance.state.get('limit') > 0) {
            msgStreamSubs.subscribe('messages', registerHelpers.currentId(), instance.state.get('limit'));
        }
    });
    instance.listener = new reverseScrollListener(instance, ".messagesStream", function () {
        $('.messagesStream').scrollTop(($('.clearfix').height() * 15));

    });
    msgStreamSubs.subscribe('chatParticipant', registerHelpers.currentId())


});

Template.messages.onCreated(function () {
    var instance = this;
    instance.state = new ReactiveDict();
    instance.state.set('limit', 5);
    instance.autorun(function () {
        var limit = instance.state.get('limit');
        msgStreamSubs.subscribe('chatlists', instance.state.get('limit'));
    });
    instance.listener = new ScrollListener(instance, window);
    window.addEventListener('scroll', instance.listener);

});