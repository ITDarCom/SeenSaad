Template.registerHelper('dateFormated', function (date) {
	return moment(date).format('HH:mm:ss YYYY.MM.DD');
});

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
Template.registerHelper("momentIt", function (toMoment) {
    return moment(toMoment).fromNow();
});
Template.registerHelper("nl2br", function (str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>'; // Adjust comment to avoid issue on phpjs.org display

    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
});
Template.registerHelper("currentRouteName", function () {
    return (Router.current().route.getName())
});
moment.locale('ar_sa');
T9n.setLanguage('ar');
;
SimpleSchema.messages({
  required: " [label] هو حقل مطلوب ولا بد من إدخاله",
  minString: "[label] يجب ألا يكون أقل من [min] حرفاً",
  maxString: "[label] يجب ألا يتجاوز [max] حرفاً"
});
AccountsTemplates.configure({
    confirmPassword: true,
    enablePasswordChange: true,
    focusFirstInput: true,
    showLabels: false,
    showPlaceholders: true,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,
    homeRoutePath: '/me',
    continuousValidation: true,
    negativeFeedback: true,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,
});
var pwd = AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');
AccountsTemplates.addFields([
    {
        _id: "username",
        type: "text",
        displayName: "اسم المستخدم",
        placeholder: 'اسم المستخدم',
        required: true,
        minLength: 3
    },
    {
        _id: 'email',
        type: 'email',
        required: true,
        displayName: "البريد الالكتروني",
        placeholder: "البريد الالكتروني",
        re: /.+@(.+){2,}\.(.+){2,}/,
        errStr: 'بريد خاطئ .. الرجاء تصحيحه',
    },
    {
        _id: "gender",
        type: "radio",
        displayName: "الجنس",
        select: [
            {
                text: "ذكر",
                value: "male",
            },
            {
                text: "أنثى",
                value: "female",
            },
        ],
    },
    {
        _id: 'phone',
        type: 'tel',
        placeholder: 'رقم الجوال'
    },
    pwd
]);


