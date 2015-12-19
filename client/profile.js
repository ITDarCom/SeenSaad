Template.profile.helpers({
    active: function () {
        if (Router.current().route.getName() == 'me') {
            Session.set('settings', 'profileImg');
            return 'profileSetting';
        }
        return Session.get('template')
    },
    thisUser: function () {
        if (registerHelpers.currentId()) {
            Meteor.users.findOne({_id: Router.current().params.id})
        }
        return Meteor.users.findOne({_id: Meteor.userId()});
    },
    notUserOrGuest: function () {
        //noinspection JSUnresolvedVariable
        return !(Router.current().route.getName() == 'me' || Router.current().state.keys.isForMe);

    },
    removeAlert: function () {
        Tracker.nonreactive(function () {
            $('.alert').remove();
        })
    }
});
Template.profile.events({
    'click #sendMessage': function () {
        if (Meteor.userId() === Router.current().params.id) {
            alert(arabicMessages.cannotSendToMe);
            return false;
        }
        Session.set('template', 'messageStream');
    }
});
Template.profileSetting.helpers({
    activeSetting: function () {
        return Session.get('settings');
    },
    active: function (id) {
        if (Session.get('settings') == id)
            return "active"
    },
    isMe: function () {
        //noinspection JSUnresolvedVariable
        return (Meteor.userId() == this._id);
    }
});
Template.profileImg.onRendered(function () {
    $(function () {
        $(".image-preview-input input:file").change(function () {
            // Create the preview image
            var file = this.files[0];
            var reader = new FileReader();
            reader.onload = function () {
                var fsFile = new FS.File(file);
                fsFile.owner = Meteor.userId();
                Meteor.call('deleteMyPic');
                $(".image-preview-filename").val(file.name);
                profilePicture.insert(fsFile, function (err) {
                    // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
                    if (err) {
                    }
                    else {
                    }
                })
            };
            reader.readAsDataURL(file);
        });
    });
});
Template.chgpasswd.onRendered(function () {
    $('#at-btn').removeClass("btn-default").addClass("btn-primary").text(arabicMessages.saveButton);
    $('label').hide();
    $('.at-title').remove();
});
//noinspection JSUnusedGlobalSymbols
Template.personalInformation.helpers({
    thisUser: function () {
        return Meteor.users.findOne(Meteor.userId())
    }
});
Template.personalInformation.onRendered(function () {

    if (Meteor.userId()) {
        $('.well').css('backgroundColor', $('input').css('backgroundColor'));
        $('[name=username]').parent().addClass("input-group");
        $('.input-group').append('<span class="seenSaadLabel input-group-addon">@/SeenSaad.com</span>' +
            '<span class="help-block"></span>');
        $('[name=username],[name="email.address"],[name="mobile.number"],[name="birthday"]')
            .addClass("text-left").css("direction", "ltr");
        $('.radio').css('display', 'inline-block')
        $('.radio').each(function () {
            $(this).prependTo(this.parentNode);
        });
    }
});
Template.autoForm.onRendered(function () {
    if (this.data.id == 'updatePersonalInformation') {
        var picker = new Pikaday({
            field: $('#birthday')[0], format: 'DD-MM-YYYY',
            minDate: new Date(1960, 1, 1), maxDate: new Date(new Date().getFullYear() - 10, 1, 1)
            , yearRange: [1960, new Date().getFullYear() - 10]
        });
    }
});
AutoForm.hooks({
    updatePersonalInformation: {
        onSuccess: function () {
            $('.alert').remove();
            $('.panel-body')
                .prepend('<div class="alert alert-success">  <a href="#" class="close" data-dismiss='
                + '"alert" aria-label="close">&times;</a>' + arabicMessages.profileEditSuccess + '</div>')
        },
        before: {
            'update': function (doc) {
                if (doc.$set.username != Meteor.users.findOne(Meteor.userId()).username) {
                    Meteor.call("setNewUserName", doc.$set.username)
                }
                doc.$set.username = undefined;
                return doc;
            }
        }

    }
});
Template.userInformation.helpers({
    thisUser: function () {
        return (Meteor.users.findOne(registerHelpers.currentId()))
    },
    properties: function () {
        //noinspection JSUnresolvedVariable
        var properties = [{value: '<h3>' + this.username + '</h3>'}];
        //noinspection JSUnresolvedVariable
        if (this.fullName && this.fullName.name) {
            //noinspection JSUnresolvedVariable
            properties.push({value: this.fullName.name});
        }
        if (this.birthday && this.birthday.date) {
            //noinspection JSUnresolvedVariable
            properties.push({
                value: ((this.gender.value == 'male') ? '<i class="fa fa-male"></i>&nbsp;'
                    : '<i class="fa fa-female"></i> &nbsp;') + (new Date().getFullYear() - this.birthday.date.getFullYear())
                + '&nbsp;' + arabicMessages.year
            });
            properties.push({
                value: moment(this.birthday.date).format('YYYY-MM-DD')
                , label: arabicMessages.birthdayLabel
            });
        }
        //noinspection JSUnresolvedVariable
        if (this.email && this.email.address) {
            //noinspection JSUnresolvedVariable
            properties.push({value: this.email.address});
        }
        //noinspection JSUnresolvedVariable
        if (this.mobile && this.mobile.number) { //noinspection JSUnresolvedVariable
            properties.push({value: this.mobile.number});
        }
        //noinspection JSUnresolvedVariable
        return properties;
    }
});