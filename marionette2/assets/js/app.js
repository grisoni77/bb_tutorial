var MyApp = new Backbone.Marionette.Application();

MyApp.addRegions({
    content: "#content"
});

MyApp.LibraryApp = function(){
    var LibraryApp = {};
    
    // DATA
    var Book = Backbone.Model.extend();
 
    var Books = Backbone.Collection.extend({
        model: Book,
 
        initialize: function(){
            var self = this;
 
            // the number of books we fetch each time
            this.maxResults = 40;
            // the results "page" we last fetched
            this.page = 0;
 
            // flags whether the collection is currently in the process of fetching
            // more results from the API (to avoid multiple simultaneous calls
            this.loading = false;
 
            // the maximum number of results for the previous search
            this.totalItems = null;
            
            _.bindAll(this, "search");
            MyApp.vent.on("search:term", function(term){
                self.search(term);
            });

        },
        search: function(searchTerm){
            this.page = 0;
 
            var self = this;
            this.fetchBooks(searchTerm, function(books){
                console.log(books);
                self.reset(books);
            });
        },
 
        fetchBooks: function(searchTerm, callback){
            if(this.loading) return true;
 
            this.loading = true;
 
            var self = this;
            MyApp.vent.trigger("search:start");
 
            var query = encodeURIComponent(searchTerm)+'&amp;maxResults='+this.maxResults+'&amp;startIndex='+(this.page * this.maxResults)+'&amp;fields=totalItems,items(id,volumeInfo/title,volumeInfo/subtitle,volumeInfo/authors,volumeInfo/publishedDate,volumeInfo/description,volumeInfo/imageLinks)';
 
            $.ajax({
                url: 'https://www.googleapis.com/books/v1/volumes',
                dataType: 'jsonp',
                data: 'q='+query,
                success: function (res) {
                    MyApp.vent.trigger("search:stop");
                    if(res.totalItems == 0){
                        callback([]);
                        return [];
                    }
                    if(res.items){
                        self.page++;
                        self.totalItems = res.totalItems;
                        var searchResults = [];
                        _.each(res.items, function(item){
                            var thumbnail = null;
                            if(item.volumeInfo && item.volumeInfo.imageLinks && item.volumeInfo.imageLinks.thumbnail){
                                thumbnail = item.volumeInfo.imageLinks.thumbnail;
                            }
                            searchResults[searchResults.length] = new Book({
                                thumbnail: thumbnail,
                                title: item.volumeInfo.title,
                                subtitle: item.volumeInfo.subtitle,
                                description: item.volumeInfo.description,
                                googleId: item.id
                            });
                        });
                        callback(searchResults);
                        self.loading = false;
                        return searchResults;
                    }
                    else if (res.error) {
                        MyApp.vent.trigger("search:error");
                        self.loading = false;
                        return false;
                    }
                }
            });
        }
    });    
 
    LibraryApp.Books = new Books();
 
    var Layout = Backbone.Marionette.Layout.extend({
        template: "#library-layout",
 
        regions: {
            search: "#searchBar",
            books: "#bookContainer"
        }
    });
 
    LibraryApp.initializeLayout = function(){
        LibraryApp.layout = new Layout();
 
        LibraryApp.layout.on("show", function(){
            MyApp.vent.trigger("layout:rendered");
        });
        MyApp.content.show(MyApp.LibraryApp.layout);
    };
 
    return LibraryApp;
}();


MyApp.LibraryApp.BookList = function(){
    var BookList = {};
 
    var BookView = Backbone.Marionette.ItemView.extend({
        template: "#book-template"
    });
 
    var BookListView = Backbone.Marionette.CompositeView.extend({
        template: "#book-list-template",
        id: "bookList",
        itemView: BookView,
 
        appendHtml: function(collectionView, itemView){
            collectionView.$(".books").append(itemView.el);
        }
    });
 
    BookList.showBooks = function(books){
        var bookListView = new BookListView({
            collection: books
        });
        MyApp.LibraryApp.layout.books.show(bookListView);
    };

    var SearchView = Backbone.View.extend({
 
        el: "#searchBar",
 
        events: {
            'change #searchTerm': 'search'
        },
 
        search: function() {
            var searchTerm = this.$('#searchTerm').val().trim();
            MyApp.vent.trigger("search:term", searchTerm);
            console.log("searching for ", searchTerm);
        }
    });
 
    MyApp.vent.on("layout:rendered", function(){
        var searchView = new SearchView();
        MyApp.LibraryApp.layout.search.attachView(searchView);
    });
    
    return BookList;
}();
 
MyApp.vent.on("layout:rendered", function(){
    MyApp.LibraryApp.BookList.showBooks(MyApp.LibraryApp.Books);
});




MyApp.addInitializer(function(){
    MyApp.LibraryApp.initializeLayout();
});


MyApp.addInitializer(function(){
    MyApp.LibraryApp.Books.search("sviluppo web");
});


