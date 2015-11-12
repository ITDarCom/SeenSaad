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
                if (user.email.address && user.email.address != this.value && Meteor.users.findOne({'email.address': this.value})) {
                    return "emailUsed"
                }
            }
            else {
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
            trueLabel: 'ظاهر',
            falseLabel: 'مخفي',
            label: false
        }
    }
});
mobileSchema = new SimpleSchema({
    number: {
        type: Number,
        optional: true,
        regEx: /^[0-9]{2,30}$/,
    },
    verified: {
        type: Boolean,
        //defalutValue: false,
        optional: true,
        autoform: {omit: true}
    },
    permission: {
        type: Boolean,
        autoform: {
            type: 'boolean-radios',
            trueLabel: 'ظاهر',
            falseLabel: 'مخفي',
            label: false
        }
    }
});
personalInformationSchema = new SimpleSchema({
    username: {
        type: String,
        regEx: /^[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]$/,
        min: 3,
        max: 40,
        custom: function () {
            var user = Meteor.users.findOne(Meteor.userId());
            if (Meteor.users.findOne({username: this.value}) && user.username != this.value)
                return "usedUserName"
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
        optional: true,
    },
    'fullName.permission': {
        type: Boolean,
        autoform: {
            type: 'boolean-radios',
            trueLabel: 'ظاهر',
            falseLabel: 'مخفي',
            label: false
        }

    },
    email: {
        type: emailSchema,
        optional: true,
    },
    birthday: {type: Object, optional: true},
    'birthday.date': {
        type: Date,
        min: new Date(1980, 1, 1),
        max: new Date(new Date().getFullYear() - 10, 1, 1),
        optional: true,
    },
    'birthday.permission': {
        type: Boolean,
        autoform: {
            type: 'boolean-radios',
            trueLabel: 'ظاهر',
            falseLabel: 'مخفي',
            label: false
        },

    },
    mobile: {
        type: mobileSchema,
        optional: true,
    }, gender: {type: Object, optional: true},
    'gender.value': {
        type: String,
        allowedValues: ['male', 'female'],
        autoform: {
            type: 'select-radio-inline',
            options: [{value: 'male', label: 'ذكر'}, {value: 'female', label: 'أنثى'}]
        },
        optional: true,
    },
    'gender.permission': {
        type: Boolean,
        autoform: {
            type: 'boolean-radios',
            trueLabel: 'ظاهر',
            falseLabel: 'مخفي',
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
})
// Schemas end
var pwd = AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');
AccountsTemplates.addFields([
    {
        _id: "username",
        type: "text",
        displayName: "اسم المستخدم",
        placeholder: 'اسم المستخدم',
        required: true,
        minLength: 3,
        func: function (value) {
            re = /^[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]$/
            if (!re.test(value))
                return true
            if (value.indexOf("--") != -1)
                return true;
            return false
        },
        errStr: 'اسم المستخدم يجب أن لا يحتوي سوى أحرف انجليزية واشارة - بشرط أن لا تتكرر اثنتان متتاليتان',
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
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,
    enablePasswordChange: true,
    focusFirstInput: true,
    showLabels: false,
    showPlaceholders: true,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,
    homeRoutePath: '/profile',
    enablePasswordChange: true,
    showForgotPasswordLink: false,
    enablePasswordChange: true,
    confirmPassword: true,
    focusFirstInput: true,
    onSubmitHook: mySubmitFunc
});
