Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'spinner',
    notFoundTemplate: 'notFound'
});
var privateRoutes = [
    "messages",
    "read",
    "add",
    "edit",
    "participation",
    "mine",
    "profile",
    "me",
    "resetPasswd",
    "editPersonalInfo",
    "editProfileImg",
    "messageStream",
    "favorite"
];
Router.ensureLoggedIn = function () {
    if (!Meteor.user()) {
        this.redirect('signIn');
    }
    else {
        this.next();
    }
};

Router.onBeforeAction(Router.ensureLoggedIn, {only: privateRoutes});

Router.onStop(function () {
    // register the previous route location in a session variable
    Session.set('itemsLimit',5);
    Session.set("lastRoute", Router.current().route.getName());
    if (this.route.getName() != 'add' && this.route.getName() != 'edit') {
        $('.updateSuccess,.addSuccess').remove();
    }

});
Router.onAfterAction(function () {
    if (Session.get('alert')) {
        $('.bodyContainer').prepend('<div class="alert addSuccess alert-success"><a class="close"' +
            ' data-dismiss="alert">×</a><span>' + arabicMessages[Session.get('alert')] + '</span></div>')
        Session.set('alert');
    }
});

Router.map(function () {
    this.route('admin', {
        path: '/admin', action: function () {
            if (registerHelpers.isAdmin())
                this.render('adminPage');
            else
                Router.go('home');
        }
    });
    this.route('profile', {
        path: '/profile/:id', waitOn: function () {
            return [Meteor.subscribe('specificUser', this.params.id),
                Meteor.subscribe('specificUserArticles', this.params.id)];
        }
    });
    this.route('resetPasswd', {
        path: '/profile/setting/resetpass', template: 'profile', action: function () {
            this.state.set('isForMe', true);
            Session.set('template', 'profileSetting');
            Session.set('settings', 'chgpasswd');
            this.render('profile');
        }
    });
    this.route('editPersonalInfo', {
        path: '/profile/setting/editInfo', template: 'profile', action: function () {
            this.state.set('isForMe', true);
            this.render('profile');
            Session.set('template', 'profileSetting');
            Session.set('settings', 'personalInformation')
        }
    });
    this.route('editProfileImg', {
        path: '/profile/setting/editProfileImg', template: 'profile', action: function () {
            this.state.set('isForMe', true);
            this.render('profile');
            Session.set('template', 'profileSetting');
            Session.set('settings', 'profileImg')
        }
    });
    this.route('profileSetting', {
        path: '/settings', template: 'profile', action: function () {
            this.state.set('isForMe', true);
            Session.set('template', 'profileSetting');
            Session.set('settings', 'profileImg');
            this.render('profile')

        }
    });
    this.route('me', {path: '/profile', template: 'profile'});
    this.route('home', {
        path: '/', template: 'articles', waitOn: function () {
            return Meteor.subscribe('articles', Session.get('itemsLimit'));
        }
    });
    this.route('search', {path: '/search'});
    this.route('read', {
        path: '/read', template: 'articles', waitOn: function () {
            if (Meteor.user()) {
                // I use Meteor.user ad descriped in this article http://www.manuel-schoebel.com/blog/meteorjs-iron-router-filters-before-and-after-hooks
                return Meteor.subscribe('readArticles', Session.get('itemsLimit'));
            }
        }
    });
    this.route('participation', {
        path: '/participation', template: 'articles', waitOn: function () {
            if (Meteor.user()) {
                return Meteor.subscribe('contribution', Session.get('itemsLimit'));
            }
        }
    });
    this.route('favorite', {
        path: '/favorite', template: 'articles', waitOn: function () {
            if (Meteor.user()) {
                return Meteor.subscribe('favorites', Session.get('itemsLimit'));
            }
        }
    });
    this.route('mine', {
        path: '/mine', template: 'articles', waitOn: function () {
            if (Meteor.user()) {
                Meteor.subscribe('mine', Session.get('itemsLimit'));
            }
        }
    });
    this.route('about', {path: '/about'});
    this.route('signIn', {path: '/signIn'});
    this.route('edit', {
        path: '/edit/:id', template: 'add', waitOn: function () {
            if (Meteor.user()) {
                return [Meteor.subscribe("Article", this.params.id),
                    Meteor.subscribe('usernames', this.params.id)
                ];
            }
        }
    });
    this.route('add', {path: '/add'});
    this.route('messages', {path: '/messages'});
    this.route('messageStream', {path: '/messageStream/:id'});
    this.route('global', {
        path: '/:id',
        action: function () {
            if (Articles.findOne(this.params.id)) {
                Session.set('urlType', 'article');
                this.render('article');
            }
            else {
                this.render('notFound');
            }
        },
        waitOn: function () {
            return [
                Meteor.subscribe("Article", this.params.id),
                Meteor.subscribe('comments', this.params.id)
            ];
        }
    });
    this.route("notFound", {
        path: "*",
        template: "notFound"
    });


});