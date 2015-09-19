/*

meteor.com
atmospherejs.com
getbootstrap.com
w3schools.com/bootstrap
fontawesome.io/icons

*/



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
	//this.route('edit', {path: '/edit/:id'});
	this.route('messages', {path:'/messages'});
	this.route('about', {path:'/about'});
});


