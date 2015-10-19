/**
 * Created by nuruddin on 07.08.2015.
 */
Template.profile.helpers({
    thisUser: function () {
        var userId = Meteor.userId();
        var user = Meteor.users.findOne(userId) || {};
        return user;
    },
    notUserOrGuest: function () {
        var userId = Meteor.userId();
        var profileId = this._id;
        return !!Meteor.userId() && userId != profileId;
    }
});

//Template.profile.events({
//    'click #sendMessage':function(){
//        var userNameFromId = userFullName(FlowRouter.getParam('_id'));
//        var id = FlowRouter.getParam('_id');
//        var data= {
//            toId:id,
//            toName:userNameFromId
//        };
//        Modal.show('sendMessageModal',data);
//    }
//});

//Template.profileArticles.helpers({
//    myArticles:function(){
//        return Articles.find({user:Meteor.userId()},{sort:{createdAt:-1}});
//    }
//})


//Template.profileMessagesView.onCreated(function(){
//    var self = this;
//    var id = FlowRouter.getParam('messageId');
//    if(!id){
//        return false;
//    }
//    self.autorun(function() {
//        self.subscribe('userMessage');
//    });
//});
//
//Template.profileMessagesView.helpers({
//    allMessage: function() {
//        if(!Meteor.userId() || Meteor.userId() != FlowRouter.getParam('_id') )
//        {
//            return {};
//        }
//
//        var returnedData = [];
//
//        var param = FlowRouter.getParam('messageId');
//        Messages.find({to:Meteor.userId(),from:param},{sort:{sendingAt:-1}}).forEach(function(e){
//            returnedData.push(e);
//        });
//        Messages.find({from:Meteor.userId(),to:param},{sort:{sendingAt:-1}}).forEach(function(e){
//            returnedData.push(e);
//        }) ;
//
//        return _.sortBy(returnedData,'sendingAt');
//    }
//});
//
//Template.profileMessagesView.events({
//    'click .sendMessage':function(){
//        var userNameFromId = userFullName(this.from);
//        var id = FlowRouter.getParam('messageId')
//
//        var data= {
//            toId:id,
//            toName:userNameFromId
//        };
//        Modal.show('sendMessageModal',data);
//    }
//});
//
//Template.profileMessages.onCreated(function(){
//    var self = this;
//    self.autorun(function() {
//        self.subscribe('userMessage');
//    });
//});
//
//
//Template.profileMessages.helpers({
//    myMessages: function() {
//        if(!Meteor.userId() || Meteor.userId() != FlowRouter.getParam('_id') )
//        {
//            return {};
//        }
//        var from = _.pluck(Messages.find({to:Meteor.userId()},{sort:{sendingAt:-1}}).fetch(),'from');
//        var to = _.extend(from,_.pluck(Messages.find({from:Meteor.userId()},{sort:{sendingAt:-1}}).fetch(),'to')) ;
//        var data =_.groupBy(to,function(n){
//            return n
//        });
//        var returnedData = [];
//        _.each(data,function(e,i){
//            returnedData.push(i);
//        });
//        return returnedData;
//    }
//});
//
//Template.messagesProfile.events({
//   'click .viewMessage':function(){
//       var data = {};
//       data.fromId = this.from;
//       data.id = this._id;
//       Modal.show('viewMessageModal',data);
//       Messages.update({_id:this._id},{$set:{seen:true}})
//    }
//});
//
//Template.viewMessageModal.helpers({
//    messages:function(){
//        return Messages.findOne({_id:this.id});
//    }
//})
//AutoForm.hooks({
//    sendMessageForm:{
//        onSuccess: function() {
//            sAlert.success('تم إرسال الرسالة !');
//            Modal.hide();
//        },
//        onError:function(){
//            sAlert.error('لم يتم اﻹرسالة بنجاح الرجاء معاودة اﻹرسال !');
//        }
//    }
////})