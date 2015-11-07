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
                        contributingArticles = custom.contributingArticles ? _.pluck(custom.contributingArticles, 'id') : []
                        return Articles.find({_id: {$in: contributingArticles}}, {sort: {createdAt: -1}});
                    }
                    break;
                case "read":
                    var custom = Stream.findOne({userId: Meteor.userId()});
                    if (custom) {
                        readingArticles = custom.readingArticles ? _.pluck(custom.readingArticles, 'id') : [];
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
                case "home" :
                    return Articles.find({}, {sort: {createdAt: -1}});
                case "me":
                    return Articles.find({username: UI._globalHelpers['userUsername'](Meteor.userId())}, {sort: {createdAt: -1}});
                    break;
                case "profile" :
                    if (Router.current().params.id)
                        return Articles.find({user: Router.current().params.id}, {sort: {createdAt: -1}});
            }
            if (Session.get('template') == "articles") {
                if (Router.current().params.id)
                    return Articles.find({user: Router.current().params.id}, {sort: {createdAt: -1}});
                return Articles.find({user: Meteor.userId()}, {sort: {createdAt: -1}});
            }
        }
        else {
            if (Router.current().route.getName() == 'articles')
                return Articles.find({}, {sort: {createdAt: -1}});
            Router.go("signIn")
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
Template.Time.events({
    'click .dateSwitch': function () {
        var target = $(event.target)
        var temp = target.html()
        target.html(target.attr('title'));
        target.attr('title', temp)
    }
})
Template.articleView.helpers({
    newLabel: function () {
        if (this.user == Meteor.userId())
            return;
        var custom;
        if (this.contributingPermissions == 1) {
            if (!_.findWhere(custom.contributingArticles, {id: this._id}).seen)
                return '<i class="fa alert-danger fa-circle"></i>'
        }
        if (this.readingPermissions == 1) {
            custom = Stream.findOne({userId: Meteor.userId()})
            if (!_.findWhere(custom.readingArticles, {id: this._id}).seen)
                return '<i class="fa alert-danger fa-circle"></i>'
        }

    }
})