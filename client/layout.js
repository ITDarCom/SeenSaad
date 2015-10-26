//accountsUIBootstrap3.setLanguage('ar'); // for Arabic
//Accounts.ui.config({
//	passwordSignupFields: "USERNAME_ONLY"
//});

Template.layout.events({

	'click .logOut': function () {
		AccountsTemplates.logout();
	},
	'click .signIn': function () {
		event.preventDefault();
		Router.go('signIn')
	}
})