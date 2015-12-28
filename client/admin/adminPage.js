/**
 * Created by omar on 21/11/15.
 */

Template.adminPage.events({
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
    }
});
Template.adminPage.onRendered(function () {
    var temp = $('#adminTable_filter').addClass('pull-left').find('label').html().substr('5');
    $('#adminTable_filter').addClass('pull-left').html('<span><i class="fa fa-search"></i></span> : ' + temp);
})
