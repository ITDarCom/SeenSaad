Template.layout.events({
    'click .logOut': function () {
        AccountsTemplates.logout();
    },
    'click .signIn': function (event) {
        event.preventDefault();
        FlowRouter.go('signIn');
    }
});
Template.layout.helpers({
    isActive: function (id) {
        return FlowRouter.getRouteName() == id;
    }
});
//noinspection JSUnusedGlobalSymbols
Template.headerText.helpers({
    headerText: function () {
        var headers = {
            'add': arabicMessages.headers.add,
            'edit': arabicMessages.headers.edit,
            'read': arabicMessages.headers.read,
            'participation': arabicMessages.headers.participation,
            'articles': arabicMessages.headers.articles,
            'home': arabicMessages.headers.home,
            'favorite': arabicMessages.headers.favorite,
            'mine': arabicMessages.headers.mine,
            'search': arabicMessages.headers.search,
            'about': arabicMessages.headers.about,
            'messages': arabicMessages.headers.messages,
            'messageStream': arabicMessages.headers.messageStream,
            'me': arabicMessages.headers.me,
            'resetPasswd': arabicMessages.headers.resetPasswd,
            'editPersonalInfo': arabicMessages.headers.editPersonalInfo,
            'editProfileImg': arabicMessages.headers.editProfileImg,
            'admin': arabicMessages.headers.adminPage

        };
        var route = FlowRouter.getRouteName();
        if (route == 'profile') {
            return (arabicMessages.userArticles + registerHelpers.userFullName(registerHelpers.currentId()) )
        }

        if (route == 'global') {
            if (Session.get(    'urlType') == 'article') {
                if (Session.get('lastRoute') && _.contains(['read', 'participation', 'articles', 'home'
                        , 'mine', 'search','favorite'], Session.get('lastRoute'))) {
                    var lastheader = Session.get('lastRoute') != 'home' ? Session.get('lastRoute') : '';
                    return '<a href="/' + lastheader + '">' + '<span class="glyphicon glyphicon-share-alt" ' +
                        'aria-hidden="true"></span>' + '&nbsp;' + headers[Session.get('lastRoute')] + '</a>'
                }
            }
        }
        else
            return headers[route]
    },
    headerDescription: function () {
        var headerDescriptions = {
            'edit': arabicMessages.headerDescription.edit,
            'add': arabicMessages.headerDescription.add,
            'articles': arabicMessages.headerDescription.articles,
            'home': arabicMessages.headerDescription.home,
            'search': arabicMessages.headerDescription.search,
            'read': arabicMessages.headerDescription.read,
            'participation': arabicMessages.headerDescription.participation,
            'favorite': arabicMessages.headerDescription.favorite,
            'mine': arabicMessages.headerDescription.mine,
            'messages': arabicMessages.headerDescription.messages,
            messageStream: arabicMessages.headerDescription.messageStream,
            'about': arabicMessages.headerDescription.about,
            'me': arabicMessages.headerDescription.me,
            'resetPasswd': arabicMessages.headerDescription.resetPasswd,
            'editPersonalInfo': arabicMessages.headerDescription.editPersonalInfo,
            'editProfileImg': arabicMessages.headerDescription.editProfileImg,
            'admin': arabicMessages.headerDescription.adminPage

        };
        if (FlowRouter.getRouteName() == 'article') {
            if (Session.get('lastRoute') && _.contains(['read', 'participation', 'articles', 'home', 'mine']
                    , Session.get('lastRoute')))
                return headerDescriptions[Session.get('lastRoute')]
        }
        else
            return headerDescriptions[FlowRouter.getRouteName()]

    }
});