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
            return Meteor.subscribe('readingArticles', function onReady() {

            });
		}
	});
	this.route('participation', {
		path: '/participation', template: 'articles', waitOn: function () {
            return Meteor.subscribe('contributingArticles', function onReady() {
			});
		}
	});
	this.route('favorite', {
		path: '/favorite', template: 'articles', waitOn: function () {
            return Meteor.subscribe('favoritedArticles', function onReady() {
			});
		}
	});
	this.route('mine', {
		path: '/mine', template: 'articles', waitOn: function () {
            return Meteor.subscribe('myArticles', function onReady() {
			});
		}
	});
	this.route('add', {path:'/add'});
	this.route('edit', {
		path: '/edit/:id', template: 'add', waitOn: function () {
			return Meteor.subscribe('Article', this.params.id)
		}
	});
	this.route('article', {
		path: '/article/:id', waitOn: function () {
            return Meteor.subscribe('Article', this.params.id, function onReady() {
			})
		}
	});
	this.route('messages', {path:'/messages'});
	this.route('messageStream', {path: '/messageStream/:id'})
	this.route('about', {path:'/about'});
});



/*

Router.route('/', function () {
	this.render('homepage');
});

Router.route('/add', function () {
	this.render('add');
});
*/