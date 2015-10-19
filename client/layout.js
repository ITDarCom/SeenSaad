//accountsUIBootstrap3.setLanguage('ar'); // for Arabic
//Accounts.ui.config({
//	passwordSignupFields: "USERNAME_ONLY"
//});

Template.layout.events({
	'click .myprofile': function () {
		event.preventDefault()
		Router.go("me");
	},
	'click .logOut': function () {
		AccountsTemplates.logout();
	},
	'click .signIn': function () {
		event.preventDefault();
		Router.go('signIn')
	}
})