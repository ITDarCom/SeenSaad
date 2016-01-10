//noinspection JSUnusedGlobalSymbols
AutoForm.debug();
AutoForm.hooks( // Callbacks invoked after submit the autoform
    {
        updatePermissionsForm: {
            onSuccess: function (formType, result) { // here we deploy the permissions of this article to users
                if (formType == 'insert') {
                    Meteor.call('permissionDeploy', result);
                    Router.go('global', {id: result});
                    $('.alert').hide();
                    Session.set('alert', 'addSuccessfully');
                    //$('.bodyContainer').prepend('<div class="alert addSuccess alert-success"><a class="close"' +
                    //    ' data-dismiss="alert">×</a><span>' + arabicMessages.addSuccessfully + '</span></div>')
                }
                if (formType == 'update') { // after submitting an edit for article we look if we have changes
                    // in permissions field
                    var oldReadingIds = this.currentDoc.readingIds ? this.currentDoc.readingIds : [];
                    var oldContributingIds = this.currentDoc.contributingIds ? this.currentDoc.contributingIds : [];
                    Meteor.call('permissionUpdate', this.docId, oldReadingIds, oldContributingIds);
                    Router.go('global', {id: this.docId});
                    $('.alert').hide();
                    Session.set('alert', 'editSuccessfully');
                    //$('.bodyContainer').prepend('<div class="alert updateSuccess alert-success"><a class="close"' +
                    //    ' data-dismiss="alert">×</a><span>' + arabicMessages.editSuccessfully + '</span></div>')
                }
            },

        },
        addUpdateArticles: {
            onSuccess: function (formType, result) { // here we deploy the permissions of this article to users
                if (formType == 'insert') {
                    Meteor.call('permissionDeploy', result);
                    Router.go('global', {id: result});
                    $('.alert').hide();
                    Session.set('alert', 'addSuccessfully');
                    //$('.bodyContainer').prepend('<div class="alert addSuccess alert-success"><a class="close"' +
                    //    ' data-dismiss="alert">×</a><span>' + arabicMessages.addSuccessfully + '</span></div>')
                }
                if (formType == 'update') { // after submitting an edit for article we look if we have changes
                    // in permissions field
                    var oldReadingIds = this.currentDoc.readingIds ? this.currentDoc.readingIds : [];
                    var oldContributingIds = this.currentDoc.contributingIds ? this.currentDoc.contributingIds : [];
                    Meteor.call('permissionUpdate', this.docId, oldReadingIds, oldContributingIds);
                    Router.go('global', {id: this.docId});
                    $('.alert').hide();
                    Session.set('alert', 'editSuccessfully');
                    //$('.bodyContainer').prepend('<div class="alert updateSuccess alert-success"><a class="close"' +
                    //    ' data-dismiss="alert">×</a><span>' + arabicMessages.editSuccessfully + '</span></div>')
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
            },
            before: {
                'update': function (doc) {
                    if (!allowedUpdateTime(this.currentDoc.createdAt)) {
                        alert(arabicMessages.notInUpdateTime);
                        Router.go('home');
                    }
                    _.each(_.intersection(doc.$set.readingIds, doc.$set.contributingIds), function (u) {
                        doc.$set.readingIds = _.without(doc.$set.readingIds, u);
                    });
                    return doc;
                }
            }
        },
    });
Template.add.helpers(
    {
        allowedTime: function () {
            if (Router.current().route.getName() == 'add') {
                return true;
            }
            var articleId = Router.current().params.id;
            if (articleId) {
                return ((new Date()).getTime() - Articles.findOne(articleId).createdAt.getTime() < 600 * 1000)
            }
        },
        canEdit: function () {
            if ((Router.current().params.id) && (Router.current().route.getName() == 'edit'))
                return (Articles.findOne(Router.current().params.id).user == Meteor.userId());
            return (Router.current().route.getName() == 'add')
        }
        ,
        formType: function () {
            if (Router.current().route.getName() == 'edit') {
                return 'update';
            }
            if (Router.current().route.getName() == 'add') {
                return 'insert';
            }
            //to choose form type (insert or update)
        }
        ,
        thisArticle: function () {
            if (Router.current().route.getName() == 'edit') {
                return Articles.findOne({_id: Router.current().params.id});
            }
            // to get the article from collection to display it
        }
        ,
        insert: function () {
            return (Router.current().route.getName() == 'add');
            // return true if we are in insert operation
        }
        ,
        saveButton: function () {
            if (Router.current().route.getName() == 'edit') {
                return arabicMessages.editButtonLabel;
            }
            if (Router.current().route.getName() == 'add') {
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
        canAddExtension: function () {
            if (!allowedUpdateTime(this.createdAt)) {
                if (articlesExtension.find({articleId: this._id}).count() == 0) {
                    return true;
                }
                if (!allowedUpdateTime(articlesExtension.findOne({articleId: this._id}, {sort: {createdAt: -1}}).createdAt)) {
                    return true;
                }
                return false;
            }
        },
        lastExtensionUpdate: function () {
            var extension = articlesExtension.findOne({articleId: this._id}, {sort: {createdAt: -1}});
            if (extension && allowedUpdateTime(extension.createdAt))
                return extension;
        }

    }
);
Template.add.events({
    'change #contributingPermissions': function () {
        if ($('#contributingPermissions').val() == 0) {
            $('#readingDiv').hide()
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
        if (this.data.type == 'update') {
            {
                if (Router.current().route.getName() == 'edit') {
                    //noinspection JSUnresolvedVariable
                    $('#contributingPermissions').val(this.data.doc.contributingPermissions);
                }
                //noinspection JSUnresolvedVariable
                if (this.data.doc.contributingPermissions == 1) {
                    //noinspection JSUnresolvedVariable
                    $('#readingPermissions').val(this.data.doc.readingPermissions);
                    $('#readingDiv').show();

                }
                else {
                    $('#readingDiv').hide() // here contributing permissions is public so the reading is already public

                }
            }
        }
        else if (this.data.type == 'insert') {
            $('#readingDiv').hide(); // in some of cases readingDiv still appear event the contributing
            // permissions is public


        }
    }
    if (this.data.id == 'updatePermissionsForm') {
        $('.alert').remove();
        $('#contributingPermissions').val(this.data.doc.contributingPermissions);
        if (this.data.doc.contributingPermissions == 1) {
            //noinspection JSUnresolvedVariable
            $('#readingPermissions').val(this.data.doc.readingPermissions);
            $('#readingDiv').show();

        }
        else {

            $('#readingDiv').hide();// here contributing permissions is public so the reading is already public
        }
    }
    //after a bug founded in autoform ... in readingPermissions field or contributingPermissions field we get wrong value
    // from the doc (always return 0 value) ... so it's a rendering problem in autoform
    //  so in this function we feed the field with the original value from db and show and hide readingPermission div
    // according to contributing fields
});
