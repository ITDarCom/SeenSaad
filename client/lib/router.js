Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'spinner'
});
Router.onStop(function () {
    // register the previous route location in a session variable
    Session.set("lastRoute", Router.current().route.getName());
});
Router.plugin('dataNotFound', {notFoundTemplate: 'notFound'});
Router.map(function () {
    this.route('sendMsg', {path: '/sendMsg/:id', template: 'profile'})
    this.route('profile', {
        path: '/profile/:id', action: function () {
            Session.set('template', 'articles')
            this.render('profile')
        }, waitOn: function () {
            return Meteor.subscribe('specificUser', this.params.id)
        }
    });
    this.route('resetPasswd', {
        path: '/profile/setting/resetpass', template: 'profile', action: function () {
            this.render('profile')
            Session.set('template', 'profileSetting');
            Session.set('settings', 'chgpasswd');

        }
    });
    this.route('editPersonalInfo', {
        pasth: '/profile/setting/editInfo', template: 'profile', action: function () {
            this.render('profile')
            Session.set('template', 'profileSetting');
            Session.set('settings', 'personalInformation')
        }
    })
    this.route('editProfileImg', {
        path: '/profile/setting/editProfileImg', template: 'profile', action: function () {
            this.render('profile')
            Session.set('template', 'profileSetting');
            Session.set('settings', 'profileImg')
        }
    })
    this.route('profileSetting', {
        path: '/settings', template: 'profile', action: function () {
            Session.set('template', 'profileSetting')
            Session.set('settings', 'profileImg')
            this.render('profile')

        }
    })
    this.route('me', {path: '/profile', template: 'profile'});
    this.route('home', {path: '/', template: 'articles'});
    this.route('articles', {path: '/articles'});
    this.route('search', {path: '/search'});
    this.route('read', {path: '/read', template: 'articles'});
    this.route('participation', {path: '/participation', template: 'articles'});
    this.route('favorite', {path: '/favorite', template: 'articles'});
    this.route('mine', {path: '/mine', template: 'articles'});
    this.route('about', {path: '/about'});
    this.route('signIn', {path: '/signIn'});
    this.route('edit', {path: '/edit/:id', template: 'add'});
    this.route('add', {
        path: '/add', onBeforeAction: function () {
            if (!Meteor.userId())
                this.render('signIn')
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
            if (!Meteor.userId())
                this.render('signIn');
            else
                this.render('messages')
        }
    });
    this.route('messageStream', {path: '/messageStream/:id'});
    this.route('global', {
        path: '/:id', onBeforeAction: function () {
            Session.set('urlType', 'article');
                Meteor.subscribe("Article", currId)
                this.render('article');
        }
    });

});
