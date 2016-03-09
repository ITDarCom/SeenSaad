/**
 * Created by omar on 22/11/15.
 */

TabularTables = {};

TabularTables.users = new Tabular.Table({
    name: 'users',
    collection: Meteor.users,
    //pageLength: 20,
    //bLengthChange: false,
    //autoWidth: true,
    columns: [
    //    //{data: "counter", title: '#', "searchable": false},
        {data: "username", title: arabicMessages.userNameLabel,bSearchable:true},
    //    //{data: "usernameUrl", title: arabicMessages.logMeWith, "searchable": false},
    //    //{
    //    //    data: "articlesCounter", title: arabicMessages.articles,
    //    //    tmpl: Meteor.isClient && Template.articlesCounterTemplate
    //    //    , "searchable": false
    //    //},
    //    //{
    //    //    data: "commentCounter", title: arabicMessages.comments,
    //    //    tmpl: Meteor.isClient && Template.commentsCounterTemplate,
    //    //    "searchable": false
    //    //},
    //    //{data: "messageCounter", title: arabicMessages.headers.messages,"searchable": false}
    //
    //
    ],
    //"fnDrawCallback": function (oSettings) {
    //    /* Need to redo the counters if filtered or sorted */
    //    if (oSettings.bSorted || oSettings.bFiltered) {
    //        for (var i = 0, iLen = oSettings.aiDisplay.length; i < iLen; i++) {
    //            $('td:eq(0)', oSettings.aoData[oSettings.aiDisplay[i]].nTr).html(i + 1);
    //        }
    //    }
    //},
    "language": arabicMessages.tabular
});
TabularTables.articles = new Tabular.Table({
    name: 'articles',
    collection: Articles,
    //pageLength: 20,
    //bLengthChange: false,
    //autoWidth: true,
    "sAjaxDataProp":"",
    columns: [
        //    //{data: "counter", title: '#', "searchable": false},
        {data: "title", title: arabicMessages.userNameLabel},
        //    //{data: "usernameUrl", title: arabicMessages.logMeWith, "searchable": false},
        //    //{
        //    //    data: "articlesCounter", title: arabicMessages.articles,
        //    //    tmpl: Meteor.isClient && Template.articlesCounterTemplate
        //    //    , "searchable": false
        //    //},
        //    //{
        //    //    data: "commentCounter", title: arabicMessages.comments,
        //    //    tmpl: Meteor.isClient && Template.commentsCounterTemplate,
        //    //    "searchable": false
        //    //},
        //    //{data: "messageCounter", title: arabicMessages.headers.messages,"searchable": false}
        //
        //
    ],
    //"fnDrawCallback": function (oSettings) {
    //    /* Need to redo the counters if filtered or sorted */
    //    if (oSettings.bSorted || oSettings.bFiltered) {
    //        for (var i = 0, iLen = oSettings.aiDisplay.length; i < iLen; i++) {
    //            $('td:eq(0)', oSettings.aoData[oSettings.aiDisplay[i]].nTr).html(i + 1);
    //        }
    //    }
    //},
    //"language": arabicMessages.tabular
});


//Meteor.users.helpers({
//    articlesCounter: function () {
//        var id = this._id;
//        Meteor.call('getArticlesCounter', this._id, function (err, result) {
//            if (!err) {
//                var htmlId = '#articleCounter' + id;
//                $(htmlId).text(result);
//
//            }
//        })
//    },
//    commentCounter: function () {
//        var id = this._id;
//        Meteor.call('getCommentsCounter', this._id, function (err, result) {
//            if (!err) {
//                var htmlId = '#commentsCounter' + id;
//                $(htmlId).text(result);
//
//            }
//        })
//    },
//    messageCounter: function () {
//        return Messages.find({$or: [{from: this._id}, {to: this._id}]}).count()
//    },
//    usernameUrl: function () {
//        return '<button  class="userIdLogIn btn btn-primary btn-xs" userId = ' + this._id + '>' +
//            '<i class="fa fa-sign-in userIdLogIn"userId = ' + this._id + '></i></button> &nbsp;' +
//            '<button  class="deleteUser btn btn-danger btn-xs" userId = ' + this._id + '>' +
//            '<i class="fa fa-trash deleteUser" userId = ' + this._id + '></i></button>'
//    },
//    counter: function () {
//        return 0;
//    }
//});

