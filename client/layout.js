Template.layout.events({
    'click .logOut': function () {
        AccountsTemplates.logout();
    },
    'click .signIn': function () {
        event.preventDefault();
        Router.go('signIn');
    }
});
Template.headerText.helpers({
    headerText: function () {
        var headers = {
            'add': 'إضافة موضوع',
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

        };
        var route = Router.current().route.getName();
        if (route == 'profile') {
            return ('مواضيع العضو ' + registerHelpers.userFullName(registerHelpers.currentId()) )
        }

        if (route == 'global') {
            if (Session.get('urlType') == 'article') {
                if (Session.get('lastRoute') && _.contains(['read', 'participation', 'articles', 'home', 'mine'], Session.get('lastRoute'))) {
                    lastheader = Session.get('lastRoute') != 'home' ? Session.get('lastRoute') : ''
                    return '<a href="/' + lastheader + '">' + '<span class="glyphicon glyphicon-share-alt" aria-hidden="true"></span>' + '&nbsp;' + headers[Session.get('lastRoute')] + '</a>'
                }
            }
        }
        else
            return headers[route]
    },
    headerDescription: function () {
        var headerDescriptions = {
            'edit': 'تعديل الموضوع',
            'add': 'أضف موضوع جديد',
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
        };
        if (Router.current().route.getName() == 'article') {
            if (Session.get('lastRoute') && _.contains(['read', 'participation', 'articles', 'home', 'mine'], Session.get('lastRoute')))
                return headerDescriptions[Session.get('lastRoute')]
        }
        else
            return headerDescriptions[Router.current().route.getName()]

    }
});