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
            default:
                channel = "articles"
        }

        instance.state.set('route', route)
        instance.state.set('channel', channel)
        instance.state.set('loaded', 0) //number of loaded articles
        instance.state.set('limit', 5) //number of total displayed items
    })


    //we re-subscribe, when either channel or limit change
    instance.autorun(function(){

        var channel = instance.state.get('channel');
        var limit = instance.state.get('limit');

        console.log('subscribing to ', channel, limit)

        var subscription = instance.subscribe(channel, limit);
        instance.ready.set(subscription.ready())

        if (subscription.ready()) {
            //increasing the actual number of displayed items
            instance.state.set('loaded', limit);
            console.log('subscribed to ', channel, limit)
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
                console.log('here')

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
        var hasMore = (!(Articles.find().count() < Template.instance().state.get('loaded'))
            && !(Articles.find().count() === 0));
        return hasMore
    },
    articles: function () {
        var custom;
        if (Meteor.userId()) {
            $('.alert').hide();
            switch (Router.current().route.getName()) {
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

