MyApp = new Backbone.Marionette.Application();
 
MyApp.addRegions({
    mainRegion: "#content"
});

AngryCat = Backbone.Model.extend({
    rankUp: function() {
        this.set({rank: this.get('rank') - 1});
    },

    rankDown: function() {
        this.set({rank: this.get('rank') + 1});
    }
});

AngryCats = Backbone.Collection.extend({
    model: AngryCat,
    
    initialize: function(cats){
        
        var rank = 1;
        _.each(cats, function(cat) {
            cat.set('rank', rank);
            ++rank;
        });
        
        this.on('add', function(cat) {
            if( ! cat.get('rank') ) {
                var error =  Error("Cat must have a rank defined before being added to the collection");
                error.name = "NoRankError";
                throw error;
            }
        });        
        
        var self = this;
        
        MyApp.vent.on("rank:up", function(cat){
            console.log("rank up on cat "+cat.get("name"));
            if (cat.get('rank') == 1) {
                // can't increase rank of top-ranked cat
                return true;
            }
            self.rankUp(cat);
            self.sort();
        });

        MyApp.vent.on("rank:down", function(cat){
            console.log("rank down on cat "+cat.get("name"));
            if (cat.get('rank') == self.size()) {
                // can't increase rank of top-ranked cat
                return true;
            }
            self.rankDown(cat);
            self.sort();
        });

    },
    
    comparator: function(cat) {
        return cat.get('rank');
    },
    
    rankUp: function(cat) {
        // find the cat we're going to swap ranks with
        var rankToSwap = cat.get('rank') - 1;
        var otherCat = this.at(rankToSwap - 1);

        // swap ranks
        cat.rankUp();
        otherCat.rankDown();
    },

    rankDown: function(cat) {
        // find the cat we're going to swap ranks with
        var rankToSwap = cat.get('rank') + 1;
        var otherCat = this.at(rankToSwap - 1);

        // swap ranks
        cat.rankDown();
        otherCat.rankUp();
    }
    
});

AngryCatView = Backbone.Marionette.ItemView.extend({
    template: '#angry_cat-template',
    tagName: 'tr',
    className: 'angry_cat',
    events: {
        'click .rank_up img': 'rankUp',
        'click .rank_down img': 'rankDown'
    },
    rankUp: function() {
        MyApp.vent.trigger("rank:up", this.model);
        /*
        var rank = this.model.get('rank');
        this.model.set('rank', rank==5 ? 5 : rank+1);
        */
    },
    rankDown: function() {
        MyApp.vent.trigger("rank:down", this.model);
        /*
        var rank = this.model.get('rank');
        this.model.set('rank', rank==1 ? 1 : rank-1);
        */
    }
});

AngryCatsView = Backbone.Marionette.CompositeView.extend({
    template: '#angry_cats-template',
    tagName: 'table',
    id: 'angry_cats',
    className: 'table-striped table-bordered',
    itemView: AngryCatView,
    
    appendHtml: function(collectionView, itemView) {
        collectionView.$('tbody').append(itemView.el);
    }
});


MyApp.addInitializer(function(options){
    var angryCatsView = new AngryCatsView({
        collection: options.cats
    });
    MyApp.mainRegion.show(angryCatsView);
});


// START
$(document).ready(function(){
    var cats = new AngryCats([
        new AngryCat({ name: 'Wet Cat', image_path: 'assets/images/cat2.jpg' }),
        new AngryCat({ name: 'Bitey Cat', image_path: 'assets/images/cat1.jpg' }),
        new AngryCat({ name: 'Surprised Cat', image_path: 'assets/images/cat3.jpg' })
    ]);

    MyApp.start({cats: cats});
    
    cats.add(new AngryCat({ 
        name: 'Cranky Cat', 
        image_path: 'assets/images/cat4.jpg',
        rank: cats.size() + 1
    }));

});