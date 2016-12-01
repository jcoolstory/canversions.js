
var ctx :CanvasRenderingContext2D= null;
var imageUrl = "imagetest.png";
function init(){
    var c  = <HTMLCanvasElement> document.getElementById("canvas");
    ctx  = <CanvasRenderingContext2D> c.getContext("2d");

    Resource.Images.push( imageUrl);
    Resource.OnFinishedLoad = function(){
        start();
    }
    Resource.load();
}

function start(){

    var testBody = new Body();
    testBody.shape = new Rect(0,0,100,100);
    var image:any = Resource[imageUrl];    
    testBody.image = new Bitmap(image);
    testBody.redner(ctx);
    testBody.move(1,1);
}

class Action{

}

interface Animate {
    timer : number;
    callback : Function;
    data : any;
    start();
}

class MoveAnimate implements Animate {
    timer =0;
    private duration : number = 0;
    public callback ;
    data : any;
    start(){
        var _this = this; 
        this.timer = setInterval(function(){
            _this.callback(_this.data);
        },100);
    }
}

class Point {
    public x : number = 0;
    public y : number = 0;
    constructor(x=0, y=0){
        this.x = x;
        this.y = y;
    }
}

class Rect extends Point {
    public width : number = 0;
    public height : number = 0;
    constructor(x :number = 0, y : number = 0, width : number = 0 , height : number=0){
        super(x,y);
        this.width= width;
        this.height= height;
    } 
}

class Bitmap extends Rect {    
    source : HTMLImageElement = null;
    constructor(image:HTMLImageElement,width = image.width, height = image.height){
        super(0,0,width,height);
        this.source = image;
    }
}

class Body{
    shape : Rect  = null;
    image : Bitmap = null;
    move (x:number,y:number){
        var animate = new MoveAnimate();
        animate.data = this;
        animate.callback = function(data:Body){
            data.shape.x += x;
            data.shape.y +=y;
            data.redner(ctx);
        };
        animate.start();
    }
    public redner(canvas : CanvasRenderingContext2D){
        if (this.image)
            canvas.drawImage(this.image.source,this.image.x, this.image.y,this.image.width,this.image.height,this.shape.x,this.shape.y,this.shape.width,this.shape.height);
        else
            canvas.strokeRect(this.shape.x,this.shape.y,this.shape.width,this.shape.height);
    } 
}

class ResourceManager extends Object {
    public OnFinishedLoad : Function;
    public Images :string[] = [];
    private count : number = 0;
    private loadedCount : number = 0;
    public load(){
        this.count = this.Images.length;
        this.Images.forEach( el=>{
            this.imageLoad(el);

        });
    }

    private checkFinished(){
        if (this.count == this.loadedCount){
            if (this.OnFinishedLoad){
                this.OnFinishedLoad();
            }
        }
    }

    private imageLoad( url:string) {	
        var _this = this;
        var img = new Image();
        img.src = url;
        img.onload = function() {        
            Resource[url] = img;
            _this.loadedCount++;
            _this.checkFinished();
        };
    }
}

var Resource = new ResourceManager();