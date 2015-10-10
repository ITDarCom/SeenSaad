Template.articles.helpers({
    articles: function () {
        if (Meteor.userId()) {
            switch (Router.current().route.getName()) {
                case "mine" :
                    return Articles.find({user: Meteor.userId()}, {sort: {createdAt: -1}});
                case  "participation":
                    var custom = Stream.findOne({userId: Meteor.userId()})
                    if (custom) {
                        contributingArticles = custom.contributingArticles ? custom.contributingArticles : []
                        return Articles.find({_id: {$in: contributingArticles}});
                    }
                    break;
                case "read":
                    var custom = Stream.findOne({userId: Meteor.userId()});
                    if (custom) {
                        readingArticles = custom.readingArticles ? custom.readingArticles : [];
                        return Articles.find({_id: {$in: readingArticles}});
                    }
                    break;
                case  "favorite":
                    var ids = Favorites.findOne({userId: Meteor.userId()});
                    if (ids)
                        return Articles.find({_id: {$in: ids.favorites ? ids.favorites : []}}, {sort: {createdAt: -1}});
                    break;
                case "articles" :
                    return Articles.find({}, {sort: {createdAt: -1}});
            }
        }
        else {
            if (Router.current().route.getName() == 'articles')
                return Articles.find({});
            Router.go("login")
        }
    }
    ,
    currentRouteName: function () {
        return (Router.current().route.getName())
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
        articlesSearch.search(text);
    }, 200)
});
Template.search.helpers({
    loading: function () {
        return (articlesSearch.getStatus() === 'loading');
    }
})
