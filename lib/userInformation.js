/**
 * Created by omar on 11/11/15.
 */
permission = {
    type: Boolean,
    optional: true,
    autoform: {
        type: 'boolean-radios',
        falseLabel: arabicMessages.informationHide,
        trueLabel: arabicMessages.informationShow,
        label: false,
        defaultValue: true
    }
};
// Schemas
emailSchema = new SimpleSchema({
    address: {
        type: String,
        optional: true,
        regEx: SimpleSchema.RegEx.Email,
        custom: function () {
            var user = Meteor.users.findOne({_id: Meteor.userId()});
            if (user.email) {
                //noinspection JSUnresolvedVariable
                if (user.email.address && user.email.address != this.value && Meteor.users.findOne(
                        {'email.address': this.value})) {
                    return "emailUsed"
                }
            }
            else {
                //noinspection JSUnresolvedVariable
                if (this.value && Meteor.users.findOne({'email.address': this.value})) {
                    return "emailUsed"
                }
            }

        }
    },
    verified: {
        type: Boolean,
        optional: true,
        autoform: {omit: true}
    },
    permission: permission
});
mobileSchema = new SimpleSchema({
    number: {
        type: String,
        optional: true,
        regEx: /^[0-9]{7,30}$/
    },
    verified: {
        type: Boolean,
        optional: true,
        autoform: {omit: true}
    },
    permission: permission
});
//noinspection SpellCheckingInspection
personalInformationSchema = new SimpleSchema({
    username: {
        type: String,
        regEx: usernameRegex,
        custom: function () {
            var user = Meteor.users.findOne(Meteor.userId());
            //noinspection JSUnresolvedVariable
            if (Meteor.users.findOne({username: this.value}) && user.username != this.value)
                return "usedUserName";
            //noinspection JSUnresolvedVariable
            if (this.value.indexOf("--") != -1 || this.value.length < 4 || this.value.length > 40)
                return "wrongUserName";
        }
    },
    fullName: {
        type: Object,
        optional: true
    },
    'fullName.name': {
        type: String,
        min: 3,
        max: 30,
        optional: true
    },
    'fullName.permission': permission,
    email: {
        type: emailSchema,
        optional: true
    },
    birthday: {type: Object, optional: true},
    'birthday.date': {
        type: Date,
        min: new Date(1960, 1, 1),
        max: new Date(new Date().getFullYear() - 10, 1, 1),
        optional: true
    },
    'birthday.permission': permission,
    mobile: {
        type: mobileSchema,
        optional: true
    }, gender: {type: Object, optional: true},
    'gender.value': {
        type: String,
        allowedValues: ['male', 'female'],
        autoform: {
            type: 'select-radio-inline',
            options: [{value: 'male', label: arabicMessages.maleLabel},
                {value: 'female', label: arabicMessages.femaleLabel}]
        },
        optional: true
    },
    'gender.permission': permission,
    services: {
        type: Object,
        optional: true,
        blackbox: true
    }
});
Meteor.users.attachSchema(personalInformationSchema);
Meteor.users.allow({
    insert: function (userId) {
        return !userId
    },
    update: function (userId, doc) {
        return (userId == doc._id);
    }
});
// Schemas end
var pwd = AccountsTemplates.removeField('password');
//AccountsTemplates.removeField('email');
//noinspection JSUnusedGlobalSymbols
AccountsTemplates.addFields([
    {
        _id: "username",
        type: "text",
        displayName: arabicMessages.userNameLabel,
        placeholder: arabicMessages.userNameLabel,
        required: true,
        func: function (value) {
            if ((!usernameRegex.test(value) && value.indexOf("--") != -1) || value < 4 || value > 30) {
                return true;
            }
        },
        errStr: arabicMessages.userNameNonValid
    },
    pwd
]);
mySubmitFunc = function (error, state) {
    if (!error) {
        if (state == 'signUp') {
            if (!Stream.findOne({userId: Meteor.userId()})) {
                Stream.insert({userId: Meteor.userId()});
            }
            if (!Favorites.findOne({userId: Meteor.userId()})) {
                Favorites.insert({userId: Meteor.userId()});
            }
        }
    }
};
myLogoutFunc = function () {
    if (Meteor.isClient) {
        Router.go('home');
    }
};
AccountsTemplates.configure({
    continuousValidation: false,
    negativeFeedback: false,
    showLabels: false,
    showPlaceholders: true,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,
    homeRoutePath: '/profile',
    showForgotPasswordLink: false,
    enablePasswordChange: true,
    confirmPassword: true,
    focusFirstInput: true,
    onSubmitHook: mySubmitFunc,
    onLogoutHook: myLogoutFunc
});