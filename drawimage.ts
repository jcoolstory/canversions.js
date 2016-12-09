
class Canvas2D extends CanvasRenderingContext2D{
    width : number = 1;
    height : number =1;
}

class Action{

}

interface RenderObject {
    color :string;
    render(canvas:Canvas2D);
}

interface Shape {

}

interface Animate {
    timer : number;
    callback : Function;
    data : any;
    start();
    stop();
}

class MathUtil {
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

    public static lineIntersection(srt1:Point, end1:Point,srt2:Point,end2:Point, callback:Function){

        var dx_ba = end1.x - srt1.x;
        var dx_dc = end2.x - srt2.x;
        var dy_ba = end1.y - srt1.y;
        var dy_dc = end2.y - srt2.y;
        var den = dy_dc * dx_ba - dx_dc * dy_ba;

        if (den == 0)
            callback(false);

        var dy_ac = srt1.y-srt2.y;
        var dx_ac = srt1.x-srt2.x
        var ua = (dx_dc * dy_ac-dy_dc * dx_ac) / den;
        var ub = (dx_ba * dy_ac-dy_ba * dx_ac) / den;

        if ( 0 < ua && ua <1 && 0 < ub && ub <1 )
        {   
            var nx = srt1.x + dx_ba * ua;
            var ny = srt1.y + dy_ba * ua;
            callback(true,{x:nx,y:ny});
        }else{
            callback(false)
        }
    }

    public static subjectPoint(sp:Point, ep:Point) : Point{
            return {
                x:sp.x - ep.x,
                y:sp.y - ep.y
            }
        }

    
    public static getEndPoint(point:Point,angle:number,distance:number) : Point{
        var x = Math.cos(MathUtil.toRadians(angle)) * distance;
        var y = -Math.sin(MathUtil.toRadians(angle)) * distance;                           
        return { x: point.x + x, y:point.y+y};
    }

    public static getDistance(sp:Point,ep:Point) : number{            
        return Math.sqrt(Math.pow(sp.x - ep.x,2) + Math.pow(sp.y - ep.y,2));
    }
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
    stop (){
        clearInterval(this.timer);
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

class Rect extends Point{
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

    collisionTest(rect:Rect,callback:Function){
        if (this.x > rect.x )
            callback("left");
        if (this.y > rect.y)
            callback("top");
        if (this.x+this.width < rect.x + rect.width)
            callback("right");
        if (this.y+this.height < rect.y + rect.height)
            callback("bottom");
    }
    
}

class Bitmap extends Rect {    
    source : HTMLImageElement = null;
    constructor(image:HTMLImageElement,width = image.width, height = image.height){
        super(0,0,width,height);
        this.source = image;
    }
}

class SpriteAnimation implements Animate{
    timer : number;
    callback : Function;
    data : SpriteBitmap;
    duration : number = 500;
    start(){
        var length = this.data.rects.length;
        var _this = this; 
        this.timer = setInterval(function(){
            _this.data.nextStep(); 
            //    _this.callback(_this.data);
        },500/length);
    }
    stop (){
        clearInterval(this.timer);
    }
}

class SpriteBitmap  {
    source : HTMLImageElement = null;
    rects : Rect []
    public currentIndex :number =0;
    constructor(image:HTMLImageElement,rects:Rect[]){
        //super(0,0,width,height);
        this.source = image;
        this.rects = rects;
    }

    public getImageShift() : Rect{
        var rect = this.getImageRect(this.currentIndex++);
        this.nextStep();
        return rect;
    }

    public nextStep(){
        this.currentIndex++;
        this.currentIndex = this.currentIndex % this.rects.length;
    }
    
    public currentImage(): Rect{
        return this.getImageRect(this.currentIndex);
    }

    public getImageRect(index:number) : Rect{
        return this.rects[index];
    }
}

class PolygonBody implements RenderObject, Shape{
    color : string = "#000";
    points : Point[] = [];
    closedPath : boolean = true;
    setPoints(point : number[]){
        this.points = [];
        while(point.length){
            this.points.push(new Point(point.shift(),point.shift()));
        }
    }
    render(canvas:Canvas2D){
        canvas.beginPath();
        canvas.strokeStyle = "#FFF";
        this.points.forEach( (pt,index) => {
            if (index == 0)
                canvas.moveTo(pt.x,pt.y);
            canvas.lineTo(pt.x,pt.y);            
        });

        if (this.closedPath)
            canvas.closePath();
        
        canvas.stroke();        
    }
}

class RayCastVectorBody extends PolygonBody{
    vector : VectorBody
    relationBody :Body;
    render(canvas:Canvas2D){
        this.closedPath = false;
        this.updateVector();
        super.render(canvas);
    }

    converttonumarray(point:Point[]):number[]{
        var array : number[] =[];
        point.forEach(el=>{
            array.push(el.x,el.y);
        }) 
        return array;
    }

    updateVector(){        
        var points:Point[] = [this.vector.position];
        var pos : Point[] = [];
        pos.push(new Point(this.relationBody.shape.x, this.relationBody.shape.y));
        pos.push(new Point(this.relationBody.shape.x + this.relationBody.shape.width, this.relationBody.shape.y));
        pos.push(new Point(this.relationBody.shape.x + this.relationBody.shape.width, this.relationBody.shape.y+ this.relationBody.shape.height));
        pos.push(new Point(this.relationBody.shape.x, this.relationBody.shape.y+ this.relationBody.shape.height));
        var lines : LineBody[] =[];
        
        for(var i = 0 ; i<pos.length-1 ; i++){
            lines.push(new LineBody(pos[i], pos[i+1]));
        }

        lines.push(new LineBody(pos[pos.length -1 ],pos[0]));

        function valid(spoint:Point,epoint:Point,resultF : Function): Point{
            var resultPoint :Point;
             lines.forEach(element => {
                MathUtil.lineIntersection(spoint,epoint, element.startPos,element.endPos, function(result,point:Point){
                    if (result){
                        resultPoint = point;
                        resultF(resultPoint, element);
                        return;
                    }
                })
            });
            return resultPoint;
        }

        var startPoint = this.vector.position;
        var angle = this.vector.angle;
        var distance = this.vector.distance;
        
        while(true)
        {
            var newangle = 0;
            var endPoint = MathUtil.getEndPoint(startPoint,angle,distance)
            var midlePoint = valid(startPoint,endPoint, function(point:Point, line:LineBody){
                var p = MathUtil.subjectPoint(line.startPos,line.endPos);
                var lineangle = MathUtil.toDegrees(Math.atan2(p.y,p.x));
                newangle = angle + (lineangle - angle)*2
            });
            if (midlePoint)
            {
                points.push(midlePoint);
                var dist =  MathUtil.getDistance(startPoint,midlePoint)
                startPoint = midlePoint;
                angle = newangle;
                distance -= dist;
            }
            else{
                points.push(endPoint);
                break;
            }
        }
        var vbuffer = this.converttonumarray(points);
        this.setPoints(vbuffer);
    }
}

class Vector {
    position : Point = new Point();
    angle : number=  0;
    distance : number =1;
    constructor(point:Point, angle:number = 0, distance:number = 1){
        this.position = point;
        this.angle = angle;
        this.distance = distance;
    }
}

class VectorBody implements RenderObject, Shape{
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
        animate.callback = function(data:VectorBody){
            data.angle +=roff;            
        };
        animate.start();
    }
    render(canvas:Canvas2D){
        canvas.save();
        canvas.strokeStyle = this.color;
        canvas.beginPath();
        canvas.moveTo(this.position.x, this.position.y);
        var x = Math.cos(MathUtil.toRadians(this.angle)) * this.distance;
        var y = -Math.sin(MathUtil.toRadians(this.angle)) * this.distance;
        canvas.lineTo(this.position.x+x,this.position.y+y);        
        canvas.stroke();        
        canvas.restore();
    }
}

class LineBody extends PolygonBody{
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
    public removeObject(object:RenderObject){
        var index= this.objects.indexOf(object);
        if (index > -1)
            this.objects.splice(index,1);
    }

