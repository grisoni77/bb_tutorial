var App;
var MainView1, MainView2;

(function() {

    App = new Backbone.Marionette.Application({
        log: function(msg) {
            $('#log-list').append($('<li>').html(msg));
        }
    });

    App.addRegions({
        sidebar: '#sidebar',
        main: '#main'
    });


    MainView1 = Backbone.Marionette.ItemView.extend({
        template: '#main1-tpl',
        tagName: 'div',
        className: 'main-content',
        events: {
            'click .main1-btn-close': function() {
                App.main.close();
            }
        },
        onShow: function() {
            App.log('VIEW: showing main1view');
        },
        onClose: function() {
            App.log('VIEW: closing main1view');
        }
    });

    MainView2 = Backbone.Marionette.ItemView.extend({
        template: '#main2-tpl',
        tagName: 'div',
        className: 'main-content',
        events: {
            'click .main2-btn-close': function() {
                App.main.close();
            }
        },
        onShow: function() {
            App.log('VIEW: showing main2view');
        },
        onBeforeClose: function(e) {
            App.log('VIEW: before closing main2view');
            if (!confirm('Are you sure you want to close me?')) {
                e.stopPropagation();
                return false;
            }
        },
        onClose: function() {
            App.log('VIEW: closing main2view');
        },
        onDomRefresh: function() {
            App.log('VIEW: DOMRefreshing main2view');
        }
    });

    /*
     * This example will cause a view to slide down from the top of the region, instead of just appearing in place.
     */
    Backbone.Marionette.Region.prototype.open = function(view) {
        this.$el.hide();
        this.$el.html(view.el);
        this.$el.slideDown("fast");
    }


    App.addInitializer(function() {
        // Logger
        App.main.on('show', function(view) {
            //$('#log-list').append($('<li>').html('show '+view.template));
            App.log('REGION: show ' + view.template);
        });
        App.main.on('close', function(view) {
            //$('#log-list').append($('<li>').html('close currentView'));
            App.log('REGION: close currentView');
        });

        App.main.show(new MainView1());
        // what does this do?
        //App.main.attachView(new MainView1());
    });
})();

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

