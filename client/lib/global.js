registerHelpers = {
    currentId: function () {
        return Router.current().params.id;
    },
    userFullName: function (id) {

        var fullName = Meteor.users.findOne({_id: id}, {fields: {'fullName.name': 1}});
        return fullName['fullName.name'] ? fullName['fullName.name']
            : Meteor.users.findOne({_id: id}, {fields: {username: 1}}).username
    },
    dateFormated: function (date) {
        return moment(date).format('HH:mm:ss YYYY.MM.DD');
    },
    addDash: function (str) {
        return '@' + str;
    },
    userNameId: function (id) {
        return Meteor.users.findOne({username: id}, {fields: {_id: 1}})._id;
    },
    userUsername: function (id) {
        var user;
        if (id)
            user = Meteor.users.findOne({_id: id});
        else
            user = Meteor.users.findOne({_id: Meteor.userId()});
        return user ? user.username : 'notFound';
    }
};
Template.registerHelper('userNameId', registerHelpers.userNameId);
Template.registerHelper('addDash', registerHelpers.addDash);
Template.registerHelper('dateFormated', registerHelpers.dateFormated);
Template.registerHelper('userFullName', registerHelpers.userFullName);
Template.registerHelper('userUsername', registerHelpers.userUsername);
Template.registerHelper('favorite', function () {
    return Favorites.findOne({userId: Meteor.userId(), favorites: {$in: [this._id]}});

});
Template.registerHelper('owner', function () {
    return (Meteor.userId() == this.user)
});
Template.registerHelper('getProfilePic', function (id) {
    var pic;
    if (id)
        pic = profilePicture.findOne({owner: id});
    else
        pic = profilePicture.findOne({owner: Meteor.userId()});
    if (pic)
        return pic.url();
    else
        return ("/nopic.png")
});
Template.registerHelper("momentIt", function (toMoment) {
    return moment(toMoment).fromNow();
});
Template.registerHelper("currentId", registerHelpers.currentId);
Template.registerHelper("nl2br", function (str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>'; // Adjust comment to
    // avoid issue on
    // phpjs.org display

    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
});
Template.registerHelper("currentRouteName", function () {
    return (Router.current().route.getName())
});
Template.registerHelper("emailStatus", function () {
    if (Meteor.userId) {
        var user = Meteor.users.findOne(Meteor.userId());
        if (user) {
            if (!user.email)
                return true;
            return ( !user.fullName || !user.fullName.name || !user.mobile
            || !user.mobile.number || !user.birthday || !user.birthday.date || !user.gender || !user.gender.value)
        }
    }
    return false
});
Template.registerHelper("currentUser", function () {
    return Meteor.userId();
});
Template.registerHelper("unread", function (type) {
    if (Meteor.userId()) {
        var stream = Stream.findOne({userId: Meteor.userId()});
        if (stream) {
            var count = 0;
            if (type == 0) {
                _.each(stream.readingArticles, function (a) {
                    if (!a.seen)
                        count++;
                })
            }
            if (type == 1) {
                _.each(stream.contributingArticles, function (a) {
                    if (!a.seen)
                        count++;
                })
            }
            if (type == 2) {
                count = Messages.find({from: {$ne: Meteor.userId()}, reciver: 0}).count()
            }
            return count > 0 ? count : null
        }
    }
});
moment.locale('ar_sa');
T9n.setLanguage('ar');
Template.afQuickField.onRendered(function () {
    if (this.data.name == 'readingIds') {
        $('#readingDiv').find('.select2-choices').append('<li class="select2-search-choice pull-left">' +
            ' <div>' + arabicMessages.readingIdsPlaceHolder + '</div>  </li>');
        $('.select2-container').css('margin-top', ($('.control-label').outerHeight(true)))
    }
    if (this.data.name == 'contributingIds') {
        $('.select2-container').css('margin-top', ($('.control-label').outerHeight(true)));
        //$('.select2-input,.select2-default').css('font-family','Droid Arabic Kufi')
    }
    if (this.data.name == 'gender.value') {
        $('.radio').each(function () {
            $(this).prependTo(this.parentNode);
        });
    }

});