    public render(canvas : Canvas2D){
        canvas.lineWidth = 1;
        var oldfillStyle = canvas.fillStyle;
        canvas.fillStyle = this.backgroundColor;   
        canvas.fillRect(0,0,Resource.width,Resource.height);
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

    public addMouseEvent(element:HTMLElement){
        element.addEventListener("mousedown",this.onmousedown.bind(this));
        element.addEventListener("mousemove",this.onmousemove.bind(this));
        element.addEventListener("mouseup",this.onmouseup.bind(this));
    }
    selectedBody : TestBody ; 
    onmousedown(event:MouseEvent){
        var _sbody =  this.selectedBody;
        this.objects.forEach(el => {
            
            if (el instanceof TestBody)
            {
                if (el.shape.containPoint(event.x,event.y)){
                    el.selected = true;
                    _sbody = el;
                    //break;                    
                    return;
                }   
            }   
        });
        if (_sbody)
        {
            if (this.selectedBody)
                this.selectedBody.selected =false;
            this.selectedBody = _sbody;
        }
        
    }
    onmousemove(event:MouseEvent){
        
        if (this.selectedBody)
        {
            this.selectedBody.shape.x= event.x;
            this.selectedBody.shape.y = event.y;
        }

    }

    onmouseup(event:MouseEvent){
        //this.selectedBody = null;
    }
}

class Body implements RenderObject,Shape{    
    color : string = "#000";
    shape : Rect  = null;
    angle : number = 0;
    public render(canvas : Canvas2D){
    } 
}

class Engine{    
    bodies : Body[] = []

    addObject(body:any){
        renderer.addObject(body);
    }
    public removeObject(object:Body){
        var index= this.bodies.indexOf(object);
        if (index > -1)
            this.bodies.splice(index,1);
    }

    public update(timelapse:number){

    }
}

class CollisionTester{
    public bodies : Body[] = []
    public world : Rect ;  
    public checkBody(body:MoveAnimate,callback:Function){
        var opposite : Body; 
        var lines =  this.GetEdgeLine(this.world)

    }

