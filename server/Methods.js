/**
 * Created by omar on 1/24/16.
 */

Meteor.methods({
    removeArticle: function (docId) {
        check(docId, String);
        var article = Articles.findOne(docId);
        if (article && article.user == this.userId)

            Articles.update({_id:docId},{$set: {deleted:true}},{filter:false}, function (err, result) {
                //if (!err) {
                //    if (Meteor.isClient) {
                //        Router.go('mine');
                //    }
                //}
            });
    }

})
