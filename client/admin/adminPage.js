/**
 * Created by omar on 21/11/15.
 */

Template.adminPage.events({
'click .userIdLogIn'    : function () {
    var userId = $(event.target).attr('userid');
    Meteor.call('impersonate', userId, function(err) {
        if (!err) {
            Meteor.connection.setUserId(userId);
            Router.go('home');
        }
    });
}
});


