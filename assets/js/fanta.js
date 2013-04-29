$(function(){
    
    var Player = Backbone.Model.extend({
        
        defaults: {
            name: 'player',
            role: null,
            status: 0
        },
        
        play: function() {
            this.status = 1;
        },
        
        substitute: function() {
            this.status = 2;
        }
    });
    
    var Team = Backbone.Collection.extend({
        
        model: Player,
                
        initialize: function() {
            this.on('add', this.addPlayer);
        },
                
        addPlayer: function() {
            console.log('player added to team');
        }
       
    });
    
    var Lineup = Backbone.Collection.extend({
        
        model: Player,
                
        initialize: function() {
            this.on('add', this.addPlayer);
        },
                
        addPlayer: function() {
            console.log('player added to line-up');
        }
               
    });
    
    var TeamView = Backbone.View.extend({
        
        el: $('#team-cnt'),
                
        initialize: function(opts) {
            this.list = $('#team-list');
            
            this.model = new Team();
            var that = this;
            $(opts.players).each(function(i, player){
                that.model.add(new Player(player));
            });
            
            this.listenTo(this.model, 'change:status', this.managePlayer);
            
            this.render();
        },
                
        setLineup: function(lineupView) {
            this.lineupView = lineupView;
        },
                
        render: function() {
            this.list.empty();
            this.model.each(function(player){
                var view = new PlayerView({model: player});
                this.list.append(view.render().el);
            }, this);
            
            return this;
        },
                
        addPlayer: function(player) {
            this.model.add(player);
            this.render();
        },
                
        managePlayer: function() {
            this.model.each(function(player){
                if (player.get('status')==1) {
                    this.model.remove(player);
                    console.log(player, 'managePlayer');
                    this.lineupView.addPlayer(player);
                }
            }, this);
            
            this.render();
        }
    });
    
    var LineupView = Backbone.View.extend({
        
        el: $('#lineup-cnt'),
                
        initialize: function(opts) {
            this.list = $('#lineup-list');
            
            this.model = new Lineup();
            
            this.listenTo(this.model, 'change:status', this.managePlayer);
            
            this.render();
        },
                
        setTeam: function(teamView) {
            this.teamView = teamView;
        },
                
        render: function() {
            this.list.empty();
            this.model.each(function(player){
                var view = new PlayerPlayView({model: player});
                this.list.append(view.render().el);
            }, this);
            
            return this;
        },
                
        addPlayer: function(player) {
            this.model.add(player);
            this.render();
        },
                
        managePlayer: function() {
            this.model.each(function(player){
                if (player.get('status')==0) {
                    this.model.remove(player);
                    console.log(player, 'managePlayer');
                    this.teamView.addPlayer(player);
                }
            }, this);
            this.render();
        }
    });
    
    var PlayerView = Backbone.View.extend({
        tagName: 'li',
        
        playerTpl: _.template( $('#player-template').html() ),
        
        events: {
            'click': 'putPlayer',
        },
        
        initialize: function() {
        },
        
        render: function() {
            this.$el.html(this.playerTpl(this.model.toJSON()));
            
            return this;
        },
        
        putPlayer: function(){
            console.log(this.model.get('name'), 'click on player');
            this.model.set('status', 1);
        }
                
    });
    
    var PlayerPlayView = Backbone.View.extend({
        tagName: 'li',
        
        playerTpl: _.template( $('#player-play-template').html() ),
        
        events: {
            'click': 'removePlayer',
        },
        
        initialize: function() {
        },
        
        render: function() {
            this.$el.html(this.playerTpl(this.model.toJSON()));
            
            return this;
        },
        
        removePlayer: function(){
            console.log(this.model.get('name'), 'click on play player');
            this.model.set('status', 0);
        }
                
    });
    
    
    
    var lineupview = new LineupView();
    
    var teamview = new TeamView({
        players: [
            {name: 'por1', role: 'P'},
            {name: 'por2', role: 'P'},
            {name: 'por3', role: 'P'},
            {name: 'dif1', role: 'D'},
            {name: 'dif2', role: 'D'},
            {name: 'dif3', role: 'D'},
            {name: 'dif4', role: 'D'},
            {name: 'dif5', role: 'D'},
            {name: 'dif6', role: 'D'},
            {name: 'dif7', role: 'D'},
            {name: 'dif8', role: 'D'},
            {name: 'cen1', role: 'C'},
            {name: 'cen2', role: 'C'},
            {name: 'cen3', role: 'C'},
            {name: 'cen4', role: 'C'},
            {name: 'cen5', role: 'C'},
            {name: 'cen6', role: 'C'},
            {name: 'cen7', role: 'C'},
            {name: 'cen8', role: 'C'},
            {name: 'att1', role: 'A'},
            {name: 'att2', role: 'A'},
            {name: 'att3', role: 'A'},
            {name: 'att4', role: 'A'},
            {name: 'att5', role: 'A'},
            {name: 'att6', role: 'A'}
        ]
    });
    
    teamview.setLineup(lineupview);    
    lineupview.setTeam(teamview);
});

