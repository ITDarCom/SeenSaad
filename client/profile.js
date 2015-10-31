Template.profile.helpers({
    active: function () {
        return Session.get('template')
    },
    thisUser: function () {
        if (Router.current().params.id)
            return Meteor.users.findOne(Router.current().params.id)
        var user = Meteor.users.findOne({_id: Meteor.userId()});
        return user;
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
        $('.active').removeClass('active')
        $(event.target).parent().addClass('active')

    },
    'click #profileArticles': function () {
        Session.set('template', 'articles');
        $('.active').removeClass('active')
        $(event.target).parent().addClass('active')
    }
});
Template.profile.onRendered(function () {

    if (_.contains(['profileSetting', 'editProfileImg', 'editPresonalInfo', 'resetPasswd'], Router.current().route.getName()))
        $('#profileSetting').addClass('active')
    else
        $('#profileArticles').addClass('active')
    //Session.set('template', 'articles')
})
Template.profileSetting.helpers({
    activeSetting: function () {
        return Session.get('settings')
    },
    active: function (id) {
        if (Session.get('settings') == id)
            return "active"
    },
    isMe: function () {
        return (Meteor.userId() == this._id)
    }

})
Template.profileSetting.events({
    'click .profileSettingBtn': function () {
        Session.set('settings', $(event.target).attr('id'))
    }
})
Template.profileImg.events({})


Template.profileImg.onRendered(function () {
    $(function () {
        $(".image-preview-input input:file").change(function () {
            // Create the preview image
            var file = this.files[0];
            var reader = new FileReader();
            reader.onload = function (e) {
                fsFile = new FS.File(file);
                fsFile.owner = Meteor.userId();
                Meteor.call('deleteMyPic');
                $(".image-preview-filename").val(file.name);
                profilePicture.insert(fsFile, function (err, fileObj) {
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
            }
            reader.readAsDataURL(file);
        });
    });
})
Template.chgpasswd.onRendered(function () {
    $('#at-btn').removeClass("btn-default").addClass("btn-primary");
    $('label').hide()
})

Template.personalInformation.events({
    'click .edit': function () {

        $(event.target).parent().parent().find('span').hide();
        $(event.target).parent().parent().append('<input type="text"  class="newValue">&nbsp')
        $(event.target).parent().parent().append("<button class='btn btn-xs btn-success accept'><span class='fa fa-check'></span></button>&nbsp")
        $(event.target).parent().parent().append("<button class='btn btn-xs btn-danger cancel'><span class='fa fa-times'></span></button>&nbsp")
        $(event.target).hide();
        var newValue = $(event.target).parent().find('.newValue').text();


    },
    'click .cancel': function () {
        $('.accept').remove();
        $('.cancel').remove();
        $('.newValue').remove();
        $('small').show()
        $('span').show()
    },
    'click .accept': function () {
        var newValue = $(event.target).parent().parent().find('.newValue').val();
        var field = $(event.target).closest('li').attr('field');
        switch (field) {
            case 'profile.mobile':
                if (newValue.match(/^(\+\d{1,3}[- ]?)?\d{10}$/))
                    Meteor.call('setPersonalInformation', field, newValue);
                else alert("رقم الهاتف غير مناسب وغير مناسب لصيغة رقم الهاتف")
                break;
            case 'profile.emails':
                re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/igm
                if (re.test(newValue))
                    Meteor.call('setPersonalInformation', field, newValue);
                else
                    alert("ايميل خاطئ")
                break;
            default :
                Meteor.call('setPersonalInformation', field, newValue);
        }


        $('.accept').remove();
        $('.cancel').remove();
        $('.newValue').remove();
        $('small').show()
        $('span').show()
    },
    'submit #user-profile-form': function (e) {
        e.preventDefault();
        firstname = function () {
            if ($('#firstName').val())
                if ($('#firstName').val() != $('#firstName').attr('currentValue'))
                    return $('#firstName').val()
            if (!$('#firstName').val() && $('#firstName').attr('currentValue'))
                return null
        }
        familyName = function () {
            if ($('#familyName').val())
                if ($('#familyName').val() != $('#familyName').attr('currentValue'))
                    return $('#familyName').val()
            if (!$('#familyName').val() && $('#familyName').attr('currentValue'))
                return null
        }
        email = function () {
            if ($('#email').val())
                if ($('#email').val() != $('#email').attr('currentValue')) {
                    if (SimpleSchema.RegEx.Email.test($('#email').val()))
                        return $('#email').val()
                    if (!$('#email').val() && $('#email').attr('currentValue'))
                        return null
                }
        }
        mobile = function () {
            if ($('#mobile').val()) {
                re = /^[0-9]{2,30}$/
                if (re.test($('#mobile').val())) {
                    if ($('#mobile').val() != $('#mobile').attr('currentValue'))
                        return $('#mobile').val()
                }
                else {

                }

                if (!$('#mobile').val() && $('#mobile').attr('currentValue'))
                    return null
            }
        }
        gender = function () {
            if ($('[type=radio]:checked'))
                return $('[type=radio]:checked').val();
        }


        var user = {
            firstName: firstname(),
            familyName: familyName(),
            email: email(),
            mobile: mobile(),
            gender: gender()
        }
        $('#alerter').show()
        if (!SimpleSchema.RegEx.Email.test($('#email').val()) || Meteor.users.findOne({email: $('#email').val()})) {
            $('#alerter').text('البريد الذي أدخلته غير مناسب').removeClass('alert-success').addClass('alert-danger')
            $('#alerter').append('<a class="close" data-dismiss="alert">×</a>')
            return
        }
        re = /^[0-9]{2,30}$/
        if (!re.test($('#mobile').val())) {
            $('#alerter').text('رقم جوال خاطئ ').removeClass('alert-success').addClass('alert-danger')
            $('#alerter').append('<a class="close" data-dismiss="alert">×</a>')
            return
        }

        Meteor.call("updateProfile", user)
        $('#alerter').text('تم التعديل بنجاح').removeClass('alert-danger').addClass('alert-success')
        $('#alerter').append('<a class="close" data-dismiss="alert">×</a>')

    }
})
Template.personalInformation.helpers({
    current: function () {
        return Meteor.userId();
    }
})
Template.personalInformation.onRendered(function () {
    if (Meteor.userId()) {
        user = Meteor.users.findOne(Meteor.userId())
        if (user.firstName)
            $('#firstName').val(user.firstName).attr('currentValue', user.firstName)
        if (user.familyName)
            $('#familyName').val(user.familyName).attr('currentValue', user.familyName)
        if (user.email)
            $('#email').val(user.email).attr('currentValue', user.email)
        if (user.mobile)
            $('#mobile').val(user.mobile).attr('currentValue', user.mobile)
        if (user.gender == "male")
            $('[value="male"]').attr('checked', true)
        if (user.gender == "female")
            $('value=[female]').attr('checked', true)
    }
})
