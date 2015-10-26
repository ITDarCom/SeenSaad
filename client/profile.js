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
    }
});
Template.profile.onRendered(function () {
    Session.set('template', 'articles')
})
Template.profileSetting.helpers({
    activeSetting: function () {
        return Session.get('settings')
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