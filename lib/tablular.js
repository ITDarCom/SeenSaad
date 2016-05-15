/**
 * Created by omar on 22/11/15.
 */

TabularTables = {};

TabularTables.users = new Tabular.Table({
    name: 'users',
    collection: Meteor.users,
    pageLength: 20,
    bLengthChange: false,
    autoWidth: true,
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
            "searchable": false, title: arabicMessages.logMeWith,
            tmplContext: function (rowData) {
                return rowData
            }
        },
        //{data: "usernameUrl", title: arabicMessages.logMeWith, "searchable": false},
        {
            data: "articlesCounter", title: arabicMessages.articles,
            tmpl: Meteor.isClient && Template.articlesCounterTemplate
            , "searchable": false
        },
        {
            data: "commentCounter", title: arabicMessages.comments,
            tmpl: Meteor.isClient && Template.commentsCounterTemplate,
            "searchable": false
        },
        {data: "messageCounter", title: arabicMessages.headers.messages,"searchable": false}


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
    },
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
    counter: function () {
        return 0;
    }
});

