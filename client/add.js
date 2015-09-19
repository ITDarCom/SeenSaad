AutoForm.hooks({
	onSuccess: function (insert, result) {
		Router.go("articles"); // notworking ????
	}
})