var App = new Backbone.Marionette.Application();

App.addRegions({
    sidebar: '#sidebar',
    main: '#main'
});


var MainView1 = Backbone.Marionette.ItemView.extend({
    template: '#main1-tpl',
    tagName: 'div',
    className: 'main-content'
});

var MainView2 = Backbone.Marionette.ItemView.extend({
    template: '#main2-tpl',
    tagName: 'div',
    className: 'main-content'
});


App.addInitializer(function() {
    App.main.show(new MainView1());
});

$(document).ready(function() {
    App.start();
    $('#sidebar .main1-btn').click(function(e) {
        e.stopPropagation();
        App.main.show(new MainView1());
    });
    $('#sidebar .main2-btn').click(function(e) {
        e.stopPropagation();
        App.main.show(new MainView2());
    });
});