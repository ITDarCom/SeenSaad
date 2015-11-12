/**
 * Created by omar on 10/19/15.
 */
Template.signIn.onRendered(function () {
    $('button').removeClass('btn-default').addClass('btn-primary');
    $('.at-title,#at-forgotPwd').remove();
    $('.at-form').css('marginTop', 0)
    $('.at-form').css('marginBottom', 0)
    $('label').remove()
    $('#at-signUp,#at-signIn').parent().hide()
    $('#signInTab').find('#at-field-username').addClass("input-group").parent().addClass('input-group')
        .append('<span name= "seensaadlabel" class="input-group-addon">@/SeenSaad.com</span><span class="help-block"></span>');
    $('#signUpTab').find('#at-field-username').addClass("input-group").parent().addClass('input-group')
        .append('<span name= "seensaadlabel" class="input-group-addon">@/SeenSaad.com</span><span class="help-block"></span>');
    $('[name=seensaadlabel]').css('padding-left', '26px')
});
Template.signIn.events({
    'click #signInClick': function () {
        $('#signInTab').find('#at-field-password2').attr('id', 'at-field-password');
    },
    'click #signUpClick': function () {
        $('#signInTab').find('#at-field-password').attr('id', 'at-field-password2');
    },

})
