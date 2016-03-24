FlowRouter.route('/about' , {
    name:"about" ,
    action: function(){

        BlazeLayout.render('layout', {  main: "about" });
    }
});

FlowRouter.route('/add' , {
    name:"add" ,
    action: function(){

        BlazeLayout.render('layout', {  main: "add" });
    }
});



FlowRouter.route('/messages' , {
    name:"messages" ,
    action: function(){

        BlazeLayout.render('layout', {  main: "messages" });
    }
});