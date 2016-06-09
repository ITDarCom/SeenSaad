/**
 * Created by omar on 10/19/15.
 */
Template.signIn.onRendered(function () {

    $('button').removeClass('btn-default').addClass('btn-primary');
    $('.at-form').css('marginTop', 0).css('marginBottom', 0);

    var activeTab = $('.tab-pane.active');
    activeTab.find('#at-field-username,#at-field-password')
        .addClass("input-group dirLtr text-center nopadding");
    if(Session.get('state') == "signUp"){
        $('#at-field-password_again').addClass("input-group dirLtr text-center nopadding");
    }

    activeTab.find('#at-field-username')
        .parent().addClass('input-group')
        .append('<span style="padding-right=6px;" name= "seensaadlabel" class="seenSaadLabel input-group-addon">' +
            '@/SeenSaad.com &nbsp;&nbsp; &nbsp;</span><span class="help-block"></span>');

});
Template.signIn.events({
    'click #signInClick': function () {
        $('.has-error').removeClass('has-error');
        $('.help-block').text('');
        $('.at-error').hide();
        $('.alert-success').hide();
        $('.btn-primary').prop('disabled', false);
        $('.at-signin-link>p').remove();

        Router.go('signIn');


    },
    'click #signUpClick': function () {


        $('.at-signin-link>p').remove();
        $('.alert-success').hide();
        $('.has-error').removeClass('has-error');
        $('.help-block').text('');
        $('.at-error').hide();
        $('.btn-primary').prop('disabled', false);

        Router.go("signUp");



    }

});

Template.signIn.helpers({
    state: function () {
        return Session.get("state");
    }
});


