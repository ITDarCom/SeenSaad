Meteor.methods({
    removeArticle: function (docId) {
        check(docId, String)
        var article = Articles.findOne(docId)
        if (article && article.user == this.userId)
            Articles.remove(docId);
    },
    favoriteIt: function (docId) {
        check(docId, String)
        var article = Articles.findOne(docId)
        if (article && this.userId) {
            if (!Favorites.findOne({userId: Meteor.userId(), favorites: {$in: [docId]}})) {
                Favorites.upsert({userId: this.userId}, {$push: {favorites: docId}})
            }
            else {

                Favorites.update({userId: this.userId}, {$pull: {favorites: docId}})
            }
        }

    }

})