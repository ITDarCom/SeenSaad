Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'spinner',
    notFoundTemplate: 'notFound'
});
Router.onStop(function () {
    // register the previous route location in a session variable
    Session.set("lastRoute", Router.current().route.getName());
    if (this.route.getName() != 'add' && this.route.getName() != 'edit') {
        $('.updateSuccess,.addSuccess').remove();
    }
});
Router.map(function () {
    this.route('admin', {
        path: '/admin', action: function () {
            if (registerHelpers.isAdmin())
                this.render('adminPage');
            else
                Router.go('home');
        },
        waitOn: function () {
            Meteor.subscribe('message_counts')
        }
    });
    this.route('profile', {
        path: '/profile/:id', onBeforeAction: function () {
            if (Meteor.users.findOne(this.params.id)) {
                Session.set('template', 'articles');
                this.render('profile')
            }
            else {
                this.render('notFound')
            }
        }, waitOn: function () {
            return Meteor.subscribe('specificUser', this.params.id)
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
            Meteor.subscribe('articles', Session.get('itemsLimit'));
        }
    });
    this.route('search', {path: '/search'});
    this.route('read', {
        path: '/read', template: 'articles', waitOn: function () {
            Meteor.subscribe('readArticles', Session.get('itemsLimit'));
        }
    });
    this.route('participation', {
        path: '/participation', template: 'articles', waitOn: function () {
            Meteor.subscribe('contribution', Session.get('itemsLimit'));
        }
    });
    this.route('favorite', {
        path: '/favorite', template: 'articles', waitOn: function () {
            Meteor.subscribe('favorites', Session.get('itemsLimit'));
        }
    });
    this.route('mine', {
        path: '/mine', template: 'articles', waitOn: function () {
            Meteor.subscribe('mine', Session.get('itemsLimit'));
        }
    });
    this.route('about', {path: '/about'});
    this.route('signIn', {path: '/signIn'});
    this.route('edit', {path: '/edit/:id', template: 'add'});
    this.route('add', {
        path: '/add', onBeforeAction: function () {
            if (!Meteor.userId()) {
                this.render('signIn');
            }
            else
                this.render('add')
        }
    });
    this.route('article', {
        path: '/article/:id', waitOn: function () {
            return Meteor.subscribe("Article", Router.current().params.id)
        }
    });
    this.route('messages', {
        path: '/messages', onBeforeAction: function () {
            if (!Meteor.userId()) {
                this.render('signIn');
            }
            else
                this.render('messages')
        }
    });
    this.route('messageStream', {path: '/messageStream/:id'});
    this.route('global', {
        path: '/:id', onBeforeAction: function () {
            if (Articles.findOne(this.params.id)) {
                Session.set('urlType', 'article');
                this.render('article');
            }
        },
        waitOn: function () {
            Meteor.subscribe("Article", this.params.id);
            Meteor.subscribe('comments', this.params.id);
        }
    });

});
