Template.profile.helpers({
    active: function () {
        if (Router.current().route.getName() == 'me') {
            Session.set('settings', 'profileImg');
            return 'profileSetting';
        }
        return Session.get('template')
    },
    thisUser: function () {
        if (Router.current().params.id)
            return Meteor.users.findOne(Router.current().params.id);
        if (Router.current().params.username)
            return Meteor.users.findOne({username: Router.current().params.username});
        return Meteor.users.findOne({_id: Meteor.userId()})
    },
    notUserOrGuest: function () {
        var userId = Meteor.userId();
        var profileId = this._id;
        return !!Meteor.userId() && userId != profileId;
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

                        //Tracker.autorun(function (computation) {
                        //     var file = Images.findOne(fileObj._id);
                        //     if (file.isUploaded()) {
                        //        // $('#textEditor').summernote('insertImage', file.url());
                        //         console.log("uploaded"+file.url())
                        //         return
                        //         // Thumbnail is available. Do something.
                        //         computation.stop();
                        //     }
                        //
                        // });


                    }
                })
            };
            reader.readAsDataURL(file);
        });
    });
});
Template.chgpasswd.onRendered(function () {
    $('#at-btn').removeClass("btn-default").addClass("btn-primary");
    $('label').hide();
    $('.at-title').remove();
});

Template.personalInformation.events({
    'submit #user-profile-form': function (e) {
        e.preventDefault();
        var firstname = function () {
            var $firstName = $('#firstName');
            if ($firstName.val())
                if ($firstName.val() != $firstName.attr('currentValue'))
                    return $firstName.val();
            if (!$firstName.val() && $firstName.attr('currentValue'))
                return null
        };
        var familyName = function () {
            var $familyName = $('#familyName');
            if ($familyName.val())
                if ($familyName.val() != $familyName.attr('currentValue'))
                    return $familyName.val();
            if (!$familyName.val() && $familyName.attr('currentValue'))
                return null
        };
        var email = function () {
            var $email = $('#email');
            if ($email.val())
                if ($email.val() != $email.attr('currentValue')) {
                    if (SimpleSchema.RegEx.Email.test($email.val()))
                        return $email.val();
                    if (!$email.val() && $email.attr('currentValue'))
                        return null
                }
        };
        var mobile = function () {
            var $mobile = $('#mobile');
            if ($mobile.val()) {
                re = /^[0-9]{2,30}$/;
                if (re.test($mobile.val())) {
                    if ($mobile.val() != $mobile.attr('currentValue'))
                        return $mobile.val()
                }
                else {

                }

                if (!$mobile.val() && $mobile.attr('currentValue'))
                    return null
            }
        };
        var gender = function () {
            var $gender = $('[type=radio]:checked');
            //TODO check for similar usage because it's always true if ($gender)
            return $gender.val();
        };


        var user = {
            firstName: firstname(),
            familyName: familyName(),
            email: email(),
            mobile: mobile(),
            gender: gender()
        };
        var $alerter = $('#alerter');
        $alerter.show();
        var $email = $('#email');
        if (
            !SimpleSchema.RegEx.Email.test($email.val())
            ||
            Meteor.users.findOne({email: $email.val()})
        ) {
            $alerter
                .text('البريد الذي أدخلته غير مناسب')
                .removeClass('alert-success')
                .addClass('alert-danger')
                .append('<a class="close" data-dismiss="alert">×</a>');
            return
        }
        re = /^[0-9]{2,30}$/;
        if (!re.test($('#mobile').val())) {
            $alerter
                .text('رقم جوال خاطئ ')
                .removeClass('alert-success')
                .addClass('alert-danger')
                .append('<a class="close" data-dismiss="alert">×</a>');
            return
        }

        Meteor.call("updateProfile", user);
        $alerter
            .text('تم التعديل بنجاح')
            .removeClass('alert-danger')
            .addClass('alert-success')
            .append('<a class="close" data-dismiss="alert">×</a>');

    }
});
Template.personalInformation.onRendered(function () {
    if (Meteor.userId()) {
        $('.well').css('backgroundColor', $('input').css('backgroundColor'));
        var user = Meteor.users.findOne(Meteor.userId());
        $('[name=username]').val(user.username);
        if (user.fullName)
            $('[name="fullName.name"]').val(user.fullName.name);
        if (user.email)
            $('[name="email.address"]').val(user.email.address);
        if (user.mobile)
            $('[name="mobile.number"]').val(user.mobile.number);
        if (user.gender.value == "male") {
            $('[value="male"]').attr('checked', true);
        }
        if (user.gender.value == "female")
            $('[value="female"]').attr('checked', true);
        if (user.birthday) {
            $('[name="birthday.date"]').val(moment(user.birthday.date).format('YYYY-MM-DD'))
        }
        if (user.birthday.permission)
            $('[name="birthday.permission"]').attr('checked', true);
        if (user.fullName.permission)
            $('[name="fullName.permission"]').attr('checked', true);
        if (user.email.permission)
            $('[name="email.permission"]').attr('checked', true);
        if (user.gender.permission)
            $('[name="gender.permission"]').attr('checked', true);
        if (user.mobile.permission)
            $('[name="mobile.permission"]').attr('checked', true);
        $('[name=username]').parent().addClass("input-group");
        $('.input-group').append('<span class="input-group-addon">/SeenSaad.com</span><span class="help-block"></span>');
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
