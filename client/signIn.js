/**
 * Created by omar on 10/19/15.
 */
Template.signIn.onRendered(function () {
    $('button').removeClass('btn-default').addClass('btn-primary');
    $('.at-title').remove();
    $('.at-form').css('marginTop', 0)
    $('.at-form').css('marginBottom', 0)
    $('label').remove()
    $('#at-signUp,#at-signIn').parent().remove()

})
