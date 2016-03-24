FlowRouter.route( '/about', {
    action: function() {
        BlazeLayout.render( 'layout', { main: 'about' } );
    },
    name: 'about'
});

FlowRouter.route( '/add', {
    action: function() {
        BlazeLayout.render( 'layout', { main: 'add' } );
    },
    name: 'add'
});

FlowRouter.route( '/messages', {
    action: function() {
        BlazeLayout.render( 'layout', { main: 'messages' } );
    },
    name: 'messages'
});