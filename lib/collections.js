Articles = new Mongo.Collection("articles");

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


//Articles.insert({ title: "Hello world!", body: "This is a text body..", user: "khalid", createdAt: new Date() });
