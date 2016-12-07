
var ctx :Canvas2D= null;
var imageUrl = "imagetest.png";
var width = 0;
var height = 0;
var woldRectangle : Rect = null;
function init(){
    var c  = <HTMLCanvasElement> document.getElementById("canvas");
    width = c.width;
    height = c.height;

    ctx  = <Canvas2D> c.getContext("2d");
    ctx.width = c.width;
    ctx.height = c.height;
    woldRectangle = new Rect(0,0,width,height);
    Resource.Images.push( imageUrl);
    Resource.OnFinishedLoad = function(){
        start();
    }
    Resource.load();
}
var vector : Vector;
function start(){
    var renderer = new Renderer();
    
    renderer.canvas = ctx;
    renderer.start();
    // for (var i = 0 ; i < 10 ; i++){
    //     var x = Util.randomInt(width);
    //     var y = Util.randomInt(height);
    //     var testBody = new Body();
    //     testBody.shape = new Rect(x,y,100,100);
    //     testBody.debugging = true;
    //     var image:any = Resource[imageUrl];    
    //     testBody.image = new Bitmap(image);
    //     testBody.render(ctx);
    //     var moveX =  Math.random();
    //     var moveY = Math.random();
    //     testBody.move(moveX,moveY);
    //     renderer.addObject(testBody);
    // }

    var line = new LineBody(new Point(0,0), new Point(width/2, height/2));
    var wedge = new PoylgonBody();
    wedge.setPoints([10,10,30,10,40,20,50,150,20,60]);

    vector = new Vector(new Point(80,100),30,200);
    vector.color = "#F00"
   // vector.startRotate();
    
    var box = new Body();
    box.color = "#00F";
    box.shape = new Rect(50,100,800,50);
    renderer.addObject(box);
    renderer.addObject(vector);
    // renderer.addObject(wedge);
    // renderer.addObject(line);
}

class Canvas2D extends CanvasRenderingContext2D{
    width : number = 1;
    height : number =1;
}

class Action{

}

interface RenderObject {
    render(canvas:Canvas2D);
}

interface Animate {
    timer : number;
    callback : Function;
    data : any;
    start();
}

class Util {
    public static randomInt =  function(max:number) : number{
        return (Math.random() * max )| 0;
    }

    public static toRadians = function(degrees) {
        return degrees * Math.PI / 180;
    };
 
    // Converts from radians to degrees.
    public static toDegrees = function(radians) {
        return radians * 180 / Math.PI;
    };
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
        },1000/60);
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
    containPoint(x:number, y:number):boolean{
        if (this.x > x )
            return false;
        if (this.y > y)
            return false;
        if (this.x+this.width < x)
            return false;
        if (this.y+this.height < y)
            return false;

        return true;
    }

    containRect(rect:Rect) : boolean{
        if (!this.containPoint(rect.x,rect.y))
            return false;
        if (!this.containPoint(rect.x+rect.width,rect.y+rect.height))
            return false;            
        return true;
    }
}

class Bitmap extends Rect {    
    source : HTMLImageElement = null;
    constructor(image:HTMLImageElement,width = image.width, height = image.height){
        super(0,0,width,height);
        this.source = image;
    }
}

class PoylgonBody implements RenderObject{
    forecolor : string = "#000";
    points : Point[] = [];
    closedPath : boolean = true;
    setPoints(point : number[]){
        this.points = [];
        while(point.length){
            this.points.push(new Point(point.shift(),point.shift()));
        }
    }
    render(canvas:Canvas2D){
        canvas.strokeStyle = "#FFF";
        this.points.forEach( (pt,index) => {
            if (index == 0)
                canvas.moveTo(pt.x,pt.y);
            canvas.lineTo(pt.x,pt.y);            
        });

        if (this.closedPath)
            canvas.closePath();
        canvas.fill();
        canvas.stroke();
    }
}

