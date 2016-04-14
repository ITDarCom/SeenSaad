FlowRouter.route('/about', {
    action: function () {
        BlazeLayout.render('layout', {main: 'about'});
    },
    name: 'about'
});

FlowRouter.route('/add', {
    action: function () {
        BlazeLayout.render('layout', {main: 'add'});
    },
    name: 'add'
});

FlowRouter.route('/edit/:_id', {
    name: 'edit', action: function () {
        if(Meteor.userId())
        {
            BlazeLayout.render('layout', {main: 'add'});
        }
    }
});


FlowRouter.route('/messages', {
    action: function () {
        BlazeLayout.render('layout', {main: 'messages'});
    },
    name: 'messages'
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

FlowRouter.triggers.enter(function (context,redirect) {

    if(Meteor.userId())
    {
       FlowRouter.go(context.route.name);
    }
    else{
        FlowRouter.go('/signIn');
    }
}, {only: privateRoutes});




//BlazeLayout.onStop(function () {
//    // register the previous route location in a session variable
//    Session.set('itemsLimit', 5);
//    Session.set("lastRoute", FlowRouter.getRouteName());
//    if (this.getRouteName() != 'add' && this.getRouteName() != 'edit') {
//        $('.updateSuccess,.addSuccess').remove();
//    }
//});
//BlazeLayout.triggersEnter(function () {
//    if (Session.get('alert')) {
//        $('.bodyContainer').prepend('<div class="alert addSuccess alert-success"><a class="close"' +
//            ' data-dismiss="alert">×</a><span>' + arabicMessages[Session.get('alert')] + '</span></div>')
//        Session.set('alert');
//    }
//});

    FlowRouter.route('/admin', {
        name: 'admin',
        action: function () {
            if (registerHelpers.isAdmin())
                BlazeLayout.render('layout', {main: "adminPage"});
            else
                FlowRouter.go('home');
        }
    });
    FlowRouter.route('/profile/:_id', {
        name: 'profile',
        action: function () {
            if (Meteor.userId()) {
                if (Meteor.users.findOne(this.params._id)) {
                    Session.set('template', 'articles');
                    BlazeLayout.render('layout', {main: "profile"});
                }
                else {
                    BlazeLayout.render('layout', {main: "notFound"});
                }
            }
            else {
                BlazeLayout.render('layout', {main: "signIn"});
            }
        }, subscriptions: function () {
            return [Meteor.subscribe('specificUser', this.params._id),
                Meteor.subscribe('specificUserArticles', this.params._id)];
        }
    });
    FlowRouter.route('/profile/setting/resetpass', {
        name: 'resetPasswd', template: 'profile', action: function () {
            this.state.set('isForMe', true);
            Session.set('template', 'profileSetting');
            Session.set('settings', 'chgpasswd');
            BlazeLayout.render('layout', {main: "profile"});
        }
    });
    FlowRouter.route('/profile/setting/editInfo', {
        name: 'editPersonalInfo', template: 'profile', action: function () {
            this.state.set('isForMe', true);
            BlazeLayout.render('layout', {prof: "profile"});
            Session.set('template', 'profileSetting');
            Session.set('settings', 'personalInformation');
        }
    });
    FlowRouter.route('/profile/setting/editProfileImg', {
        name: 'editProfileImg', template: 'profile', action: function () {
            this.state.set('isForMe', true);
            BlazeLayout.render('layout', {main: "profile"});
            Session.set('template', 'profileSetting');
            Session.set('settings', 'profileImg');
        }
    });
    FlowRouter.route('/settings', {
        name: 'profileSetting', template: 'profile', action: function () {
            this.state.set('isForMe', true);
            Session.set('template', 'profileSetting');
            Session.set('settings', 'profileImg');
            BlazeLayout.render('layout', {main: "profile"});
        }
    });
    FlowRouter.route('/profile', {name: 'me', template: 'profile'});
    FlowRouter.route('/', {
        name: 'home', template: 'articles', subscriptions: function () {
            return Meteor.subscribe('articles', Session.get('itemsLimit'));
        }
    });
    FlowRouter.route('/search', {name: 'search'});
    FlowRouter.route('/read', {
        name: 'read', template: 'articles', subscriptions: function () {
            return Meteor.subscribe('readArticles', Session.get('itemsLimit'));
        }
    });
    FlowRouter.route('/participation', {
        name: 'participation', template: 'articles', subscriptions: function () {
            return Meteor.subscribe('contribution', Session.get('itemsLimit'));
        }
    });
    FlowRouter.route('/favorite', {
        name: 'favorite', template: 'articles', subscriptions: function () {
            return Meteor.subscribe('favorites', Session.get('itemsLimit'));
        }
    });
    FlowRouter.route('/mine', {
        name: 'mine',action: function () {
            BlazeLayout.render('layout', {main: "articles"});
        }, subscriptions: function () {
            Meteor.subscribe('mine', Session.get('itemsLimit'));
        }
    });
    FlowRouter.route('/about', {name: 'about'});
    FlowRouter.route('/signIn', {name: 'signIn',action: function () {
        if(!Meteor.userId()){
            BlazeLayout.render('layout', {main: "signIn"});
        }
    }});
    FlowRouter.route('/messageStream/:_id', {name: 'messageStream'});
    FlowRouter.route('/:_id', {
        name: 'global', data: function () {
            return Articles.findOne(this.params._id);
        },
        action: function () {
            if (Articles.findOne(this.params._id)) {
                Session.set('urlType', 'article');
                BlazeLayout.render('layout', {main: "article"});
            }
            else {
                BlazeLayout.render('layout', {main: "notFound"});
            }
        },
        subscriptions: function () {
            return [
                Meteor.subscribe("Article", this.params._id),
                Meteor.subscribe('comments', this.params._id)];
        }
    });
    //FlowRouter.route("*", {
    //    name: "notFound",
    //    template: "notFound"
    //});
