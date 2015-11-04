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
        var headers = {
            'read': 'مشاهدة',
            'participation': 'مشاركة',
            'articles': 'س ص',
            'home': 'س ص',
            "favorite": 'مفضلة',
            'mine': ' مواضيعك',
            'search': 'بحث',
            'about': 'حول الموقع',
            'messages': 'الرسائل',
            'messageStream': '<a href="/messages"}}">الرسائل</a>',
            'me': 'ملفك الشخصي'
        }
        if (Router.current().route.getName() == 'article') {
            if (Session.get('lastRoute') && _.contains(['read', 'participation', 'articles', 'home', 'mine'], Session.get('lastRoute'))) {
                lastheader = Session.get('lastRoute') != 'home' ? Session.get('lastRoute') : ''
                return '<a href="/' + lastheader + '">' + headers[Session.get('lastRoute')] + '</a>'
            }
        }
        else
            return headers[Router.current().route.getName()]
        //switch (Router.current().route.getName()) {
        //	case 'articles':
        //		return 'س ص'
        //	case 'home':
        //		return 'س ص'
        //	case 'search':
        //		return 'بحث'
        //	case "read":
        //		return 'مشاهدة'
        //	case "participation":
        //		return 'مشاركة'
        //	case "favorite":
        //		return 'مفضلة'
        //	case "mine":
        //		return ' مواضيعك'
        //	case 'messages':
        //		return 'الرسائل'
        //	case 'messageStream':
        //		return '<a href="/messages"}}">الرسائل</a>'
        //	case 'about':
        //		return 'حول الموقع'
        //	case 'me':
        //		return 'ملفك الشخصي'
        //	case 'article':
        //		if(this.user==Meteor.userId())
        //			return '<a href="/mine">مواضيعك</a>'
        //		if(this.contributingPermissions==1 && _.contains(this.contributingIds,Meteor.userId()))
        //		   return '<a href="/participation">مشاركة</a>'
        //		if(this.readingPermissions==1 && _.contains(this.readingIds,Meteor.userId()))
        //			return '<a href="/read">مشاهدة</a>'
        //		if(this.readingPermissions==0 || this.contributingPermissions == 0)
        //			return '<a href="/">س ص </a>'
        //
        //
        //}
    },
    headerDescription: function () {
        headerDescriptions = {
            'articles': 'المواضيع العامة والمواضيع التي لك صلاحية مشاهدتها أو المشاركة فيها',
            'home': 'المواضيع العامة والمواضيع التي لك صلاحية مشاهدتها أو المشاركة فيها',
            'search': 'بحث في المواضيع العامة والمواضيع التي لك صلاحية مشاهدتها أو المشاركة فيها',
            "read": 'المواضيع التي لك صلاحية مشاهدتها',
            "participation": 'المواضيع التي لك صلاحية المشاركة فيها',
            "favorite": 'المواضيع التي وضعتها في المفضلة',
            "mine": 'مواضيعك التي أضفتها',
            'messages': ' الرسائل الخاصة مع الأعضاء',
            'messageStream': ' الرسائل الخاصة مع:',
            'about': 'ما هو س ص؟',
            'me': 'الصورة والمعلومات الشخصية'
        }
        if (Router.current().route.getName() == 'article') {
            if (Session.get('lastRoute') && _.contains(['read', 'participation', 'articles', 'home', 'mine'], Session.get('lastRoute')))
                return headerDescriptions[Session.get('lastRoute')]
        }
        else
            return headerDescriptions[Router.current().route.getName()]
        //switch (Router.current().route.getName()) {
        //    case 'articles':
        //        return 'المواضيع العامة والمواضيع التي لك صلاحية مشاهدتها أو المشاركة فيها'
        //    case 'home':
        //        return 'المواضيع العامة والمواضيع التي لك صلاحية مشاهدتها أو المشاركة فيها'
        //    case 'search':
        //        return 'بحث في المواضيع العامة والمواضيع التي لك صلاحية مشاهدتها أو المشاركة فيها'
        //    case "read":
        //        return 'المواضيع التي لك صلاحية مشاهدتها'
        //    case "participation":
        //        return 'المواضيع التي لك صلاحية المشاركة فيها'
        //    case "favorite":
        //        return 'المواضيع التي وضعتها في المفضلة'
        //    case "mine":
        //        return 'مواضيعك التي أضفتها'
        //    case 'messages':
        //        return ' الرسائل الخاصة مع الأعضاء'
        //    case 'messageStream':
        //        return ' الرسائل الخاصة مع:'
        //    case 'about':
        //        return 'ما هو س ص؟'
        //    case 'me':
        //        return 'الصورة والمعلومات الشخصية'
        //}

    }
})