Template.registerHelper('dateFormated', function (date) {
    return moment(date).format('HH:mm:ss YYYY.MM.DD');
});
Template.registerHelper('userFullName', function (id) {
    var name = (UI._globalHelpers['firstName'](id) + ' ')
    if (UI._globalHelpers['familyName'](id))
        return name + UI._globalHelpers['familyName'](id)
    return name
})
Template.registerHelper('userUsername', function (id) {
    if (id)
        var user = Meteor.users.findOne({_id: id});
    else
        var user = Meteor.users.findOne({_id: Meteor.userId()})
    return user ? user.username : 'notFound';
});
Template.registerHelper('favorite', function () {
    var favorited = Favorites.findOne({userId: Meteor.userId(), favorites: {$in: [this._id]}});
    return favorited
});
Template.registerHelper('owner', function (articeleId) {
    return (Meteor.userId() == this.user)
});
Template.registerHelper('getProfilePic', function (id) {
    if (id)
        pic = profilePicture.findOne({owner: id})
    else
        pic = profilePicture.findOne({owner: Meteor.userId()})
    if (pic)
        return pic.url()
    else
        return ("/nopic.png")
});
Template.registerHelper("momentIt", function (toMoment) {
    return moment(toMoment).fromNow();
});
Template.registerHelper("currentId", function (toMoment) {
    return Router.current().params.id;
});
Template.registerHelper("nl2br", function (str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>'; // Adjust comment to avoid issue on phpjs.org display

    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
});
Template.registerHelper("currentRouteName", function () {
    return (Router.current().route.getName())
});
Template.registerHelper("firstName", function (id) {
    if (id)
        return (Meteor.users.findOne(id).firstName) || Meteor.users.findOne(id).username
    return (Meteor.users.findOne(Meteor.userId()).firstName) || "لم يتم إدخاله"

});
Template.registerHelper("familyName", function (id) {
    if (id)
        return (Meteor.users.findOne(id).familyName)
    return (Meteor.users.findOne(Meteor.userId()).familyName) || "لم يتم إدخاله"
});
Template.registerHelper("email", function () {
    if (Meteor.users.findOne(Meteor.userId()).emails)
        return (Meteor.users.findOne(Meteor.userId()).emails[0].address) || "لم يتم إدخاله"
    return "لم يتم إدخاله"
});
Template.registerHelper("mobile", function () {
    return (Meteor.users.findOne(Meteor.userId()).mobile) || "لم يتم إدخاله"
});
Template.registerHelper("emailStatus", function () {
    if (Meteor.userId) {
        user = Meteor.users.findOne(Meteor.userId());
        if (!user.emails)
            return true
        return ( !user.firstName || !user.familyName || !user.mobile)
    }
    return false
})
Template.registerHelper("'currentUser", function () {
    return Meteor.userId();
})
moment.locale('ar_sa');
T9n.setLanguage('ar');
SimpleSchema.messages({
    required: " [label] هو حقل مطلوب ولا بد من إدخاله",
    minString: "[label] يجب ألا يكون أقل من [min] حرفاً",
    maxString: "[label] يجب ألا يتجاوز [max] حرفاً"
});

