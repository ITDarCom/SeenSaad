Template.articles.onRendered(function(){
    //if we were coming back from an article, scroll down to it.
    if (Session.get('lastArticle')){
        jQuery('html, body').animate({
            scrollTop: jQuery("#article-"+Session.get('lastArticle')).offset().top
        }, 2000);
        Tracker.nonreactive(function(){
            Session.set('lastArticle', null)
        })
    }
})

Template.articles.onCreated(function(){

    var instance = this

    //a reactive dictionary to store the state of our current list of articles
    instance.state = new ReactiveDict()
    instance.ready = new ReactiveVar()

    //we reset our stored state whenever the route changes
    instance.autorun(function(){

        console.log('re-setting state..')
        var route = Router.current().route.getName()
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
            case "home":
                channel = "articles"
                break;
        }


        //default loaded and limit values (on )
        var loaded = 0, limit = 5

        //if there are already loaded articles (cached/history)
        Tracker.nonreactive(function(){
            console.log('there are already', ArticlesCursor(route).count(), 'articles')
            if (ArticlesCursor(route).count() > 0){
                //we are rounding to the nearest multiple of increment amount 
                //example: increment = 5, existing = 12, then we set limit to 12 + 3 = 15
                loaded = limit = ArticlesCursor(route).count() + (5-(ArticlesCursor(route).count()%5))
            }
        })

        instance.state.set('route', route)
        instance.state.set('channel', channel) 
        instance.state.set('loaded', loaded) //number of loaded articles
        instance.state.set('limit', limit) //number of total displayed items

    })


    //we re-subscribe, when either channel or limit change
    instance.autorun(function(){

        var channel = instance.state.get('channel');     
        var limit = instance.state.get('limit');

        console.log('subscribing to ', channel, limit)
        //subscribing using subscription manager
        var subscription = ArticlesSubscriptions.subscribe(channel, limit);
        instance.ready.set(subscription.ready())
        
        if (subscription.ready()) {
            //increasing the actual number of displayed items
            console.log('subscribed to ', channel, limit)
            instance.state.set('loaded', limit); 
        }
    })

    //It is quite ugly to include this here, sorry. - Amjad
    //A callback that runs on every user scroll
    $(window).scroll(function() {
        var threshold, target = $("#showMoreResults");
        if (!target.length) return;
     
        threshold = $(window).scrollTop() + $(window).height() - target.height();
     
        if (target.offset().top < threshold) {
            if (!target.data("visible")) {
                // console.log("target became visible (inside viewable area)");
                target.data("visible", true);

                // increase limit by 5 and update it
                var limit = instance.state.get('limit')
                limit += 5;
                instance.state.set('limit', limit)
            }
        } else {
            if (target.data("visible")) {
                // console.log("target became invisible (below viewable arae)");
                target.data("visible", false);
            }
        }       
    })
     
    

})

Template.articles.helpers({

    initialLoad : function(){
        //we know that we are rendering the list for the first time if it has zero items loaded
        return (Template.instance().state.get('loaded') == 0)
    },
    hasMore: function () {
        var articlesCount = ArticlesCursor(Template.instance().state.get('route')).count()
        var loaded = Template.instance().state.get('loaded')

        return (!(articlesCount < loaded) && (articlesCount != 0));
    },
    articles: function () {
        return ArticlesCursor(Router.current().route.getName())
    },
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

