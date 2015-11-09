/**
 * Created by omar on 10/19/15.
 */
Template.signIn.onRendered(function () {
    $('button').removeClass('btn-default').addClass('btn-primary');
    $('.at-title,#at-forgotPwd').remove();
    $('.at-form').css('marginTop', 0)
    $('.at-form').css('marginBottom', 0)
    $('label').remove()
    $('#at-signUp,#at-signIn').parent().remove()
    $('#tab1info').find('#at-field-username').addClass("input-group").parent().addClass('input-group')
        .append('<span class="input-group-addon">/SeenSaad.com</span><span class="help-block"></span>');
    $('#tab2info').find('#at-field-username').addClass("input-group").parent().addClass('input-group')
        .append('<span class="input-group-addon">/SeenSaad.com</span><span class="help-block"></span>');
})
