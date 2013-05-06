var App = new Backbone.Marionette.Application();

App.addRegions({
    main: "#content"
});

var RowView = Backbone.Marionette.ItemView.extend({
    template: '#row-tpl',
    tagName: 'tr',
    events: {
        'click .up': 'up',
        'click .down': 'down'
    },
    initialize: function() {
        this.listenTo(this.model, 'change:position', function() {
            console.log("change:position");
            this.render();
        });
    },
    up: function() {
        console.log("up");
        this.model.set("position", this.model.get("position") - 1);
        App.vent.trigger('row:up', this.model);
    },
    down: function() {
        console.log("down");
        this.model.set("position", this.model.get("position") + 1);
        App.vent.trigger('row:down', this.model);
    }
});

var TableView = Backbone.Marionette.CompositeView.extend({
    template: '#table-tpl',
    itemViewContainer: 'tbody',
    itemView: RowView,
    initialize: function() {
        this.listenTo(this.collection, 'change', function() {
            console.log('change collection');
            this.collection.sort();
            this.render();
        });
    }
});

var Row = Backbone.Model.extend({
    defaults: {
        position: 1
    }
});
var Table = Backbone.Collection.extend({
    model: Row,
    initialize: function() {
        this.lastPosition = 1;
        this.on('add', function(row) {
            row.set("position", this.lastPosition);
            this.lastPosition++;
            this.sort();
        });
        var self = this;
        App.vent.on('row:up', function(row) {
            console.log('change collection');
            //self.sort();
        });
        App.vent.on('row:down', function(row) {
            //self.sort();
        });
    },
    comparator: function(row) {
        return row.get("position");
    }
});


App.addInitializer(function() {
    var table = new Table();
    table.add(new Row({name: 'Pippo', tel: 'xxxxxx'}));
    table.add(new Row({name: 'Topolino', tel: 'xxxxxx'}));
    table.add(new Row({name: 'Pluto', tel: 'xxxxxx'}));

    var tableView = new TableView({collection: table});

    App.main.show(tableView);
});

$(document).ready(function() {
    App.start();
});