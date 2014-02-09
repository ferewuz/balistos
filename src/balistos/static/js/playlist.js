function PlaylistModel(){
    var self=this;
    self.videos=ko.observableArray([]);

    self.addVideo=function(model,item){
        video=$(item.currentTarget);
        video={"title":video.attr('data-title'),
                    "image":video.attr('data-image'),
                    "id":video.attr('data-id')};
        $.ajax({
            type: "GET",
            url: "/post/ajax",
            dataType:"json",
            data: videoarray,
        }).done(function(data ){});

        self.videos.push(new Video({title:video.attr('data-title'),image:video.attr('data-image'),id:video.attr('data-id'),likes:0}));
        $("#response").hide();
    };

    $.ajax({
        type: "GET",
        url: "/playlist_video",
        dataType:"json",
    }).done(function(data ) {
        var mappedVideos=$.map(data,function(item){ return new Video(item);});
        self.videos(mappedVideos);
    });



    self.firstVideoTitle=ko.computed(function(){
        return this.videos()[0].title();
    },this);

    self.firstVideoId=ko.computed(function(){
        return this.videos()[0].id();
    },this);

}


function Video(data){
    this.title = ko.observable(data.title);
    this.id=ko.observable(data.id);
    this.image=ko.observable(data.image);
    this.likes=ko.observable(data.likes);

    this.addLike=function(){
        var likes=this.likes();
        this.likes(likes+1);
    };
}


playlist=new PlaylistModel();

ko.applyBindings(playlist);
