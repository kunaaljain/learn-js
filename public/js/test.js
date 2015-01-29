  (function($){


    Backbone.sync = function(method, model, success, error){
    success();
  }
   var Item = Backbone.Model.extend({
    defaults: {
      part1: 'hello',
      part2: 'world'
    }
  });

   var List = Backbone.Collection.extend({
    model: Item
  });

   var ItemView= Backbone.View.extend({
    tagName: 'li',

    events: {
      'click span.swap':'swap',
      'click span.delete':'remove',
      'change .chck': 'toog'

    },

    initialize: function(){
      _.bindAll(this,'render','unrender','swap','remove','toog');
      this.model.bind('change',this.render);
      this.model.bind('remove',this.unrender);
    },

    render: function(){
      $(this.el).html('<span style="color:black;"><input type="checkbox" class="chck"/><span class="txt">'+this.model.get('part1')+' '+this.model.get('part2')+'</span></span> &nbsp; &nbsp; <span class="swap" style="font-family:sans-serif; color:blue; cursor:pointer;">[swap]</span> <span class="delete" style="cursor:pointer; color:red; font-family:sans-serif;">[delete]</span>');
      return this;
    },

    unrender: function(){
      $(this.el).remove();
    },

    swap: function(){
      var swapped = {
        part1: this.model.get('part2'),
        part2: this.model.get('part1')
      };
      this.model.set(swapped);
    },

    remove: function(){
      this.model.destroy();
    },

    toog: function(){
      x=$(this.el).find(".chck");
      if(x.prop("checked"))
      {

        $(this.el).find(".txt").css("text-decoration","line-through");
      }
      else
      {
          $(this.el).find(".txt").css("text-decoration","none"); 
      }
    }

   });

   var ListView = Backbone.View.extend({
    el: $('body'),

    events: {
      'click button#add' : 'addItem',
      'change .chck': 'countdone'

    },


    initialize: function(){
      _.bindAll(this,'render','addItem','appendItem','countdone');
      this.collection= new List();
      this.collection.bind('add',this.appendItem);
      this.counter=0;
      this.totaldone=0;
      this.render();
    },
    render: function(){
      var self=this;
      $(this.el).append("<button id='add'>Add</button>");
      $(this.el).append("<ul></ul>");
      $(this.el).append('<div id="counter"></div>');
      _(this.collection.models).each(function(item){ 
        self.appendItem(item);
      }, this);
    },

    addItem: function(){
      this.counter++;
      var item = new Item();
      item.set({
        part2: item.get('part2') + this.counter // modify item defaults
      });
      this.collection.add(item); // add item to collection; view is updated via event 'add'
    },

    appendItem: function(item){
      var itemView= new ItemView({
        model: item
      });
      item.vieww=itemView;
      $('ul', this.el).append(itemView.render().el);
    },

    countdone: function(){
      var self=this;
      this.totaldone = $( ".chck:checked" ).length;
      if(this.totaldone>0) $('#counter').text("Total Done "+this.totaldone);
      else $('#counter').text("");
      console.log(this.collection.models);
      _(this.collection.models).each(function(item){
        $(item.vieww.el).remove();
      },this);
    }

  });

   var listView=new ListView();

  })(jQuery);
