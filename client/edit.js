/**
 * Created by omar on 9/15/15.
 */
Template.edit.helpers({
    thisArticle: function () {
        var article = Articles.findOne(Router.current().params.id)
        return article
    }
})