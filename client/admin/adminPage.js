/**
 * Created by omar on 21/11/15.
 */

Template.userAdministrativeActions.helpers({
    blocked : function(){
        return Template.instance().data.blocked
    }
});

Template.userAdministrativeActions.events({


    'click .userIdLogIn': function (event) {
        var userId = $(event.target).attr('userid');
        Meteor.call('impersonate', userId, function (err) {
            if (!err) {
                Meteor.connection.setUserId(userId);
                Router.go('home');
            }
        });
    },
    'click .deleteUser': function (event) {
        if (confirm('Are you sure')) {
            var userId = $(event.target).attr('userid');
            Meteor.call('deleteUser', userId);
        }
    },
    'click .blockUser': function (event) {
        var blockAction = Template.instance().data.blocked ?
            'unblock' : 'block'
        if (confirm('Are you sure you want to '+blockAction+' this user?')) {
            var userId = $(event.target).attr('userid');
            Meteor.call('setUserBlocked', userId, !Template.instance().data.blocked);
        }
    }
});

Template.adminPage.onRendered(function () {
    $('#adminTable_filter').addClass('pull-left');
    $('.dataTables_info').remove();
})
    