//noinspection JSUnusedGlobalSymbols
AutoForm.hooks( // Callbacks invoked after submit the autoform
    {
        addUpdateArticles: {
            onSuccess: function (formType, result) { // here we deploy the permissions of this article to users
                if (formType == 'method') {
                    FlowRouter.go('global', {id: result});
                    $('.alert').hide();
                    Session.set('alert', 'addSuccessfully');
                }
                if (formType == 'method-update') {
                    FlowRouter.go('global', {id: this.docId});
                    $('.alert').hide();
                    Session.set('alert', 'editSuccessfully');
                }
            },
            formToDoc: function (doc) {
                if (doc.contributingIds) {
                    var intersection = _.intersection(doc.readingIds, doc.contributingIds);
                    _.each(intersection, function (u) {
                        doc.readingIds = _.without(doc.readingIds, u);
                    });
                }
                return doc;
            }
        },
        updateArticleS: {
            onSuccess: function (formType, result) { // here we deploy the permissions of this article to users
                var oldReadingIds = this.currentDoc.readingIds ? this.currentDoc.readingIds : [];
                var oldContributingIds = this.currentDoc.contributingIds ? this.currentDoc.contributingIds : [];
                Meteor.call('permissionUpdate', this.docId, oldReadingIds, oldContributingIds);
                FlowRouter.go('global', {id: this.docId});
                $('.alert').hide();
                Session.set('alert', 'editSuccessfully');
            },
            before: {
                'update': function (doc) {
                    if (!allowedUpdateTime(this.currentDoc.createdAt)) {
                        alert(arabicMessages.notInUpdateTime);
                        FlowRouter.go('home');
                    }
                    _.each(_.intersection(doc.$set.readingIds, doc.$set.contributingIds), function (u) {
                        doc.$set.readingIds = _.without(doc.$set.readingIds, u);
                    });
                    return doc;
                }
            }

        },
        addText: {
            onSuccess: function (doc) {
                FlowRouter.go('global', {id: this.insertDoc.articleId});
                Session.set('alert', 'extentionAddedSuccessfully');
            }, formToDoc: function (doc) {

                return doc;
            }
        },
        lastExtentionUpdate: {
            after: {
                'update': function () {
                    FlowRouter.go('global', {id: this.currentDoc.articleId});
                    Session.set('alert', 'editSuccessfully');
                }
            }
        }
    });
Template.add.helpers({
        allowedTime: function () {
            if (FlowRouter.getRouteName() == 'add') {
                return true;
            }
            var articleId = FlowRouter.getParam('_id');
            if (articleId) {
                return ((new Date()).getTime() - Articles.findOne(articleId).createdAt.getTime() < 3600 * 1000)
            }
        },
        canEdit: function () {
            if ((FlowRouter.getParam('_id')) && (FlowRouter.getRouteName() == 'edit'))
                return (Articles.findOne(FlowRouter.getParam('_id')).user == Meteor.userId());
            return (FlowRouter.getRouteName() == 'add')
        }
        ,
        formType: function () {
            if (FlowRouter.getRouteName() == 'add') {
                return 'method';
            }
            if (FlowRouter.getRouteName() == 'edit') {
                return 'method-update';
            }

        },
    mehtodTarget: function () {
            if (FlowRouter.getRouteName() == 'add') {
                return 'addArticle';
            }
        if (FlowRouter.getRouteName() == 'edit') {
            return 'updateArticle';
        }
    },
    schemaTarget: function () {
        if (FlowRouter.getRouteName() == 'edit') {
            if (allowedUpdateTime(Articles.findOne(FlowRouter.getParam('_id')).createdAt))
                return "ArticleSchema";
            else return "updateSchema";
        }
        return 'updateSchema'
        }
        ,
        thisArticle: function () {
            if (FlowRouter.getRouteName() == 'edit') {
                return Articles.findOne({_id: FlowRouter.getParam('_id')});
            }
            // to get the article from collection to display it
        },
    bodyText: function () {
        if (FlowRouter.getRouteName() == 'edit') {
            var article = Articles.findOne({_id: FlowRouter.getParam('_id')});
            return article.body.slice(0, article.body.indexOf('<div'));
        }
    },
        saveButton: function () {
            if (FlowRouter.getRouteName() == 'edit') {
                return arabicMessages.editButtonLabel;
            }
            if (FlowRouter.getRouteName() == 'add') {
                return arabicMessages.addButtonLabel;
            }
            // return the correct title for button that used in the form
        }
        ,
        usersOptions: function () {
            return Meteor.users.find({_id: {$not: Meteor.userId()}}).map(function (c) {
                return {label: c.username, value: c._id};
                // return users name for select2 field
            });
        }
        ,
        s2Opts: function () {
            return {placeholder: arabicMessages.contributingIdsLabel};
        },
    lastAddition: function () {
        var article = Articles.findOne(registerHelpers.currentId());
        var lastAddition = article.body.substring(article.body.lastIndexOf('<div'), article.body.length);
        if (allowedUpdateTime(Addition.date(lastAddition), true)) {
            return Addition.getText(lastAddition)
            }
        }
    }
);
Template.add.events({
    'change #contributingPermissions': function () {
        if ($('#contributingPermissions').val() == 0) {
            $('#readingDiv').hide();
        }
        if ($('#contributingPermissions').val() == 1) {
            $('#readingDiv').show()
        }
        // if contributing permissions is public then we hide the reading permission div
    }
});
//noinspection JSUnresolvedVariable
Template.autoForm.onRendered(function () {
    if (this.data.id == 'addUpdateArticles') {
        $('.alert').remove();
        $('.panel').css('margin-bottom', '5px');
        if (FlowRouter.getRouteName() == 'add') {
            $('div [contenteditable=true]').html('<br>')
        }
        if (FlowRouter.getRouteName() == 'edit') {
            $('.alert').remove();
            $('.panel').css('margin-bottom', '5px');
            $('#contributingPermissions').val(this.data.doc.contributingPermissions)
            $('#readingPermissions').val(this.data.doc.readingPermissions)
        }

    }
    if (this.data.id == 'updateArticles' || this.data.id == 'updatePermissionsForm') {
        $('.alert').remove();
        $('.panel').css('margin-bottom', '5px');
        $('#contributingPermissions').val(this.data.doc.contributingPermissions)
        $('#readingPermissions').val(this.data.doc.readingPermissions)
    }
    //after a bug founded in autoform ... in readingPermissions field or contributingPermissions field we get wrong value
    // from the doc (always return 0 value) ... so it's a rendering problem in autoform
    //  so in this function we feed the field with the original value from db and show and hide readingPermission div
    // according to contributing fields
});
