Template.articles.helpers({
    articles: function () {
        return Articles.find({}, {sort: {createdAt: -1}});
    },
    currentRouteName: function () {
        return (Router.current().route.getName())
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
        //  alert(articlesSearch.getStatus())
        return (articlesSearch.getStatus() === 'loading');
    }
})
Template.articles.onRendered(function () {
    switch (Router.current().route.getName()) {
        case "read":
            $('h1').text('مواضيع المشاهدة');
            $('.description').text('المواضيع التي لك صلاحية مشاهدتها');
            break;
        case "participation":
            $('h1').text('مواضيع المشاركة');
            $('.description').text(' المواضيع التي لك صلاحية مشاهدتها ووالمساهمة في نقاشهاا');
            break;
        case "favorite":
            $('h1').text('المواضيع المفضلة');
            $('.description').text('مواضيعك المفضلة');
            break;
        case "mine":
            $('h1').text(' مواضيعي');
            $('.description').text('مواضيعك ');
    }
})