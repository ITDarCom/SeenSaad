Template.registerHelper('dateFormated', function (date) {
	return moment(date).format('HH:mm:ss YYYY.MM.DD');
});

Template.registerHelper('userUsername', function (id) {
    var user = Meteor.users.findOne({_id: id});
    return user ? user.username : 'notFound';
});
Template.registerHelper('isFavorited', function () {
    var favorited = Favorites.findOne({userId: Meteor.userId(), favorites: {$in: [this._id]}});
    return favorited
});

SimpleSchema.messages({
  required: " [label] هو حقل مطلوب ولا بد من إدخاله",
  minString: "[label] يجب ألا يكون أقل من [min] حرفاً",
  maxString: "[label] يجب ألا يتجاوز [max] حرفاً"
})