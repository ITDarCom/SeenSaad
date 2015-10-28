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
Template.headerText.helpers({
	headerText: function () {
		switch (Router.current().route.getName()) {
			case "read" :
				return 'مواضيع المشاهدة'
			case "participation" :
				return 'مواضيع المشاركة'
			case "favorite" :
				return 'المواضيع المفضلة'
			case "mine" :
				return ' مواضيعي'
			case 'articles':
				return 'المواضيع العامة'
			case 'search':
				return 'البحث'
			case 'messages':
				return 'الرسائل الخاصة'
			case 'about':
				return 'حول الموقع'

		}
	},
	headerDescription: function () {
		switch (Router.current().route.getName()) {
			case "read" :
				return 'المواضيع التي لك صلاحية مشاهدتها'
			case "participation" :
				return ' المواضيع التي لك صلاحية مشاهدتها ووالمساهمة في نقاشها'
			case "favorite" :
				return 'مواضيعك المفضلة'
			case "mine" :
				return 'مواضيعك '
			case 'articles':
				return 'جميع المواضيع التي لك صلاحية الوصول إليها'
			case 'search':
				return 'اكتب الكلمات المراد البحث عنها'
			case 'messages':
				return ' الرسائل الخاصة المتبادلة مع أعضاء الموقع'
			case 'about':
				return 'ما هو موقع س ص؟ '
		}

	}
})