    private GetEdgeLine(rect:Rect): LineBody[]{
        //var points:Point[] = [this.vector.position];
        var pos : Point[] = [];
        pos.push(new Point(rect.x, rect.y));
        pos.push(new Point(rect.x + rect.width, rect.y));
        pos.push(new Point(rect.x + rect.width, rect.y+ rect.height));
        pos.push(new Point(rect.x, rect.y+ rect.height));
        var lines : LineBody[] =[];
        
        for(var i = 0 ; i<pos.length-1 ; i++){
            lines.push(new LineBody(pos[i], pos[i+1]));
        }

        lines.push(new LineBody(pos[pos.length -1 ],pos[0]));
        return lines;
    }

    private tester(object:Circle,vector:Vector,lines:LineBody[]){
        function valid(spoint:Point,epoint:Point,resultF : Function): Point{
            var resultPoint :Point;
             lines.forEach(element => {
                MathUtil.lineIntersection(spoint,epoint, element.startPos,element.endPos, function(result,point:Point){
                    if (result){
                        resultPoint = point;
                        resultF(resultPoint, element);
                        return;
                    }
                })
            });
            return resultPoint;
        }
        
        var startPoint = vector.position;
        var angle = vector.angle;
        var distance = vector.distance;
        var endpoint = MathUtil.getEndPoint(startPoint,angle,distance);
        valid(startPoint,endpoint,function(result:boolean,line:LineBody){
            var p = MathUtil.subjectPoint(line.startPos,line.endPos);
            var lineangle = MathUtil.toDegrees(Math.atan2(p.y,p.x));
            var newangle = angle + (lineangle - angle)*2
            vector.angle = newangle;
        });
    }
}

class Circle implements Shape{
    point : Point 
    radius : number = 0;
}

class SpriteBody extends Body{
    image : SpriteBitmap = null;
    angle : number;
    currentAnimation : Animate
    isRun = false;
    public run(){
        if (this.isRun)
            return
        var animate = new SpriteAnimation();
        animate.data = this.image;
        animate.duration = 1000;
        animate.start();
        this.currentAnimation = animate;
        this.isRun = true;
    }

    public jump(){
        if (this.currentAnimation)
            this.currentAnimation.stop();
        var _this = this; 
        class action implements Animate{
            timer : number;
            callback : Function;
            data : SpriteBitmap;
            duration : number = 500;
            start(){
                var act = this;
                this.data.currentIndex = 0;
                var height = 50;
                var offset = 0;
                var up : boolean = true;
                var f = this.stop;
                this.timer = setInterval(function(){
                    if (up)
                    {
                        offset++;
                        _this.shape.y--;
                        _this.angle = 100;
                        
                    }
                    else
                    {
                        offset--;
                        _this.shape.y++;
                        _this.angle = -100;
                    }

                    if (offset > height)
                        up = false;
                    
                    if (offset < 0){
                        
                        clearInterval(jump.timer);
                        f();
                        
                        _this.angle = 0;
                        
                    }
                     
                },1000/60);
            }
            stop (){
                //clearInterval(this.timer);
                
                _this.run();
            }
        }
        var jump = new action();
        jump.data = _this.image;
        jump.start();
        this.currentAnimation = jump;
        this.isRun = false;
    }

    public render(canvas : Canvas2D){
        canvas.save();
        canvas.translate(this.shape.x + this.shape.width / 2 ,this.shape.y + this.shape.height/2)
        canvas.rotate(this.angle);
        canvas.translate( -this.shape.width / 2 ,-this.shape.height/2)
        
        if (this.image)
        {
            var imageRegion = this.image.currentImage();
            canvas.drawImage(this.image.source,imageRegion.x,imageRegion.y,imageRegion.width,imageRegion.height,0,0,this.shape.width,this.shape.height);
        }
        else
        {
            canvas.strokeStyle = this.color;
            canvas.strokeRect(0,0,this.shape.width,this.shape.height);
        }
        canvas.restore();
    } 
}

class TestBody  extends Body{    
    image : Bitmap = null;
    debugging : Boolean = false;
    angle : number = 0;
    collision : CollisionTester;
    selected : boolean = false;
    move (x:number,y:number){
        var vector = new Vector(this.shape,this.shape.y);
        vector.angle = MathUtil.toDegrees(Math.atan2(y,x));
        vector.distance =  MathUtil.getDistance(new Point(),new Point(x,y));
        var animate = new MoveAnimate();
        animate.data = this;
        var roff = Math.random()/2-0.5/2;
        animate.callback = function(data:Body){
            // data.selected == true
            //     return;
            Resource.worldRect.collisionTest(data.shape,function(direction){
                switch(direction){
                    case "left":
                        x = -x;
                        break;
                    case "right":
                        x = -x;
                        break;
                    case "top":
                        y = -y;
                        break;
                    case "bottom":
                        y = -y;
                        break;
                }
            });
            
            data.shape.x += x;
            data.shape.y += y;
            data.angle +=roff;

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
        if (this.selected){
            canvas.strokeStyle = "#FFF"
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

class ResourceManager {
    public width : number= 1;
    public height : number =1;
    public worldRect : Rect ;
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