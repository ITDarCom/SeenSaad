Template.articles.helpers({
    articles: function () {
        var custom;
        if (Meteor.userId()) {
            $('.alert').hide();
            switch (FlowRouter.getRouteName()) {
                case "mine" :
                    return Articles.find({user: Meteor.userId()}, {sort: {createdAt: -1}});
                case  "participation":
                    custom = Stream.findOne({userId: Meteor.userId()});
                    if (custom) {
                        var contributingArticles = custom.contributingArticles ? _.pluck(custom.contributingArticles
                            , 'id') : [];
                        return Articles.find({_id: {$in: contributingArticles}}, {sort: {createdAt: -1}});
                    }
                    break;
                case "read":
                    custom = Stream.findOne({userId: Meteor.userId()});
                    if (custom) {
                        var readingArticles = custom.readingArticles ? _.pluck(custom.readingArticles, 'id') : [];
                        return Articles.find({_id: {$in: readingArticles}}, {sort: {createdAt: -1}});
                    }
                    break;
                case  "favorite":
                    var ids = Favorites.findOne({userId: Meteor.userId()});
                    if (ids)
                        return Articles.find({_id: {$in: ids.favorites ? ids.favorites : []}}, {sort: {createdAt: -1}});
                    break;
                case "home" :
                    return Articles.find({}, {sort: {generalDate: -1}});
                case "profile" :
                    if (Router.current().params.id)
                        return Articles.find({user: Router.current().params.id}, {sort: {createdAt: -1}});
                    break;
                case "global" :
                    if (Router.current().params.id)
                        return Articles.find({_id: Router.current().params.id});
            }
        }
        else {
            if (Router.current().route.getName() == 'home')
                return Articles.find({}, {sort: {createdAt: -1}});
            Router.go('signIn');
        }
    },
    hasMore: function () {
        // If, once the subscription is ready, we have less rows than we
        // asked for, we've got all the rows in the collection.
            Session.setDefault('itemsLimit', 5);
        return (Session.get('itemsLimit') && !(Articles.find().count() < Session.get("itemsLimit"))
        && !(Articles.find().count() === 0));
    }
});
Template.articles.events({
    'click .remove': function () {
        var id = this._id;
        if (confirm(arabicMessages.confirmDelete)) {
            {
                Meteor.call('removeArticle', id, function (err) {
                    $('alert').remove();
                    Session.set('alert', 'deleteSuccessfully')
                });
            }
        }
    },
    'click .favorite': function () {
        if (Meteor.userId())
            Meteor.call('favoriteIt', this._id);
        else
            Router.go('signIn');
    },
    'click .edit': function () {
        Router.go('edit', {id: this._id})
    },
    'click #loadMore': function () {
        var temp = Session.get('itemsLimit') ? Session.get('itemsLimit') : 0
        Session.set('itemsLimit', temp + 5);
    }
});
Template.articles.onCreated(function () {
   switch (FlowRouter.getRouteName())
   {
       case 'mine': Meteor.subscribe('mine');
   }
});
Template.searchResult.helpers({
    getArticles: function () {
        //noinspection JSUnusedGlobalSymbolscon

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
        {
            articlesSearch.search(text);
        }

    }, 1000)
});
Template.search.helpers({
    loading: function () {
        //noinspection JSValidateTypes
        return (articlesSearch.getStatus() === 'loading');
    }
});
Template.Time.events({
    'click .dateSwitch': function (event) {
        //In this function we make a switch the date when the span is clicked So we get the title attribute
        // which contains the long date (in the first switch) and put it in the html istead of the html content (arabic date in first switch)
        var target = $(event.target);
        var temp = target.html();
        target.html(target.attr('title'));
        target.attr('title', temp);
    }
});
Template.articleView.helpers({
    newLabel: function () {
        //noinspection JSUnresolvedVariable
        if (this.user == Meteor.userId())
            return;
        var custom;
        //noinspection JSUnresolvedVariable
        if (this.contributingPermissions == 1) {
            custom = Stream.findOne({userId: Meteor.userId()});
            //noinspection JSUnresolvedVariable
            var article = _.findWhere(custom.contributingArticles, {id: this._id})
            if (article && !article.seen)
                return '<span class="badge redDiv" title=' + arabicMessages.newLabel + '><i class="fa fa-comment"></i></span>';
        }
        //noinspection JSUnresolvedVariable
        if (this.readingPermissions == 1) {
            custom = Stream.findOne({userId: Meteor.userId()});
            //noinspection JSUnresolvedVariable
            var article = _.findWhere(custom.readingArticles, {id: this._id})
            if (article && !article.seen)
                return '<span class="badge redDiv" title=' + arabicMessages.newLabel + '><i class="fa fa-comment"></i></span>';
        }

    },
    canEdit: function () {
        return ((new Date()).getTime() - this.createdAt.getTime() < (3600 * 1000));
    }
});
Template.articleView.events({
    'click .clickableDiv': function () {
        Router.go('global', {id: this._id});
    }

});

