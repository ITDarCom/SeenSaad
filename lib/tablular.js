/**
 * Created by omar on 22/11/15.
 */

TabularTables = {};

TabularTables.users = new Tabular.Table({
    name: "users",
    collection: Meteor.users,
    pageLength:20,
    bLengthChange: false,
    "autoWidth": true,
    "orderMulti": false,
    "ordering":true,
    columnDefs: [{
        "searchable": true,
        "orderable": false,
        "type": "num",
        "sType": "numeric",
        "targets": [1, 3, 4, 5]
    }],
    columns: [
        {data: "counter", title: '#',orderable:false},
        {data: "username", title: arabicMessages.userNameLabel},
        {data: "usernameUrl", title: arabicMessages.logMeWith,orderable: false},
        {data: "articlesCounter", title: arabicMessages.articles},
        {data: "commentCounter", title: arabicMessages.comments},
        {data: "messageCounter", title: arabicMessages.headers.messages}



    ],
    "fnDrawCallback": function ( oSettings ) {
        /* Need to redo the counters if filtered or sorted */
        if ( oSettings.bSorted || oSettings.bFiltered )
        {
            for ( var i=0, iLen=oSettings.aiDisplay.length ; i<iLen ; i++ )
            {
                $('td:eq(0)', oSettings.aoData[ oSettings.aiDisplay[i] ].nTr ).html( i+1 );
            }
        }
    },
    "language" : arabicMessages.tabular
});

Meteor.users.helpers({
    articlesCounter: function () {
        return Articles.find({user:this._id}).count();
    },
    commentCounter: function () {
        return Articles.find({comments:{$elemMatch:{commenter:this._id}}}).count();
    },
    messageCounter: function () {
        return Messages.find({$or:[{from:this._id},{to:this._id}]}).count()
    },
    usernameUrl: function () {
        return '<button  class="userIdLogIn btn btn-primary" userId = '+this._id+'>'+arabicMessages.signIn +'</button>'
    },
    counter : function () {
        return 0 ;
    }
});

