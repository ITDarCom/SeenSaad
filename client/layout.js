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
			case 'articles':
				return 'س ص'
			case 'search':
				return 'بحث'
			case "read":
				return 'مشاهدة'
			case "participation":
				return 'مشاركة'
			case "favorite":
				return 'مفضلة'
			case "mine":
				return ' مواضيعك'
			case 'messages':
				return 'الرسائل'
			case 'messageStream':
				return '<a href="/messages"}}">الرسائل</a>'
			case 'about':
				return 'حول الموقع'
			case 'me':
				return 'ملفك الشخصي'

		}
	},
	headerDescription: function () {
		switch (Router.current().route.getName()) {
			case 'articles':
				return 'المواضيع العامة والمواضيع التي لك صلاحية مشاهدتها أو المشاركة فيها'
			case 'search':
				return 'بحث في المواضيع العامة والمواضيع التي لك صلاحية مشاهدتها أو المشاركة فيها'
			case "read":
				return 'المواضيع التي لك صلاحية مشاهدتها'
			case "participation":
				return 'المواضيع التي لك صلاحية المشاركة فيها'
			case "favorite":
				return 'المواضيع التي وضعتها في المفضلة'
			case "mine":
				return 'مواضيعك التي أضفتها'
			case 'messages':
				return ' الرسائل الخاصة مع الأعضاء'
			case 'messageStream':
				return ' الرسائل الخاصة مع:'
			case 'about':
				return 'ما هو س ص؟'
			case 'me':
				return 'الصورة والمعلومات الشخصية'
		}

	}
})