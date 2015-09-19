Template.articles.helpers({
	articles: function () {
		return Articles.find({},{sort: {createdAt: -1}});
	},
	owner: function () {
		return (Meteor.userId() == this.user)
	}
});

Template.articles.events({
	'click .remove': function () { // not working ????
		bootbox.confirm({
			size: 'small',
			buttons: {
				cancel: {
					label: "إلغاء",
					className: "btn-default",
				},
				confirm: {
					label: "موافق",
					className: "btn-danger",
					callback: function () {
						return true;
					}
				}
			},
			message: "هل تريد حذف المقال فعلاً",
			callback: function (result) {
				if (result) {
					Meteor.call("removeArticle", this._id);
					$('#notify').html(
						'<div class="alert alert-success">' +
							'<a class="close" data-dismiss="alert">×</a>' +
							'<span>"تم حذف المقال بنجاح"</span>' +
						'</div>'
					);
				}
				else return
			}
		})
	},

	'click .favorite': function () {
		if (Meteor.userId())
			Meteor.call('favoriteIt', this._id)
	},

	'click .edit': function () {
		Router.go('#', {id: this._id})
	}
});

