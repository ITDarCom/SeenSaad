Template.profile.helpers({
    active: function () {
        return Session.get('template')
    },
    thisUser: function () {
        if (Router.current().params.id)
            return Meteor.users.findOne(Router.current().params.id)
        var userId = Meteor.userId();
        var user = Meteor.users.findOne(userId) || {};
        return user;
    },
    notUserOrGuest: function () {
        var userId = Meteor.userId();
        var profileId = this._id;
        return !!Meteor.userId() && userId != profileId;
    }
});

Template.profile.events({
    'click #sendMessage': function () {
        Session.set('template', 'messageStream')
    }
});
Template.profile.onRendered(function () {
    Session.set('template', 'articles')
})