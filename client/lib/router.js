Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'spinner',
    notFoundTemplate: 'notFound'
});


var publicRoutes = ['signIn', 'signUp'];

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
    if (Meteor.loggingIn()){
        //console.log('logging in..')
        this.render('spinner')
    } else {
        //console.log('finished logging in process.')
        if (!Meteor.user()) {
            this.redirect('signIn');
        } else {
            this.next();
        }        
    }
};
Router.ensureNotLoggedIn = function () {
    if (Meteor.loggingIn()) {
        //console.log('logging in..')
        this.render('spinner')
    } else {
        //console.log('finished logging in process.')
        if (Meteor.user()) {
            this.redirect('home');
        } else {
            this.next();
        }
    }
}

Router.onBeforeAction(Router.ensureLoggedIn, {only: privateRoutes});
Router.onBeforeAction(Router.ensureNotLoggedIn, {only: publicRoutes});
Router.onBeforeAction(function(){

    if(Meteor.user() && Meteor.user().blocked == 1 ){
        this.render('blockWarningPage');
    }
    else{
        this.next();
    }
})

//formIsDirty https://gist.github.com/dferber90/acf560226fe76fe91534
Session.setDefault('formIsDirty', false)
const confirmationMessage = 'عفواً.. لديك تغييرات لم تقم بحفظها هل تريد فعلاً مغادرة الصفحة دون حفظها؟';

// whether the user should confirm the navigation or not,
// set to `true` before redirecting programmatically to skip confirmation
var skipConfirmationForNextTransition = false
Router.onStop(function () {
  // register dependencies immediately
  const formIsDirty = Session.equals('formIsDirty', true)
  // prevent duplicate execution of onStop route, because it would run again
  // after the redirect
  if (skipConfirmationForNextTransition) {
    skipConfirmationForNextTransition = false
    return
  }
  if (formIsDirty) {
    const shouldLeave = confirm(confirmationMessage)
    if (shouldLeave) {
      Session.set('formIsDirty', false)
      return
    }
    // obtain a non-reactive reference to the current route
      var currentRoute;
    Tracker.nonreactive(function () {
      currentRoute = Router.current()
    })
    skipConfirmationForNextTransition = true
    // "cancel" the transition by redirecting to the same route
    // this had to be used because Iron Router doesn't support cancling the
    // current transition. `url` contains the query params and hash.
    this.redirect(currentRoute.url)
    return
  }
})

// Bonus: confirm closing of browser window
window.addEventListener('beforeunload', function(event){
  if (Session.get('formIsDirty')) {
    // cross-browser requries returnValue to be set, as well as an actual
    // return value
      event.returnValue = arabicMessages.alertLeaveFromTouched // eslint-disable-line no-param-reassign
      return arabicMessages.alertLeaveFromTouched
  }
});



const increment = 5;

Router.onStop(function () {
    // register the previous route location in a session variable
    Session.set('itemsLimit',increment);
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

    this.route('me', {path: '/profile', template: 'profile', action : function(){
        this.state.set('isForMe', true);
        Session.set('template', 'profileSetting');
        Session.set('settings', 'profileImg');
        this.render('profile')
    }});
    ;

    this.route('profile', {path: '/profile/:id', action : function(){
        Session.set('template', 'articles');
        Session.set('settings', 'profileImg');
        this.render('profile')
    }});


    this.route('home', { path: '/', template: 'articles' });
    this.route('search', {path: '/search'});
    this.route('read', {path: '/read', template: 'articles' });
    this.route('participation', { path: '/participation', template: 'articles'});
    this.route('favorite', { path: '/favorite', template: 'articles' });
    this.route('mine', {path: '/mine', template: 'articles' });
    this.route('about', {path: '/about'});
    this.route('edit', {
        path: '/edit/:id', template: 'add', waitOn: function () {
            if (Meteor.user()) {
                return [Meteor.subscribe("Article", this.params.id),
                    Meteor.subscribe('usernames', this.params.id),
                    Meteor.subscribe('comments',this.params.id)
                ];
            }
        }
    });

    this.route('signIn', {
        path: '/signIn', action: function () {
            Session.set('state', "signIn");
            this.render('signIn')
        }
    })
    this.route('signUp', {
        path: '/signUp', action: function () {
            Session.set('state', "signUp");
            this.render('signIn')
        }
    });
    Router.route('/logOut', {
        name: 'logOut',
        onBeforeAction: function () {
            //we only redirect to 'home' after we fully logged out using 'onLogoutHook'
            AccountsTemplates.logout();
            this.render('spinner')
        }
    });
    this.route('deleted', {path: '/deleted', template: 'articles'})
    this.route('add', {path: '/add'});
    this.route('messages', {path: '/messages'});
    this.route('messageStream', {path: '/messageStream/:id'});
    this.route('global', {
        path: '/:id',
        action: function () {
            if (Articles.findOne(this.params.id)) { //how should this work?
                Session.set('urlType', 'article');
                this.render('article');
            }
            else {
                console.log('invoked');
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