/**
 * Created by omar on 22/11/15.
 */

TabularTables = {};

TabularTables.users = new Tabular.Table({
    name: "users",
    collection: Meteor.users,
    columns: [
        {data: "usernameUrl()", title: "اسم المستخدم"},
        {data: "articlesCounter()", title: "عدد المواضيع "},
        {data: "commentCounter", title: "عدد الردود"},
        {data: "messageCounter", title: "عدد الرسائل"}
    ]
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
        return '<a href="#" class="userIdLogIn" userId = '+this._id+'>'+ Meteor.users.findOne(this._id).username +'</a>'
    }
});

