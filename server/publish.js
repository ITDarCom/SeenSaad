var articleStreamFields = {
    title: 1,
    username: 1,
    createdAt: 1,
    user: 1,
    read: 1,
    readingPermissions: 1,
    contributingPermissions: 1,
    commentsCounter: 1,
    generalDate: 1
};
Meteor._isBlocked = function (userId) {
    return this.userId && Meteor.users.findOne(this.userId).blocked
}
Meteor.publish('articles', function (limit) {
    //Meteor._sleepForMs(2000);
    if (Meteor._isBlocked) {
        this.ready();
    }


        if (!this.userId) {
            return Articles.find({
                $or: [{readingPermissions: '0', deleted: null}, {
                    contributingPermissions: '0',
                    deleted: null
                }]
            }, {
                fields: articleStreamFields,
                sort: {generalDate: -1},
                limit: limit || 5
            })
        }
        else {
            var custom = Stream.findOne({userId: this.userId});

            if (!custom) custom = {}

            var contributingArticles = 
                custom.contributingArticles ? 
                _.pluck(custom.contributingArticles, 'id') : [];
            var readingArticles = 
                custom.readingArticles ? 
                _.pluck(custom.readingArticles, 'id') : [];
            var privateArticles = 
                _.union(readingArticles, contributingArticles);

            return Articles.find({
                    $or: [{readingPermissions: '0', deleted: null}, {
                        contributingPermissions: '0',
                        deleted: null
                    }, {_id: {$in: privateArticles ? privateArticles : []}, deleted: null}, {
                        user: this.userId,
                        deleted: null
                    }]
                },
                {
                    fields: articleStreamFields,
                    sort: {generalDate: -1},
                    limit: limit || 5
                });
            
        }
    }
);

Meteor.publish('favorites', function (limit) {
    //Meteor._sleepForMs(2000);
    if (Meteor._isBlocked) {
        this.ready();
    }
    if (this.userId) {
        var ids = Favorites.findOne({userId: this.userId});
        if (ids) {
            return Articles.find({_id: {$in: ids.favorites ? ids.favorites : []}, deleted: null}, {
                fields: articleStreamFields,
                limit: limit || 5
            });
        }
    }
    return false
});

Meteor.publish('readArticles', function (limit) {
    if (Meteor._isBlocked) {
        this.ready();
    }
    //Meteor._sleepForMs(2000);
    if (this.userId) {
        var custom = Stream.findOne({userId: this.userId});
        if (custom) {
            var readingArticles = custom.readingArticles ? _.pluck(custom.readingArticles, 'id') : [];
            return Articles.find({_id: {$in: readingArticles}, deleted: null}, {
                fields: articleStreamFields,
                limit: limit || 5,
            });
        }
    }
});

Meteor.publish('contribution', function (limit) {
    if (Meteor._isBlocked) {
        this.ready();
    }
    //Meteor._sleepForMs(2000);
    if (this.userId) {
        var custom = Stream.findOne({userId: this.userId});
        if (custom) {
            var contributingArticles = custom.contributingArticles ? _.pluck(custom.contributingArticles, 'id') : [];
            return Articles.find({_id: {$in: contributingArticles}, deleted: null}, {
                fields: articleStreamFields,
                limit: limit || 5,
                sort: {createdAt: -1}
            });
        }
    }
});

Meteor.publish('mine', function (limit) {
    if (Meteor._isBlocked) {
        this.ready();
    }
    //Meteor._sleepForMs(2000);
    if (this.userId) {
        return Articles.find({user: this.userId, deleted: null}, {limit: limit || 5, sort: {createdAt: -1}})
    }
});

Meteor.publish(null, function () {
    if (Meteor._isBlocked) {
        this.ready();
    }
    if (this.userId) {
        return Favorites.find({userId: this.userId}) ? Favorites.find({userId: this.userId}) : null;
    }
});

