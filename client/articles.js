//we wrap this listener so we can use its reference un-register when templates are destroyed
function ScrollListener(instance) {

    return function (e) {
        var threshold, target = $("#showMoreResults");
        if (!target.length) return;

        threshold = $(window).scrollTop() + $(window).height() - target.height();

        if (target.offset().top < threshold) {
            /*console.log('setting limit', ArticlesCursor(Router.current().route.getName()).count() + 5, 
             'was', instance.state.get('limit'))*/

            // increase limit by 5 and update it
            instance.state.set('limit', ArticlesCursor(Router.current().route.getName()).count() + 5)
        }
    }
}

Template.articles.onRendered(function () {
    //if we stored the lastScroll position, we'll scroll down to it
    if (Session.get('lastScrollPosition')) {
        window.scrollTo(0, Session.get('lastScrollPosition'))
        Tracker.nonreactive(function () {
            Session.set('lastScrollPosition', null)
        })
    }
})

Template.articles.onDestroyed(function () {
    window.removeEventListener('scroll', Template.instance().listener)
})

Template.articles.onCreated(function () {

    var instance = this

    //a reactive dictionary to store the state of our current list of articles
    instance.state = new ReactiveDict()
    instance.ready = new ReactiveVar()

    //scroll listener to detect when we reach the end of page
    instance.listener = new ScrollListener(instance)
    window.addEventListener('scroll', instance.listener)

    //we reset our stored state whenever the route changes
    instance.autorun(function () {

        var route = Router.current().route.getName()
        //console.log('re-setting state..', route)
        var channel
        switch (route) {
            case "read":
                channel = "readArticles"
                break;
            case "participation":
                channel = "contribution"
                break;
            case "favorite":
                channel = "favorites"
                break;
            case "mine":
                channel = "mine"
                break;
            case "profile":
                channel = "specificUserArticles"
                break;
            case "home":
                channel = "articles"
                break;
            case "deleted" :
                channel = "deleted";
        }


        //default lastRequestSize and limit values (on )
        var lastRequestSize = 0, limit = 5

        instance.state.set('route', route)
        instance.state.set('channel', channel)
        instance.state.set('lastRequestSize', lastRequestSize) //number of lastRequestSize articles
        instance.state.set('limit', limit) //number of total displayed items

    })

    //we re-subscribe, when either channel or limit change
    instance.autorun(function () {

        var channel = instance.state.get('channel');
        var limit = instance.state.get('limit');

        //subscribing using subscription manager
        //console.log('subscribing to ', channel, limit)
        var subscription
        if (channel == 'specificUserArticles') {
            subscription = ArticlesSubscriptions.subscribe(channel, Router.current().params.id, limit)
        } else {
            subscription = ArticlesSubscriptions.subscribe(channel, limit)
        }
        instance.ready.set(subscription.ready())

        if (subscription.ready()) {
            //increasing the actual number of displayed items
            //console.log('subscribed to ', channel, limit)
            instance.state.set('lastRequestSize', limit);
        }
    })

})

Template.articles.helpers({

    initialLoad: function () {
        //we know that we are rendering the list for the first time if it has zero items lastRequestSize
        return (Template.instance().state.get('lastRequestSize') == 0)
    },
    hasMore: function () {
        var articlesCount = ArticlesCursor(Template.instance().state.get('route')).count()
        var lastRequestSize = Template.instance().state.get('lastRequestSize')
        return ((articlesCount >= lastRequestSize) && (articlesCount != 0));
    },
    articles: function () {
        return ArticlesCursor(Router.current().route.getName())
    },
});

Template.articles.events({
    'click .article-link': function (e) {
        //we save the scroll position so we can return to the same position when user goes back
        Session.set('lastScrollPosition', window.pageYOffset)
    },
    'click .remove': function () {
        var id = this._id;
        if (confirm(arabicMessages.confirmDelete)) {
            {
                Meteor.call('removeArticle', id, function (err) {
                    $('.alert').remove();
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
            if (article && !article.newComment)
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
    },
});
Template.articleView.events({
    'click .clickableDiv': function () {
        Router.go('global', {id: this._id});
    }

});

