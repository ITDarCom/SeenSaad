//this file contains a global functions used in HTML ans js files
//functions used globally in the project
// we define registerHelpers object to access global helpers in js files cause register helpers used only in Html
registerHelpers = {
    currentId: function () { //return the id from the route (url)
        return Router.current().params.id;
    },
    userFullName: function (id) { //return full name for user with id parameter
        if (id) {
            var fullName = Meteor.users.findOne({_id: id}, {fields: {'fullName.name': 1}});
            return fullName['fullName.name'] ? fullName['fullName.name']
                : Meteor.users.findOne({_id: id}, {fields: {username: 1}}).username;
        }
    },
    dateFormated: function (date) { // reformat ISO Date as : HH:mm:ss YYYY.MM.DD
        if (date) {
            return moment(date).format('HH:mm:ss YYYY.MM.DD');
        }
    },
    userNameId: function (name) { //find the id of username parameter
        if (name) {
            return Meteor.users.findOne({username: name}, {fields: {_id: 1}})._id;
        }
    },
    userUsername: function (id) { //return username for id parameter
        var user;
        if (id)
            user = Meteor.users.findOne({_id: id});
        else
            user = Meteor.users.findOne({_id: Meteor.userId()});
        return user ? user.username : 'notFound';
    },
    getArabicMsg: function (id) { //getting arabic text from the object (arabicMessages in arabic Text files)
        if (id) {
            if (id.indexOf("headers.") != -1)
                return arabicMessages.headers[id.substr(8, id.length)]
            return arabicMessages[id];
        }
    },
    isAdmin: function () {
        if (Meteor.userId()) {
            var Admins = ['SeenSaad'];
            return (_.contains(Admins, Meteor.users.findOne(Meteor.userId()).username));
        }
    },
    owner: function () { //return true if the current user is the owner of this article
        if (Meteor.userId()) {
            return (Meteor.userId() == this.user)
        }
    },
    favorite: function () { //return favorite if this article is favorited by the user
        if (Meteor.userId()) {
            return Favorites.findOne({userId: Meteor.userId(), favorites: {$in: [this._id]}});
        }

    },
    getProfilePic: function (id) {
        var pic;
        if (id)
            pic = profilePicture.findOne({owner: id});
        else
            pic = profilePicture.findOne({owner: Meteor.userId()});
        if (pic)
            return pic.url();
        else
            return ("/nopic.png")
    },
    momentIt: function (toMoment) {
        return moment(toMoment).fromNow();
    },
    nl2br: function (str, is_xhtml) {
        var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>';
        // Adjust comment to
        // avoid issue on
        // phpjs.org display

        return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
    },
    currentRouteName: function () {
        return (Router.current().route.getName())
    },
    profileInCompleted: function () {
        if (Meteor.userId) {
            var user = Meteor.users.findOne(Meteor.userId());
            if (user) {
                if (!user.email)
                    return true;
                return ( !user.fullName || !user.fullName.name || !user.mobile
                || !user.mobile.number || !user.birthday || !user.birthday.date
                || !user.gender || !user.gender.value)
            }
        }
        return false
    },
    unread: function (type) {
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
                    count = Messages.find({
                        from: {$ne: Meteor.userId()}, to: Meteor.userId()
                        , reciver: 0
                    }).count()
                }
                return count > 0 ? count : null
            }
        }
    }

};
Template.registerHelper('userNameId', registerHelpers.userNameId);
Template.registerHelper('dateFormated', registerHelpers.dateFormated);
Template.registerHelper('userFullName', registerHelpers.userFullName);
Template.registerHelper('userUsername', registerHelpers.userUsername);
Template.registerHelper('getArabicMsg', registerHelpers.getArabicMsg);
Template.registerHelper('isAdmin', registerHelpers.isAdmin);
Template.registerHelper('favorite', registerHelpers.favorite);
Template.registerHelper('owner', registerHelpers.owner);
Template.registerHelper('getProfilePic', registerHelpers.getProfilePic);
Template.registerHelper("momentIt", registerHelpers.momentIt);
Template.registerHelper("currentId", registerHelpers.currentId);
Template.registerHelper("nl2br", registerHelpers.nl2br);
Template.registerHelper("currentRouteName", registerHelpers.currentRouteName);
Template.registerHelper("profileInCompleted", registerHelpers.profileInCompleted);
Template.registerHelper("unread", registerHelpers.unread);
//====================================//
moment.locale('ar_sa'); // arabic language for momentJs
T9n.setLanguage('ar');
//$.fn.select2.defaults.set('language', 'ar');
Template.afQuickField.onRendered(function () {
    if (this.data.name == 'readingIds') {

        $('#readingIds').select2({
            initSelection: function (element, callback) {
                var data = [];
                $(element.val().split(",")).each(function () {
                    data.push({id: this, text: Meteor.users.findOne(this.toString()).username});
                });
                //data.push({
                //    id: '1',
                //    text:arabicMessages.readingIdsPlaceHolder
                //});
                callback(data);
            },
            ajax: {

                dataType: "json",
                data: function (params) {
                    return {
                        q: params
                    };
                },
                results: function (data, params) {
                    var results = [];
                    _.each(data.results, function (result) {
                        if (result._id != Meteor.userId())
                            results.push({
                                id: result._id,
                                text: result.username
                            });
                    });

                    return {
                        results: results
                    };
                },
                transport: function (params, success, failure) {
                    Meteor.call('usernamesSearch', params.data.q, function (err, results) {
                        if (err) {
                            params.failure(err);
                            return;
                        }
                        params.success(results);
                    });
                }
            },
            minimumInputLength: 1,
            //tags: true,
            multiple: true,
            language: 'ar',
            //tokenSeparators: [',', ' '],
            minimumInputLength: 2,
            minimumResultsForSearch: 10,
        });

        //$('#readingIds').tagsinput()
        $('#s2id_readingIds').find('.select2-choices').append('<li class="select2-search-choice ' +
            'pull-right select2PlaceHolder">' +
            ' <div>' + arabicMessages.readingIdsPlaceHolder + '</div>  </li>');
        $('.select2-container').css('margin-top', ($('.control-label').outerHeight(true)))
    }
    if (this.data.name == 'contributingIds') {
        $('#contributingIds').select2({
            initSelection: function (element, callback) {
                var data = [];
                $(element.val().split(",")).each(function () {
                    data.push({id: this, text: Meteor.users.findOne(this.toString()).username});
                });

                if (data != []) {
                    callback(data);
                }
            },
            ajax: {

                dataType: "json",
                data: function (params) {
                    return {
                        q: params
                    };
                }

                ,
                results: function (data, params) {
                    var results = [];
                    _.each(data.results, function (result) {
                        if (result._id != Meteor.userId())
                            results.push({
                                id: result._id,
                                text: result.username
                            });
                    });

                    return {
                        results: results
                    };

                }
                ,
                transport: function (params, success, failure) {
                    Meteor.call('usernamesSearch', params.data.q, function (err, results) {
                        if (err) {
                            params.failure(err);
                            return;
                        }

                        params.success(results);
                    });
                }

            }
            ,
            minimumInputLength: 1,

            //tags: true,
            multiple: true,
            language: 'ar',
            //tokenSeparators: [',', ' '],
            minimumInputLength: 2,
            minimumResultsForSearch: 10,


        });

        $('.select2-container').css('margin-top', ($('.control-label').outerHeight(true)));
    }
    if (this.data.name == 'gender.value') {
        $('.radio').each(function () {
            $(this).prependTo(this.parentNode); // reverse radio button hidden and show
        });
    }

});
$.fn.select2.locales['ar'] = {
    formatMatches: function (matches) {
        if (matches === 1) {
            return "يوجد نتيجة واحدة فقط .. اضفط enter  لاختيارها ";
        }
        return matches +
            " نتيجة تم العثور عليها, استخدم الأسهم فوق وتحت لاختيار طلبك.";
    },
    formatNoMatches: function () {
        return "لا يوجد اسم يوافق هذا البحث";
    },
    formatAjaxError: function (jqXHR, textStatus, errorThrown) {
        return "فشل التحميل";
    },
    formatInputTooShort: function (input, min) {
        var n = min - input.length;
        return "اكتب اسم المستخدم "
    },
    formatInputTooLong: function (input, max) {
        var n = input.length - max;
        return "Please delete " + n + " character" + (n == 1 ? "" : "s");
    },
    formatSelectionTooBig: function (limit) {
        return "You can only select " + limit + " item" + (limit == 1 ? "" : "s");
    },
    formatLoadMore: function (pageNumber) {
        return "تحميل المزيد";
    },
    formatSearching: function () {
        return "يبحث…";
    },
};

$.extend($.fn.select2.defaults, $.fn.select2.locales['ar']);