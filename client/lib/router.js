meController = RouteController.extend({
    data: function () {
        return {privateRoute: true};
    }

});
Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'spinner'
});
Router.onStop(function () {
    // register the previous route location in a session variable
    Session.set("lastRoute", Router.current().route.getName());
});
articleListController = RouteController.extend({
    template: 'test',
    increment: 5,
    limit: function() {
        return parseInt(this.params.articlesLimit) || this.increment;
    },
    findOptions: function() {
        return {sort: {createdAt: -1}, limit: this.limit()};
    },
    waitOn: function() {
        return Meteor.subscribe('publicArticles', this.findOptions());
    },
    articles: function() {
        return Articles.find({}, this.findOptions());
    },
    data: function() {
        var hasMore = this.articles().fetch().length === this.limit();
        var nextPath = this.route.path({articlesLimit: this.limit() + this.increment});
        return {
            articles: this.articles(),
            nextPath: hasMore ? nextPath : null
        };
    }
});
Router.plugin('dataNotFound', {notFoundTemplate: 'notFound'});
Router.map(function () {
    this.route('test',{path:'/test',controller:articleListController})
    this.route('sendMsg', {path: '/sendMsg/:id', template: 'profile'});
    this.route('profile', {
        path: '/profile/:id', onBeforeAction: function () {
            if (Meteor.users.findOne(Meteor.users.findOne(this.params.id))) {
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
        controller: meController,
        path: '/profile/setting/resetpass', template: 'profile', action: function () {
            this.state.set('isForMe', true);
            Session.set('template', 'profileSetting');
            Session.set('settings', 'chgpasswd');
            this.render('profile');
        }
    });
    this.route('editPersonalInfo', {
        controller: meController,
        path: '/profile/setting/editInfo', template: 'profile', action: function () {
            this.state.set('isForMe', true);
            this.render('profile');
            Session.set('template', 'profileSetting');
            Session.set('settings', 'personalInformation')
        }
    });
    this.route('editProfileImg', {
        controller: meController,
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
            else {
                this.render('notFound');
            }
        },
        waitOn: function () {
            Meteor.subscribe("Article", this.params.id);
        }
    });

});
