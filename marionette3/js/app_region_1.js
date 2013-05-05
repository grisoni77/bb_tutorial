$(document).ready(function() {
    var mainRegion = new Backbone.Marionette.Region({
        el: '#main'
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
    $('#sidebar .main1-btn').click(function(e) {
        e.stopPropagation();
        mainRegion.show(new MainView1());
    });
    $('#sidebar .main2-btn').click(function(e) {
        e.stopPropagation();
        mainRegion.show(new MainView2());
    });
});

