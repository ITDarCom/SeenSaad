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
        var headers;
        headers = {
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
            'me': 'ملفك الشخصي',
            'resetPasswd': 'ملفك الشخصي',
            'editPersonalInfo': 'ملفك الشخصي',
            editProfileImg: 'ملفك الشخصي'

        }
        route = Router.current().route.getName()
        if (route == 'article') {
            if (Session.get('lastRoute') && _.contains(['read', 'participation', 'articles', 'home', 'mine'], Session.get('lastRoute'))) {
                lastheader = Session.get('lastRoute') != 'home' ? Session.get('lastRoute') : ''
                return '<a href="/' + lastheader + '"><span class="glyphicon glyphicon-share-alt" aria-hidden="true"></span>&nbsp;' + +headers[Session.get('lastRoute')] + '</a>'
            }
        }
        if (route == 'global') {
            if (Session.get('urlType') == 'article') {
                if (Session.get('lastRoute') && _.contains(['read', 'participation', 'articles', 'home', 'mine'], Session.get('lastRoute'))) {
                    lastheader = Session.get('lastRoute') != 'home' ? Session.get('lastRoute') : ''
                    return '<a href="/' + lastheader + '">' + '<span class="glyphicon glyphicon-share-alt" aria-hidden="true"></span>' + headers[Session.get('lastRoute')] + '</a>'
                }
            }
            if (Session.get('urlType') == 'profile') {
                var id = Router.current().params.id;
                var userId = Meteor.users.findOne({username: id.substr(1, id.length)})._id;
                return 'مواضيع العضو:' + registerHelpers.userFullName(userId);
            }
        }
        else
            return headers[route]
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
            'me': 'الصورة والمعلومات الشخصية',
            'resetPasswd': 'الصورة والمعلومات الشخصية',
            'editPersonalInfo': 'الصورة والمعلومات الشخصية',
            editProfileImg: 'الصورة والمعلومات الشخصية'
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