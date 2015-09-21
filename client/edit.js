///**
// * Created by omar on 9/15/15.
// */
//Template.edit.helpers({
//    thisArticle: function () {
//        var article = Articles.findOne(Router.current().params.id)
//        return article
//    }
//})
//AutoForm.hooks({
//    updateArticleForm: {
//        onSuccess: function (insert, result) {
//            $('#notify').html('<div class="alert alert-success"><a class="close" data-dismiss="alert">×</a><span>' + "تم تعديل الموضوع بنجـاح " + '</span></div>')
//            $('#notify').show()
//            setTimeout(function () {
//                Router.go('articles')
//            }, 1500)
//        }
//    }
//})