class Vector implements RenderObject{
    position : Point = new Point();
    angle : number=  0;
    distance : number =1;
    color : string = "#FFF";
    constructor(point:Point, angle:number = 0, distance:number = 1){
        this.position = point;
        this.angle = angle;
        this.distance = distance;
    }
    startRotate(){
        var animate = new MoveAnimate();
        animate.data = this;
        var roff = Math.random()/2-0.5/2;
        animate.callback = function(data:Vector){
            data.angle +=roff;            
        };
        animate.start();
    }
    render(canvas:Canvas2D){
        canvas.save();
        canvas.strokeStyle = this.color;
        canvas.beginPath();
        canvas.moveTo(this.position.x, this.position.y);
        var x = Math.cos(Util.toRadians(this.angle)) * this.distance;
        var y = -Math.sin(Util.toRadians(this.angle)) * this.distance;
        canvas.lineTo(this.position.x+x,this.position.y+y);
        canvas.closePath();
        
        canvas.stroke();
        canvas.fill();
        canvas.restore();
        canvas.fillStyle = "#FFF"
        canvas.fillText((this.angle | 0).toString(),this.position.x -10, this.position.y-10);
    }
}
class LineBody extends PoylgonBody{
    public startPos : Point;
    public endPos : Point;
    constructor(start:Point,end:Point){
        super()
        this.startPos = start;
        this.endPos = end;
        this.updatePoint();
    }

    updatePoint(){
        this.setPoints([this.startPos.x,this.startPos.y,this.endPos.x,this.endPos.y]);
    }
}

class Renderer {
    backgroundColor : string = "#000";
    objects : RenderObject[] = [];
    timer : number = 0;
    canvas : Canvas2D = undefined;
    frameRate : number = 30;
    public addObject(object:RenderObject){
        this.objects.push(object);
    } 
    public removeObject(object:Body){
        var index= this.objects.indexOf(object);
        if (index > -1)
            this.objects.splice(index,1);
    }

    public render(canvas : Canvas2D){
        canvas.lineWidth = 1;
        var oldfillStyle = canvas.fillStyle;
        canvas.fillStyle = this.backgroundColor;   
        canvas.fillRect(0,0,width,height);
        canvas.fillStyle = oldfillStyle;

        this.objects.forEach(element => {
            element.render(canvas);
        });
    }

    public start(){
        var _this = this;
        this.timer = setInterval(function(){
            _this.render(_this.canvas);
        },1000/this.frameRate);
    }

    public stop(){
        clearInterval(this.timer);
    }

    public refresh(){
        this.render(this.canvas);
    }    
}

class Body implements RenderObject{
    shape : Rect  = null;
    image : Bitmap = null;
    debugging : Boolean = false;
    angle : number = 0;
    color :string = "#000";
    move (x:number,y:number){
        var animate = new MoveAnimate();
        animate.data = this;
        var roff = Math.random()/2-0.5/2;
        animate.callback = function(data:Body){
            data.shape.x += x;
            data.shape.y += y;
            data.angle +=roff;
            if (!woldRectangle.containRect(data.shape)){
                x = -x;
                y = -y;
            }

        };
        animate.start();
    }

    public render(canvas : Canvas2D){
        canvas.save();
        canvas.translate(this.shape.x + this.shape.width / 2 ,this.shape.y + this.shape.height/2)
        canvas.rotate(this.angle);
        canvas.translate( -this.shape.width / 2 ,-this.shape.height/2)
        if (this.image)
        {
            canvas.drawImage(this.image.source,this.image.x, this.image.y,this.image.width,this.image.height,0,0,this.shape.width,this.shape.height);
        }
        else
        {
            canvas.strokeStyle = this.color;
            canvas.strokeRect(0,0,this.shape.width,this.shape.height);
        }
        if (this.debugging){            
            canvas.strokeRect(0,0,this.shape.width,this.shape.height);
        }
        canvas.restore();
    } 
}

class RectBody extends Body{
    public render(canvas : Canvas2D){
        canvas.strokeRect(this.shape.x,this.shape.y,this.shape.width,this.shape.height);
        canvas.moveTo(this.shape.x,this.shape.y);
        canvas.lineTo(this.shape.width,this.shape.height);
        canvas.stroke();
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


function changeAngle(data){
    var angle = parseFloat(data);
    vector.angle = angle;
}