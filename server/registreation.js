var mySubmitFunc = function (error, state) {
    if (!error) {
        if (state === "signUp") {
            Stream.insert({userId: Meteor.userId()})
            Favorites.insert({userId: Meteor.userId()})
        }
    }
};

AccountsTemplates.configure({
    confirmPassword: true,
    enablePasswordChange: true,
    showForgotPasswordLink: true,
    enablePasswordChange: true,
    focusFirstInput: true,
    showLabels: false,
    showPlaceholders: true,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,
    homeRoutePath: '/profile',
    continuousValidation: true,
    negativeFeedback: true,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,
    onSubmitHook: mySubmitFunc
});
