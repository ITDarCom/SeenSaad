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
        if (Router.current().route.getName() == 'me' || Router.current().state.keys.isForMe)
            return false;
        var userId = Meteor.userId();
        var profileId = Router.current().params.id;
        return Meteor.userId() && userId != profileId;
    }
});
Template.profile.events({
    'click #sendMessage': function () {
        Session.set('template', 'messageStream');
    },
    'click #profileSetting': function () {
        Session.set('template', 'profileSetting');
        $('.active').removeClass('active');
        $(event.target).parent().addClass('active');
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
        return (Meteor.userId() == this._id);
    },
});
Template.profileSetting.events({
    'click .profileSettingBtn': function () {
        Session.set('settings', $(event.target).attr('id'));
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
    $('#at-btn').removeClass("btn-default").addClass("btn-primary").text("حفظ");
    $('label').hide();
    $('.at-title').remove();
});
Template.personalInformation.helpers({
    thisUser: function () {
        return Meteor.users.findOne(Meteor.userId())
    }
});
Template.personalInformation.onRendered(function () {
    if (Meteor.userId()) {
        $('.well').css('backgroundColor', $('input').css('backgroundColor'));
        $('[name=username]').parent().addClass("input-group");
        $('.input-group').append('<span class="input-group-addon">/SeenSaad.com</span><span class="help-block"></span>');
        $('[name=username],[name="email.address"],[name="mobile.number"],[name="birthday"]')
            .addClass("text-left").css("direction", "ltr")
        $('.radio').css('display', 'inline-block')
    }
});
AutoForm.hooks({
    updatePersonalInformation: {
        onSuccess: function () {
            $('.alert').remove();
            $('.panel-body')
                .prepend('<div class="alert alert-success">  <a href="#" class="close" data-dismiss='
                + '"alert" aria-label="close">&times;</a> تم تعديل إعدادات حسابك بنجاح </div>')
        }

    }
});
Template.userInformation.helpers({
    thisUser: function () {
        return (Meteor.users.findOne(registerHelpers.currentId()))
    },
    properties: function () {
        var properties = [{value: this.username, label: 'اسم المستخدم: '}];
        if (this.fullName && this.fullName.name)
            properties.push({value: this.fullName.name, label: 'الاسم الكامل: '})
        if (this.email && this.email.address)
            properties.push({value: this.email.address, label: 'البريد الالكتروني: '})
        if (this.mobile && this.mobile.number)
            properties.push({value: this.mobile.number, label: 'رقم الجوال: '})
        if (this.birthday && this.birthday.date)
            properties.push({value: moment(this.birthday.date).format('YYYY-MM-DD'), label: 'تاريخ الميلاد'})
        if (this.gender && this.gender.value)
            properties.push({value: this.gender.value == 'male' ? 'ذكر' : 'أنثى', label: 'الجنس: '})
        return properties;
    }
})