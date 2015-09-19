/**
 * Created by omar on 9/15/15.
 */
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
    },
    articleUpdate: function (newText, newTitle, articleId) {
        var article = Articles.findOne({_id: articleId}, {_id: 0, owner: 1})
        if (article.user == this.userId) {
            if (newText != null && newTitle != null) {
                Articles.update({_id: articleId}, {$set: {'body': newText, 'title': newTitle}})
            }
            else if (newText == null)
                Articles.update({_id: articleId}, {$set: {'title': newTitle}})
            else if (newTitle == null) {
                Articles.update({_id: articleId}, {$set: {'body': newText}})
            }
        }
        else return (Meteor.Error())

    }
})