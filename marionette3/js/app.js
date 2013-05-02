var App = new Backbone.Marionette.Application({});

App.addRegions({
    content1: '#content1',
    content2: '#content2',
    content3: '#content3'
});

var Person = Backbone.Model.extend({
    defaults: {
        name: 'pippo'
    }
});

var PersonView = Backbone.Marionette.ItemView.extend({
    tagName: 'li',
    template: '#person-template',
    events: {
        'click': function(ev) {
            console.log('click on person '+this.model.get("name") );
        }
    }
});

var Persons = Backbone.Collection.extend({
    model: Person,
    initialize: function() {
        console.log('initializing collection Persons');
    }
});

var PersonsView = Backbone.Marionette.CollectionView.extend({
    tagName: 'ul',
    template: '#persons-template',
    itemView: PersonView
});


var Person2View = Backbone.Marionette.ItemView.extend({
    tagName: 'p',
    template: '#person-template',
    events: {
        'click': function(ev) {
            console.log('click on person2 '+this.model.get("name") );
        }
    }
});

var PersonsCompositeView = Backbone.Marionette.CompositeView.extend({
    tagName: 'code',
    template: '#persons-template',
    itemView: Person2View,
    events: {
        'click #submit-pippo': function(ev) {
            console.log('changing pippo');
            ev.stopPropagation();
            console.log(this.collection);
            this.collection.find(function(item){
                return item.id=='pippo';
            }).set({name: 'piciu'});
        }
    }
});

App.addInitializer(function() {
    // only a Person view
    var personView = new Person2View({model: new Person({name: 'Topolino'})});
    App.content1.show(personView);
    
    // a CollectionView
    var collection = new Persons();
    collection.add(new Person({name: 'Pippo', id:'pippo'}));
    collection.add(new Person({name: 'Minni'}));
    collection.add(new Person({name: 'Pluto'}));
    var collectionView = new PersonsView({
        collection: collection
    });
    App.content2.show(collectionView);
    
    // another view - same collection
    var compositeView = new PersonsCompositeView({
        collection: collection
    });
    App.content3.show(compositeView);
    
});

$(document).ready(function(){
    App.start();
});
