Articles = new Mongo.Collection("articles");

Articles.allow({
    insert: function () {
        return true;
    },
    remove: function () {
        return true;
    },
    update: function (userId, doc) {
        return (doc.user == userId)
    }
});

Articles.attachSchema(new SimpleSchema({
    title: {
        type: String,
        label: "العنوان",
        min: 3,
        max: 250
    },
    body: {
        type: String,
        label: "نص الموضوع",
        min: 3,
        max: 10000,
        autoform: {rows: 8}
    },
    read: {
        type: Number,
        autoValue: function () {
            return 0;
        }
    },
    user: {
        type: String,
        autoValue: function () {
            return Meteor.userId();
        }
    },
    createdAt: {
        type: Date,
        autoValue: function () {
            if (this.isInsert)
                return new Date();
            if (this.isUpdate)
                this.unset;
        }
    }
}))


/*
 Meteor.methods({
 'insertArticle': function(title, body, user){
 Articles.insert({
 title: title,
 body: body,
 user: user,
 createdAt: new Date()
 });
 }
 });
 */

//Articles.insert({ title: "Hello world!", body: "This is a text body..", user: "khalid", createdAt: new Date() });
