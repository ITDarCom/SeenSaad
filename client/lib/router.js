Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'spinner'

});

Router.map(function () {
	this.route('articles', {
		path: '/', waitOn: function () {
			return Meteor.subscribe('publicArticles');
		}
	});
	this.route('search', {path:'/search'});
	this.route('read', {
		path: '/read', template: 'articles', waitOn: function () {
			if (Meteor.userId())
				return Meteor.subscribe('readingArticles');
			Router.go('login')
			return null
		}
	});
	this.route('participation', {
		path: '/participation', template: 'articles', waitOn: function () {
			if (Meteor.userId())
				return Meteor.subscribe('contributingArticles');
			Router.go('login')
			return null
		}
	});
	this.route('favorite', {
		path: '/favorite', template: 'articles', waitOn: function () {
			if (Meteor.userId())
				return Meteor.subscribe('favoritedArticles');
			Router.go('login')
			return null
		}
	});
	this.route('mine', {
		path: '/mine', template: 'articles', waitOn: function () {
			if (Meteor.userId())
				return Meteor.subscribe('myArticles');
			Router.go('login')
			return null
		}
	});
	this.route('add', {
		path: '/add',
		onBeforeAction: function () {
			if (!Meteor.userId())
				this.render('login')
			else
				this.render('add')
		}
	});
	this.route('edit', {path: '/edit/:id', template: 'add'});
	this.route('article', {
		path: '/article/:id', waitOn: function () {
			if (Meteor.userId())
				return Meteor.subscribe('Article', this.params.id)
			Router.go("login")
			return null
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
	this.route('about', {path:'/about'});
	this.route('/login')
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