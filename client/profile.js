Template.profile.helpers({
    active: function () {
        if (Router.current().route.getName() == 'me') {
            Session.set('settings', 'profileImg');
            return 'profileSetting';
        }
        return Session.get('template')
    },
    thisUser: function () {
        id = Router.current().params.id
        if (id) {
            Meteor.users.findOne({username: id.substr(1, id.length)})
        }
        return Meteor.users.findOne({_id: Meteor.userId()});
    },
    notUserOrGuest: function () {
        var userId = Meteor.userId();
        var profileId = this._id;
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
    }
});
AutoForm.hooks({
    updatePersonalInformation: {
        onSuccess: function () {
            $('.alert').remove();
            $('.panel-body')
                .prepend('<div class="alert alert-success">  <a href="#" class="close" data-dismiss='
                + '"alert" aria-label="close">&times;</a> تم تعديل إعدادات حسابك بنجاح </div>')
        },
    }
});