Meteor.publish("Article", function (articleId) {
    if (Meteor._isBlocked) {
        this.ready();
    }
    var article = Articles.findOne({_id: articleId});
    if (article.user === this.userId) {
        Meteor.call("readCounter", articleId);
        return Articles.find({_id: articleId});
    }
    if (!article.deleted) {

        if (article.contributingPermissions === '0' || article.readingPermissions === '0') {
            Meteor.call("readCounter", articleId, this.userId);
            return Articles.find({_id: articleId});
        }
        else {
            if (article.contributingIds) {
                if (!_.isEmpty(_.where(article.contributingIds, this.userId))) {
                    Meteor.call("readCounter", articleId, this.userId);
                    return Articles.find({_id: articleId})
                }
            }
            if (article.readingPermissions == '0') {
                Meteor.call("seenChange", articleId);
                Meteor.call("readCounter", articleId, this.userId);
                return Articles.find({_id: articleId})
            }
            else if (article.readingIds) {
                if (!_.isEmpty(_.where(article.readingIds, this.userId))) {
                    if (Articles.find({_id: articleId})) {
                        Meteor.call("readCounter", articleId, this.userId);
                        return Articles.find({_id: articleId})
                    }
                }
            }
        }
    }
    else{
        this.ready();
    }
});
Meteor.publish(null, function () {
    if (Meteor._isBlocked) {
        this.ready();
    }
    return Meteor.users.find({}, {fields: {username: 1}});
//TODO is maybe a big problem >> to send all usernames to non-user >> even to user
});
Meteor.publish(null, function () {
    if (Meteor._isBlocked) {
        this.ready();
    }
    if (this.userId) {
        return Meteor.users.find({_id: this.userId})
    }
});
Meteor.publish('specificUser', function (userId) {
    if (Meteor._isBlocked) {
        this.ready();
    }
    var user = Meteor.users.findOne(userId);
    var projections = {};
    for (var property in user) {
        if (user.hasOwnProperty(property)) {
            {
                if (user[property].permission) {
                    projections[property] = 1;
                }
            }
        }
    }
    return Meteor.users.find({_id: userId}, {fields: projections})
});
Meteor.publish('specificUserArticles', function (userId, limit) {
    if (Meteor._isBlocked) {
        this.ready();
    }

    //Meteor._sleepForMs(2000);

    if (this.userId == userId) {
        return Articles.find({user: this.userId,deleted:null})
    }
    var custom = Stream.findOne({userId: userId});
    var contributingIds = [];
    var readingIds = [];
    if (custom) {
        contributingIds = custom.contributingArticles;
        readingIds = custom.readingArticles;
    }
    return Articles.find({
        $and: [{user: userId,deleted:null}, {
            $or: [{contributingPermissions: '0',deleted:null}, {readingPermissions: '0',deleted:null}
                , {_id: {$in: contributingIds},deleted:null}, {_id: {$in: readingIds},deleted:null}]
        }]
    }, { 
        limit: limit || 5,
        sort: {createdAt: -1}
    })
});
Meteor.publish(null, function () {
    if (Meteor._isBlocked) {
        this.ready();
    }
    if (this.userId) {
        if (_.contains(Admins, Meteor.users.findOne(this.userId).username)) {
            return Messages.find({});
        }
    }
    if (this.userId) {
        return Messages.find({$or: [{to: this.userId, reciver: {$lte: 1}}, {from: this.userId, sender: 0}]}, {
            sender: 0,
            reciver: 0
        })
    }
});
Meteor.publish(null, function () {
    if (Meteor._isBlocked) {
        this.ready();
    }
    if (this.userId) {
        return Stream.find({userId: this.userId})
    }
});
Meteor.publish(null, function () {
    if (Meteor._isBlocked) {
        this.ready();
    }
    return profilePicture.find({})
});
Meteor.publish(null, function () {
    if (Meteor._isBlocked) {
        this.ready();
    }
    return Images.find();
});
Meteor.publish('comments', function (id) {
    if (Meteor._isBlocked) {
        this.ready();
    }
    var article = Articles.findOne(id);
    if(article.user == this.userId){
        return Comments.find({articleId: id});
    }
    if (article && !article.deleted) {
        if (article.contributingPermissions == 0 || article.readingPermissions == 0
            || _.contains(article.contributingIds, this.userId) || _.contains(article.readingIds, this.userId)) {
            return Comments.find({articleId: id});
        }
    }
});

Meteor.publish('usernames', function (articleId) {
    if (Meteor._isBlocked) {
        this.ready();
    }
    var article = Articles.findOne(articleId);
    if (article.readingPermissions == 0 || article.contributingPermissions == 0) {
        return [];
    }
    else {
        if (article.user == this.userId || _.contains(article.contributingIds, this.userId) || _.contains(article.readingIds, this.userId)) {
            var ids = _.union(article.contributingIds, article.readingIds);
            if (ids) {
                return Meteor.users.find({_id: {$in: ids}});
            }
        }

    }
    return [];
});
Meteor.publish('deleted', function ( limit) {
    if (Meteor._isBlocked) {
        this.ready();
    }

    //Meteor._sleepForMs(2000);

    if (this.userId) {
        return Articles.find({user: this.userId,deleted:true},{
            limit: limit || 5,
                sort: {createdAt: -1}
        })
    }

})
