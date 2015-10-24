Template.articles.helpers({
    articles: function () {
        if (Meteor.userId()) {
            $('.alert').hide();
            switch (Router.current().route.getName()) {
                case "mine" :
                    return Articles.find({user: Meteor.userId()}, {sort: {createdAt: -1}});
                case  "participation":
                    var custom = Stream.findOne({userId: Meteor.userId()})
                    if (custom) {
                        contributingArticles = custom.contributingArticles ? custom.contributingArticles : []
                        return Articles.find({_id: {$in: contributingArticles}}, {sort: {createdAt: -1}});
                    }
                    break;
                case "read":
                    var custom = Stream.findOne({userId: Meteor.userId()});
                    if (custom) {
                        readingArticles = custom.readingArticles ? custom.readingArticles : [];
                        return Articles.find({_id: {$in: readingArticles}}, {sort: {createdAt: -1}});
                    }
                    break;
                case  "favorite":
                    var ids = Favorites.findOne({userId: Meteor.userId()});
                    if (ids)
                        return Articles.find({_id: {$in: ids.favorites ? ids.favorites : []}}, {sort: {createdAt: -1}});
                    break;
                case "articles" :
                    return Articles.find({}, {sort: {createdAt: -1}});
                case "me":
                    return Articles.find({username: UI._globalHelpers['userUsername'](Meteor.userId())}, {sort: {createdAt: -1}});
                    break;
                case "profile" :
                    if (Router.current().params.id)
                        return Articles.find({user: Router.current().params.id}, {sort: {createdAt: -1}});
            }
        }
        else {
            if (Router.current().route.getName() == 'articles')
                return Articles.find({}, {sort: {createdAt: -1}});
            Router.go("signIn")
        }
    },
    headerText: function () {
        switch (Router.current().route.getName()) {
            case "read" :
                return 'مواضيع المشاهدة'
            case "participation" :
                return 'مواضيع المشاركة'
            case "favorite" :
                return 'المواضيع المفضلة'
            case "mine" :
                return ' مواضيعي'
            case 'articles':
                return 'المواضيع العامة'
        }
    },
    headerDescription: function () {
        switch (Router.current().route.getName()) {
            case "read" :
                return 'المواضيع التي لك صلاحية مشاهدتها'
            case "participation" :
                return ' المواضيع التي لك صلاحية مشاهدتها ووالمساهمة في نقاشها'
            case "favorite" :
                return 'مواضيعك المفضلة'
            case "mine" :
                return 'مواضيعك '
            case 'articles':
                return 'جميع المواضيع التي لك صلاحية الوصول إليها'
        }

    }
});
Template.articles.events({
    'click .remove': function (event) {
        var id = this._id;
        if (confirm('هل أنت متأكد من حذف الموضوع؟ ')) {
            Meteor.call("removeArticle", id)
        }
    },
    'click .favorite': function () {
        if (Meteor.userId())
            Meteor.call('favoriteIt', this._id)
    },
    'click .edit': function () {
        Router.go('edit', {id: this._id})
    }
});
Template.searchResult.helpers({
    getArticles: function () {
        return articlesSearch.getData({
            transform: function (matchText, regExp) {
                return matchText.replace(regExp, "<b>$&</b>")
            },
            sort: {createdAt: -1}
        });
    }
});
Template.searchBox.events({
    "keyup #search-box": _.throttle(function (e) {
        var text = $(e.target).val().trim();
        if (text)
        articlesSearch.search(text);
    }, 200)
});
Template.search.helpers({
    loading: function () {
        return (articlesSearch.getStatus() === 'loading');
    }
})
