/**
 * Created by omar on 10/19/15.
 */
Template.signIn.onRendered(function () {

    $('button').removeClass('btn-default').addClass('btn-primary');
    $('.at-title,#at-forgotPwd').remove();
    $('.at-form').css('marginTop', 0).css('marginBottom', 0);
    $('label').remove()
    $('#at-signUp,#at-signIn').parent().hide();

    var signInTab = $('#signInTab');
    signInTab.find('#at-field-username,#at-field-password ')
        .addClass("input-group dirLtr text-center nopadding");
    //noinspection JSValidateTypes
    signInTab.find('#at-field-username')
        .parent().addClass('input-group')
        .append('<span style="padding-right=6px;" name= "seensaadlabel" class="seenSaadLabel input-group-addon">' +
        '@/SeenSaad.com</span><span class="help-block"></span>');
    var signUpTab = $('#signUpTab');
    signUpTab.find('#at-field-username,#at-field-password,#at-field-password_again ')
        .addClass("input-group dirLtr text-center nopadding");
    //noinspection JSValidateTypes
    signUpTab.find('#at-field-username').parent().addClass('input-group')
        .append('<span name= "seensaadlabel" class="seenSaadLabel input-group-addon">' +
        '@/SeenSaad.com</span><span class="help-block"></span>');
    //$('[name=seensaadlabel]').css('padding-left', '26px');


});
Template.signIn.events({
    'click #signInClick': function () {
        $('#signInTab').find('#at-field-password2').attr('id', 'at-field-password');
        $('.has-error').removeClass('has-error');
        $('.help-block').text('');
        $('.at-error').hide();
        $('.alert-success').hide();
        $('.btn-primary').prop('disabled', false);

    },
    'click #signUpClick': function () {
        $('#signInTab').find('#at-field-password').attr('id', 'at-field-password2');
        $('.has-error').removeClass('has-error');
        $('.help-block').text('');
        $('.at-error').hide();
        $('.btn-primary').prop('disabled', false);

    }

});

