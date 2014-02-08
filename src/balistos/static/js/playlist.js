function PlaylistModel(){
    var self=this;
    self.videos=ko.observableArray([]);

    

    videoarray=[
        { title: "fernando torres song with lyrics",image:"http://i1.ytimg.com/vi/cpV0ygkmhP4/mqdefault.jpg",id:"cpV0ygkmhP4",likes: 3 },
        { title: "Fernando Torres song in spanish english subs nike advert",image:"http://i1.ytimg.com/vi/WWgB-PbF9xM/mqdefault.jpg",id:"WWgB-PbF9xM",likes: 0 },
        { title: "Chelsea FC - Fernando Torres Song",image:"http://i1.ytimg.com/vi/7B5ftOV3FYA/mqdefault.jpg",id:"UPa_y0HIFXw",likes: 0 },
    ]; 
    var mappedVideos=$.map(videoarray,function(item){ return new Video(item);});
    self.videos(mappedVideos);

    self.addVideo=function(model,item){
        video=$(item.currentTarget);
        self.videos.push(new Video({title:video.attr('data-title'),image:video.attr('data-image'),id:video.attr('data-id'),likes:0}));
        $("#response").hide();
    };


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