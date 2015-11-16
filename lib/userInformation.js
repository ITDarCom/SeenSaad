/**
 * Created by omar on 11/11/15.
 */
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
    permission: {
        type: Boolean,
        autoform: {
            type: 'boolean-radios',
            trueLabel: arabicMessages.informationShow,
            falseLabel: arabicMessages.informationHide,
            label: false
        }
    }
});
mobileSchema = new SimpleSchema({
    number: {
        type: Number,
        optional: true,
        regEx: /^[0-9]{2,30}$/
    },
    verified: {
        type: Boolean,
        optional: true,
        autoform: {omit: true}
    },
    permission: {
        type: Boolean,
        autoform: {
            type: 'boolean-radios',
            trueLabel: arabicMessages.informationShow,
            falseLabel: arabicMessages.informationHide,
            label: false
        }
    }
});
//noinspection SpellCheckingInspection
personalInformationSchema = new SimpleSchema({
    username: {
        type: String,
        regEx: /^[a-zA-Z][a-zA-Z0-9-]+[a-zA-Z0-9]$/,
        min: 4,
        max: 40,
        custom: function () {
            var user = Meteor.users.findOne(Meteor.userId());
            //noinspection JSUnresolvedVariable
            if (Meteor.users.findOne({username: this.value}) && user.username != this.value)
                return "usedUserName";
            //noinspection JSUnresolvedVariable
            if (this.value.indexOf("--") != -1)
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
    'fullName.permission': {
        type: Boolean,
        autoform: {
            type: 'boolean-radios',
            trueLabel: arabicMessages.informationShow,
            falseLabel: arabicMessages.informationHide,
            label: false
        }

    },
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
    'birthday.permission': {
        type: Boolean,
        autoform: {
            type: 'boolean-radios',
            trueLabel: arabicMessages.informationShow,
            falseLabel: arabicMessages.informationHide,
            label: false
        }

    },
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
    'gender.permission': {
        type: Boolean,
        autoform: {
            type: 'boolean-radios',
            trueLabel: arabicMessages.informationShow,
            falseLabel: arabicMessages.informationHide,
            label: false
        }
    },
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
AccountsTemplates.removeField('email');
//noinspection JSUnusedGlobalSymbols
AccountsTemplates.addFields([
    {
        _id: "username",
        type: "text",
        displayName: arabicMessages.userNameLabel,
        placeholder: arabicMessages.userNameLabel,
        required: true,
        minLength: 4,
        maxLength: 30,
        func: function (value) {
            var re = /^[a-zA-Z][a-zA-Z0-9-]+[a-zA-Z0-9]$/;
            if (!re.test(value) && value.indexOf("--") != -1) {
                return true;
            }
        },
        errStr: arabicMessages.userNameNonValid
    },
    pwd
]);
mySubmitFunc = function (error, state) {
    if (!error) {
        if (state === "signUp") {
            Stream.insert({userId: Meteor.userId()});
            Favorites.insert({userId: Meteor.userId()});
        }
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
    onSubmitHook: mySubmitFunc
});
