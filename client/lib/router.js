Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function () {
	this.route('articles', {path:'/'});
	this.route('search', {path:'/search'});
	this.route('read', {path:'/read'});
	this.route('participation', {path:'/participation'});
	this.route('favorite', {path:'/favorite'});
	this.route('mine', {path:'/mine'});
	this.route('add', {path:'/add'});
	this.route('edit', {path: '/edit/:id', template: 'add'});
	this.route('article', {path: '/article/:id', template: 'article'});
	this.route('messages', {path:'/messages'});
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