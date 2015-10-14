Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'spinner'

});
Router.map(function () {
	this.route('articles', {path: '/'});
	this.route('search', {path:'/search'});
	this.route('read', {path: '/read', template: 'articles'});
	this.route('participation', {path: '/participation', template: 'articles'});
	this.route('favorite', {path: '/favorite', template: 'articles'});
	this.route('mine', {path: '/mine', template: 'articles'});
	this.route('about', {path: '/about'});
	this.route('/login');
	this.route('edit', {path: '/edit/:id', template: 'add'});
	this.route('add', {
		path: '/add', onBeforeAction: function () {
			if (!Meteor.userId())
				this.render('login')
			else
				this.render('add')
		}
	});
	this.route('article', {
		path: '/article/:id', waitOn: function () {
			Meteor.call("readCounter", Router.current().params.id)
			return Meteor.subscribe("Article", Router.current().params.id)
		}
	});
	this.route('messages', {
		path: '/messages', onBeforeAction: function () {
			if (!Meteor.userId())
				this.render('login')
			else
				this.render('messages')
		}
	});
	this.route('messageStream', {path: '/messageStream/:id'})
});
Meteor.loginWithPassword = _.wrap(Meteor.loginWithPassword, function (login) {
	// Store the original arguments
	var args = _.toArray(arguments).slice(1),
		user = args[0],
		pass = args[1]
	// Create a new callback function
	var newCallback = function () {
		Router.go("articles")
	}
	// Now call the original login function with
	// the original user, pass plus the new callback
	login(user, pass, newCallback);
})
Accounts.createUser = _.wrap(Accounts.createUser, function (createUser) {

	// Store the original arguments
	var args = _.toArray(arguments).slice(1),
		user = args[0],
		origCallback = args[1];

	// Create a new callback function
	// Could also be defined elsewhere outside of this wrapped function
	// This is called on the client
	var newCallback = function (err) {
		if (err) {
			console.error(err);
		} else {
			Stream.insert({userId: Meteor.userId()})
			Favorites.insert({userId: Meteor.userId()})
		}
	};

	// Now call the original create user function with
	// the original user object plus the new callback
	createUser(user, newCallback);

});