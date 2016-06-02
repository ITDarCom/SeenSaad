/**
 * Created by omar on 22/11/15.
 */

TabularTables = {};

TabularTables.users = new Tabular.Table({
    name: 'users',
    throttleRefresh: 5000,
    "cache": true,
    collection: Meteor.users,
    pageLength: 20,
    "scrollX": true,
    "ordering": false,
    bLengthChange: false,
    responsive: true,
    autoWidth: false,
    extraFields: ['blocked', 'fullName', 'email'],
    createdRow: function( row, data, dataIndex ) {
        if (data.blocked){
            row.className += "warning"            
        }
    },
    columns: [
        {data: "counter", title: '#', "searchable": false},
        {data: "username", title: arabicMessages.userNameLabel,bSearchable:true},
        {
            data: 'administrative',
            tmpl: Meteor.isClient && Template.userAdministrativeActions, 
            "searchable": false, title: '',
            tmplContext: function (rowData) {
                return rowData
            },

        },
        //{data: "usernameUrl", title: arabicMessages.logMeWith, "searchable": false},
        {
            data: "articlesCounter()", title: '<i class="fa fa-file-word-o" aria-hidden="true"></i>',
            tmpl: Meteor.isClient && Template.articlesCounterTemplate
            , "searchable": false,
        },
        {
            data: "commentCounter", title: '<i class="fa fa-comments" aria-hidden="true"></i>',
            tmpl: Meteor.isClient && Template.commentsCounterTemplate,
            "searchable": false
        },
        {data: "messageCounter", title: '<i class="fa fa-envelope" aria-hidden="true"></i>  ', "searchable": false},
        {
            data: "getlastSignIn()", title: arabicMessages.lastSignIn,
            tmpl: Meteor.isClient && Template.lastSignInTemplate,
            "searchable": false
        }
        ,
        {
            data: "getRegisterdAt()", title: arabicMessages.registeredAt,
            tmpl: Meteor.isClient && Template.registerdAtTemplate,
            "searchable": false
        }


    ],
    "fnDrawCallback": function (oSettings) {
        /* Need to redo the counters if filtered or sorted */
        if (oSettings.bSorted || oSettings.bFiltered) {
            for (var i = 0, iLen = oSettings.aiDisplay.length; i < iLen; i++) {
                $('td:eq(0)', oSettings.aoData[oSettings.aiDisplay[i]].nTr).html(i + 1);
            }
        }
    },
    "language": arabicMessages.tabular
});
;


Meteor.users.helpers({
    administrative: function(){
        return Meteor.users.findOne(this._id, { blocked:1})
    }
    ,
    articlesCounter: function () {
        var id = this._id;
        Meteor.call('getArticlesCounter', this._id, function (err, result) {
            if (!err) {
                var htmlId = '#articleCounter' + id;
                $(htmlId).text(result);

            }
        })
    },
    commentCounter: function () {
        var id = this._id;
        Meteor.call('getCommentsCounter', this._id, function (err, result) {
            if (!err) {
                var htmlId = '#commentsCounter' + id;
                $(htmlId).text(result);

            }
        })
    },
    messageCounter: function () {
        return Messages.find({$or: [{from: this._id}, {to: this._id}]}).count()
    },
    getlastSignIn: function () {
        var id = this._id;
        Meteor.call('getlastSignIn', this._id, function (err, result) {
            if (!err) {
                var htmlId = '#lastSignIn' + id;
                $(htmlId).text(result);

            }
        })

    },
    getRegisterdAt: function () {
        var id = this._id;
        Meteor.call('getRegisterdAt', this._id, function (err, result) {
            if (!err) {
                var htmlId = '#registerdAt' + id;
                $(htmlId).text(result);
            }
        })
    }

});

