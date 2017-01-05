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

class Canvas2D extends CanvasRenderingContext2D{
    width : number = 1;
    height : number = 1;
}

class Action implements Animate{
    timer : number;
    callback : Function;
    data : any;
    duration : number = 500;
    repeat : boolean = true;    
    count : number = 0;
    frame : number = -1;
    constructor(data: any,dur:number, repeat = true){
        this.data = data;
        this.duration = dur;
        this.repeat = repeat;        
    }
    
    start(){
        var _this = this; 
        var count = 0;

        var framerate = this.duration/this.frame;
        if (this.duration == -1)
            framerate = 1000/60;

        this.timer = setInterval(function(){
            if (!_this.callback)
                return;

            var isStop = _this.callback(_this,_this.data,count)
            if (isStop)
                _this.stop();
            count++;
            if (!_this.repeat && count == _this.frame){
                _this.stop();
            }
        },framerate);
    }
    stop (){
        clearInterval(this.timer);
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

class SpriteAction extends Action{
    constructor(data:SpriteBitmap,dur:number,repeat = true){        
        super(data,dur,repeat)
        this.frame =  data.rects.length;
        this.callback = this.step;
    }
    public step(obj:Action, dst:SpriteBitmap ,count:number){
        dst.nextStep();
    }
}

class SpriteBitmap  {
    source : HTMLImageElement = null;
    rects : Rect []
    public currentIndex :number =0;
    constructor(image:HTMLImageElement,rects:Rect[]){
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

class PolygonBody implements RenderObject, Body{
    color : string = "#FFF";
    points : Point[] = [];
    shape : Rect = null;
    angle : number = 0;
    closedPath : boolean = true;
    setPoints(point : number[]){
        this.points = [];
        while(point.length){
            this.points.push(new Point(point.shift(),point.shift()));
        }
    }
    render(canvas:Canvas2D){
        canvas.beginPath();
        canvas.strokeStyle = this.color;
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

function getLineBody(body:Body, lines : Line[]) : Line[]{
    if (body instanceof PolygonBody){
        var pbody = <PolygonBody> body;
        var pos : Point[] = pbody.points;
                                
        for(var i = 0 ; i<pos.length-1 ; i++){
            lines.push(new Line(pos[i], pos[i+1]));
        }
        return lines;
    }
    if (body instanceof RectBody){
        var pos : Point[] = [];
        pos.push(new Point(body.shape.x, body.shape.y));
        pos.push(new Point(body.shape.x + body.shape.width, body.shape.y));
        pos.push(new Point(body.shape.x + body.shape.width, body.shape.y + body.shape.height));
        pos.push(new Point(body.shape.x, body.shape.y+ body.shape.height));
        
        for(var i = 0 ; i<pos.length-1 ; i++){
            lines.push(new Line(pos[i], pos[i+1]));
        }

        lines.push(new Line(pos[pos.length -1 ],pos[0]));
    }

    return lines;
}

class ScrollSprite implements RenderObject {
    color : string = "black";
    view : Rect = new Rect();
    region : Rect = new Rect();
    image : Bitmap;
    public render(canvas:Canvas2D){
        canvas.save();
        canvas.drawImage(this.image.source,this.view.x, this.view.y, this.view.width, this.view.height, this.region.x, this.region.y, this.region.width, this.region.height )
        canvas.restore();
    }
}
        
function getMinDistancePoint(dp : Point, arryPoint : Point[]){
    var dists : number[] = [];
    for(var i = 0 ; i<arryPoint.length ; i++){
        dists.push(MathUtil.getDistance(dp,arryPoint[i]));
    }
    
    var min:number = Number.MAX_VALUE;
    var minindex = 0;
    for(var i = 0 ; i < dists.length; i++){

        if (min > dists[i]){
            min = dists[i];
            minindex =i;
        }
    }

    return minindex;
}

function valid(lines:Line[], spoint:Point,epoint:Point,ignore:Line, resultF : Function): Point{
    var resultPoint : Point;
    var interPoints : Point[] = [];
    var interLines : Line[] = []
    for( var i = 0 ; i < lines.length; i++){
        
        var element = lines[i];
        if (element == ignore)
            continue;
        MathUtil.lineIntersection(spoint,epoint, element.startPos,element.endPos, function(result,point:Point){
            if (result){
                interPoints.push(point);
                interLines.push(element);
            }
        })
    }

    if (interPoints.length >0)
    {
        var minIndex =  getMinDistancePoint(spoint,interPoints);
        resultPoint = interPoints[minIndex];
        resultF(resultPoint,interLines[minIndex]);
    }

    return resultPoint;
} 

class RayCastVectorBody extends PolygonBody{
    vector : Vector
    relationBody :Body[];
    vertexes : CircleBody[] = [];
    guideLine : LineBody[] =[]
    render(canvas:Canvas2D){
        this.vertexes=[];
        this.guideLine = [];
        this.closedPath = false;
        this.updateVector();
        super.render(canvas);
        for( var i = 0 ; i< this.vertexes.length; i++){
            this.vertexes[i].render(canvas);
        }
        canvas.setLineDash([5, 15]);
        for( var i = 0 ; i< this.guideLine.length; i++){
            this.guideLine[i].render(canvas);
        }
        canvas.setLineDash([]);
        
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
        var lines : Line[] =[];

        for (var i = 0 ; i < this.relationBody.length ; i++)
            getLineBody(this.relationBody[i],lines);

        var circlebodies : CircleBody[] = [];
        for (var i = 0 ; i < this.relationBody.length ; i++){
            if (this.relationBody[i] instanceof CircleBody)
            circlebodies.push(this.relationBody[i]);
        }
        
        var startPoint = this.vector.position;
        var angle = this.vector.angle;
        var distance = this.vector.distance;
        var lastLine = null;

        while(true)
        {
            var newangle = 0;
            var endPoint = MathUtil.getEndPoint(startPoint,angle,distance)
            var midlePoint = valid(lines, startPoint,endPoint, lastLine,function(point:Point, line:Line){
                var p = MathUtil.subjectPoint(line.startPos,line.endPos);
                var lineangle = Math.abs(MathUtil.toDegrees(Math.atan2(p.y,p.x)));
                lastLine = line;
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
                
                break;
            }
        }
        
        this.validCircle(circlebodies,startPoint,endPoint,function(newpoint,angle,subdistance){
            distance -= subdistance;                
            endPoint =  MathUtil.getEndPoint(newpoint,angle,distance);
            points.push(newpoint);
        })
        points.push(endPoint);
        var vbuffer = this.converttonumarray(points);
        this.setPoints(vbuffer);
    }

    public validCircle(circlebodies : CircleBody[], startPoint : Point, endPoint: Point, callback : Function){
        for (var i = 0 ; i <  circlebodies.length;i++){
            var circle = circlebodies[i];
            var circlepoints = MathUtil.circlelineintersection(new Point(circle.shape.x,circle.shape.y), circle.shape.width,startPoint,endPoint);
            var centerpos = new Point(circle.shape.x,circle.shape.y);
            var minx = startPoint.x < endPoint.x ? startPoint.x : endPoint.x;
            var maxx = startPoint.x > endPoint.x ? startPoint.x : endPoint.x;
            var miny = startPoint.y < endPoint.y ? startPoint.y : endPoint.y;
            var maxy = startPoint.y > endPoint.y ? startPoint.y : endPoint.y;
            
            var interpoints : Point[] = [];
            var distances : number [] = [];
            for( var i = 0 ; i < circlepoints.length; i++){
                var ppoint = circlepoints[i];
                if (ppoint.x > minx && ppoint.x < maxx && ppoint.y > miny && ppoint.y < maxy){

                    interpoints.push(circlepoints[i]);

                    var dist = MathUtil.getDistance(startPoint,ppoint);                
                    distances.push(dist);
                }
            }

            var min = Number.MIN_VALUE;
            var minIndex = 0;
            distances.forEach( (element,index) => {
                if (min > element){
                    minIndex = index;
                }
            });

            if (interpoints.length > 0){
                var newpoint :Point= interpoints[minIndex];
                var linevect =  MathUtil.subjectPoint(startPoint,endPoint);                
                
                var linedgree =  MathUtil.toDegrees(Math.atan2(-linevect.y,linevect.x));

                var subp1 = MathUtil.subjectPoint(centerpos,newpoint);
                var guideStart = new Point(startPoint.x + subp1.x , startPoint.y + subp1.y);
                var subp2 = MathUtil.subjectPoint(centerpos,guideStart)
                var d3angle =linedgree-MathUtil.get3PointDegree(subp1.x,subp1.y,subp2.x,subp2.y)*2;

                var subdistanc = MathUtil.getDistance(newpoint,startPoint);
                callback(newpoint,d3angle,subdistanc);
            }
        }
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

class VectorBody extends Vector implements RenderObject, Shape{
    color : string = "#FFF";
    constructor(point:Point, angle:number = 0, distance:number = 1){
        super(point,angle,distance);
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

class Line implements Shape{
    public startPos : Point;
    public endPos : Point;
    constructor ( sp : Point, ep:Point){
        this.startPos = sp;
        this.endPos = ep;
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
    selectedBody : TestBody ; 
    offset : Point = new Point();
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

    onmousedown(event:MouseEvent){
        var _sbody =  this.selectedBody;
        this.objects.forEach(el => {
            
            if (el instanceof TestBody)
            {
                if (el.shape.containPoint(event.x,event.y)){
                    el.selected = true;
                    _sbody = el;
                    return;
                }   
            }   
        });
        if (_sbody)
        {
            if (this.selectedBody)
                this.selectedBody.selected =false;
            this.selectedBody = _sbody;
            this.offset.x=  this.selectedBody.shape.x -  event.x;
            this.offset.y = this.selectedBody.shape.y - event.y;
        }
        
    }
    onmousemove(event:MouseEvent){
        
        if (this.selectedBody)
        {
            this.selectedBody.shape.x = event.x + this.offset.x;
            this.selectedBody.shape.y = event.y + this.offset.y;
        }
    }

    onmouseup(event:MouseEvent){
        if (this.selectedBody){
            this.selectedBody.selected = false;

            this.selectedBody = null;
        }
    }
}

class Body implements RenderObject,Shape{    
    color : string = "#000";
    shape : Rect  = new Rect();
    angle : number = 0;
    public render(canvas : Canvas2D){
    } 
}

class CollisionTester{
    public bodies : Body[] = []
    public world : Rect ;  
    public checkBody(body:MoveAnimate,callback:Function){
        var opposite : Body; 
        var lines =  this.GetEdgeLine(this.world);
    }

    private GetEdgeLine(rect:Rect): Line[]{
        var pos : Point[] = [];
        pos.push(new Point(rect.x, rect.y));
        pos.push(new Point(rect.x + rect.width, rect.y));
        pos.push(new Point(rect.x + rect.width, rect.y+ rect.height));
        pos.push(new Point(rect.x, rect.y+ rect.height));
        var lines : Line[] =[];
        
        for(var i = 0 ; i<pos.length-1 ; i++){
            lines.push(new Line(pos[i], pos[i+1]));
        }

        lines.push(new Line(pos[pos.length -1 ],pos[0]));
        return lines;
    }

    private tester(object:Circle,vector:Vector,lines:Line[]){
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
        valid(startPoint,endpoint,function(result:boolean,line:Line){
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

class CircleBody extends Body implements RenderObject{
    render(canvas:Canvas2D){
        canvas.save();
        canvas.translate(this.shape.x,this.shape.y);
        canvas.beginPath();
        canvas.strokeStyle = this.color;
        canvas.arc(0,0,this.shape.width,0,2*Math.PI, false);
        canvas.stroke();
        //canvas.strokeRect(this.shape.x,this.shape.y,3,3)
        canvas.restore();
    }
}

class SpriteBody extends Body{
    image : SpriteBitmap = null;
    angle : number;
    currentAnimation : Animate;  

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

class RectBody extends Body{
    public render(canvas : Canvas2D){
        canvas.strokeStyle = this.color;
        canvas.beginPath();
        canvas.strokeRect(this.shape.x,this.shape.y,this.shape.width,this.shape.height);
        canvas.stroke();
    }
}


class TextBody extends RectBody{
    public text : string;
    public render(canvas : Canvas2D){
        canvas.fillStyle = this.color;
        if (this.text)
        {
            canvas.fillText(this.text,this.shape.x,this.shape.y,100);            
        }
        
    }
}

class TestBody  extends RectBody{    
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