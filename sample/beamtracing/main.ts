/// <reference path="main.d.ts" />

enum Controlmode {
    None,AddObject,
}
let distanceText : undefined | TextBody;
let wireLine : undefined | RayCastVectorBody;
class Tester {
    ctx :Canvas2D= null;
    background = "../../image/background.png";
    renderer: SampleRenderer;
    mousePressed :boolean= false;
    status : Controlmode = Controlmode.None;
    relationBody : RBody[] = [];
    reletionBody2 : RBody[] = [];
    createRenderer(canvas : string) : Renderer
    {
        var c  = <HTMLCanvasElement> document.getElementById("canvas");        
        this.ctx  = <Canvas2D> c.getContext("2d");
        this.ctx.width = c.width;
        this.ctx.height = c.height;
        var renderer = new SampleRenderer();        
        renderer.canvas = this.ctx;
        renderer.addMouseEvent(c);

        c.addEventListener("mousedown",this.onmousedown.bind(this));
        c.addEventListener("mousemove",this.onmousemove.bind(this));
        c.addEventListener("mouseup",this.onmouseup.bind(this));    
        return renderer;
    }
    init(){
        
        this.renderer = <SampleRenderer>this.createRenderer("canvas");
        var c  = <HTMLCanvasElement> document.getElementById("canvas");
        Resource.width = c.width;
        Resource.height = c.height;   
        Resource.worldRect = new Rect(0,0,Resource.width,Resource.height); 
        
        Resource.Images.push(this.background);
        Resource.OnFinishedLoad = function(){
            this.initBodies();
        }.bind(this)
        Resource.load();

    }

    onmousedown(event:MouseEvent){
        this.mousePressed = true;
        if (this.status == Controlmode.AddObject){
        }
    }

    onmousemove(event:MouseEvent){
        if (this.mousePressed){
            if (this.status == Controlmode.AddObject){
            }
        }
    }

    onmouseup(evnt:MouseEvent){
        
        this.mousePressed = false;;
        if (this.status == Controlmode.AddObject){
        }
    }

    setStatus(mode:string){
        this.status = Controlmode[mode];
    }

    stepframe(){
        this.renderer.refresh();
    }
    start(){
        this.renderer.start();
    }
    stop(){
        this.renderer.stop();
    }
    rendColor() : string
    {
        let colorInt = MathUtil.randomInt(0xffffff)
        return colorInt.toString(16)
    }
    createCircleActor() : CircleActor
    {
        var ball1 = new CircleActor();
        
        ball1.color = "#"+this.rendColor();
        ball1.shape.x = 50 + MathUtil.randomInt(50);
        ball1.shape.y = 50 + MathUtil.randomInt(50);
        ball1.shape.width = 25+MathUtil.randomInt(5);
        ball1.relationBody = this.relationBody;
       // ball1.move(0,MathUtil.randomInt(8));
        //this.renderer.addObject(ball1);
        return ball1
    }

    initBodies(){
        // var box1 = new TestBody();
        // box1.color = "#02F";
        // box1.shape = new Rect(40,300,150,80);
        // this.relationBody.push(box1);
        // this.renderer.addObject(box1);

        // var box2 = new TestBody();
        // box2.color = "#F2F";
        // box2.shape = new Rect(440,100,350,5);
        // this.relationBody.push(box2);
        // this.renderer.addObject(box2);

        

        // var wedge1 = new PolygonBody();        
        // wedge1.setPoints([500,300,600,300,600,250,400,250,500,300]);
        // this.relationBody.push(wedge1);
        // this.renderer.addObject(wedge1);

        //  var wedge2 = new PolygonBody();        
        // wedge2.setPoints([150,100,300,200,300,210,150,110,150,100]);
        // this.relationBody.push(wedge2);
        // this.renderer.addObject(wedge2);
        
        for (let i = 0 ; i< 1;i++)
        {
            var circleActor = this.createCircleActor();

            this.renderer.addObject(circleActor);
            //this.relationBody.push(circleActor);
        }
        let debugText = new TextBody();
        debugText.shape.x = 100;
        debugText.shape.y = 50;
        debugText.text = "hello";
        debugText.color = "white";
        this.renderer.addObject(debugText);
        distanceText = debugText;
        // var ball1 = new CircleActor();
        // ball1.color = "red";
        // ball1.shape.x = 50;
        // ball1.shape.y = 50;
        // ball1.shape.width = 5;
        // ball1.relationBody = this.relationBody;
        // ball1.move(1,1);
        // this.renderer.addObject(ball1);

        // var ball2 = new CircleActor();
        // ball2.color = "magenta";
        // ball2.shape.x = 50;
        // ball2.shape.y = 250;
        // ball2.shape.width = 6;
        // ball2.relationBody = this.relationBody;
        // ball2.move(7,1);
        // this.renderer.addObject(ball2);

        // var ball3 = new CircleActor();
        // ball3.color = "#3F1";
        // ball3.shape.x = 450;
        // ball3.shape.y = 50;
        // ball3.shape.width = 16;
        // ball3.relationBody = this.relationBody;
        // ball3.move(-3,1);
        // this.renderer.addObject(ball3);

        // var ball4 = new CircleActor();
        // ball4.color = "gray";
        // ball4.shape.x = 250;
        // ball4.shape.y = 70;
        // ball4.shape.width = 3;
        // ball4.relationBody = this.relationBody;
        // ball4.move(4,1);
        // this.renderer.addObject(ball4);

        for ( var i = 0 ; i <5; i++)
        {
            var circleBody1 = new CircleBody();
            circleBody1.shape.x = 50 + i* 150 +10;
            circleBody1.shape.y = 400;
            circleBody1.shape.width = 50;
            circleBody1.color= "yellow";
            this.relationBody.push(circleBody1);
            this.renderer.addObject(circleBody1);
            this.reletionBody2.push(circleBody1)        
        }
        // Rect(0,0,Resource.width,Resource.height)
        
        var box3 = new TestBody();
        box3.color = "#F21";
        box3.shape = new Rect(0,0,Resource.width,Resource.height);
        this.relationBody.push(box3);
        this.reletionBody2.push(box3);
        this.renderer.addObject(box3);
        
        wireLine = new RayCastVectorBody();//new Point(0,0), new Point(10,10));
        var vector1= new VectorBody(new Point(500,400),140,200);
        wireLine.vector = vector1;
        wireLine.color = "red";
        wireLine.relationBody =this.reletionBody2;
        //this.relationBody.push(wireLine);
        this.renderer.addObject(wireLine);
        document.addEventListener("keydown",this.OnKeyDown);
        
        this.start();
    }

    OnKeyDown(evt:KeyboardEvent) : any{
    }
}
class CircleActor extends CircleBody {
    relationBody :RBody[]=[];
    velocityX = 0;
    velocityY = 0;    
    update(){
        
        //this.velocityY += 9.8/60;

        var lines : Line[] =[];
        for (var i = 0 ; i < this.relationBody.length ; i++)
        {
            if (this.relationBody[i] != this)
                getLineBody(this.relationBody[i],lines);
        }
        
        var circlebodies : CircleBody[] = [];

        for (var i = 0 ; i < this.relationBody.length ; i++){
            
            if (this.relationBody[i] instanceof CircleBody)
                if (this.relationBody[i] != this)
                 circlebodies.push(this.relationBody[i]);
        }
        
        var vector = this.getVector();
        var angle = vector.angle;
        var endPoint = MathUtil.getEndPoint(vector.position,vector.angle,vector.distance+ this.shape.width)
        var endPoint2 = MathUtil.getEndPoint(vector.position,vector.angle,vector.distance+ this.shape.width+ 500)
        var startPoint = new Point(this.shape.x,this.shape.y);
        //wireLine.startPos = startPoint;
        //wireLine.endPos = endPoint2;
        //wireLine.vector.position.x = this.shape.x;
        //wireLine.vector.position.y = this.shape.y;
        wireLine.vector = this.getVector();
        wireLine.vector.distance += 1250;;

        
        //wireLine.updatePoint();
        for ( let i = 0; i < circlebodies.length; i++)
        {
            let index = i;
            let element = circlebodies[i];
            let collision = CollisionTester.CollisionCircle(this, element);
            let st = new Point(this.shape.x, this.shape.y);
            let dt = new Point(element.shape.x,element.shape.y)
            let distance = MathUtil.getDistance(new Point(this.shape.x, this.shape.y), new Point(element.shape.x,element.shape.y)) ;
            let rr = this.shape.width + element.shape.width
            if (collision)
            {
                var interpoints : Point[] = [];
                var distances : number [] = [];
                var centerpos =  new Point(element.shape.x, element.shape.y);
                var circlepoints = MathUtil.circlelineintersection(centerpos, element.shape.width,startPoint,endPoint);
                var minx = startPoint.x < endPoint.x ? startPoint.x : endPoint.x;
                var maxx = startPoint.x > endPoint.x ? startPoint.x : endPoint.x;
                var miny = startPoint.y < endPoint.y ? startPoint.y : endPoint.y;
                var maxy = startPoint.y > endPoint.y ? startPoint.y : endPoint.y;
                for( var j = 0 ; j < circlepoints.length; j++){
                    var ppoint = circlepoints[j];
                    if (ppoint.x > minx && ppoint.x < maxx && ppoint.y > miny && ppoint.y < maxy){

                        interpoints.push(circlepoints[j]);

                        var dist = MathUtil.getDistance(startPoint,ppoint);                
                        distances.push(dist);
                    }
                    else if (minx == maxx)
                    {
                        interpoints.push(circlepoints[j]);

                        var dist = MathUtil.getDistance(startPoint,ppoint);                
                        distances.push(dist);
                    }

                    var min = Number.MIN_VALUE;
                    var minIndex = 0;
                    distances.forEach( (element,index) => {
                        if (min > element){
                            minIndex = index;
                        }
                    });
                    
                    if (interpoints.length > 0){
                        
                        // console.log("circlebodies : ", circlebodies.length)
                        var newpoint :Point= interpoints[minIndex];
                        var linevect =  MathUtil.subjectPoint(startPoint,endPoint);                
                        
                        var linedgree =  MathUtil.toDegrees(Math.atan2(-linevect.y,linevect.x));

                        var subp1 = MathUtil.subjectPoint(centerpos,newpoint);
                        var guideStart = new Point(startPoint.x + subp1.x , startPoint.y + subp1.y);
                        var subp2 = MathUtil.subjectPoint(centerpos,guideStart)
                        var d3angle =linedgree-MathUtil.get3PointDegree(subp1.x,subp1.y,subp2.x,subp2.y)*2;

                        var subdistanc = MathUtil.getDistance(newpoint,startPoint);
                        angle = d3angle;
                        var velocity =  MathUtil.getEndPoint(new Point(),angle,vector.distance);
                        this.velocityX = velocity.x;
                        this.velocityY = velocity.y;
                    }
                }
                // let newAngle = getAngle(st,dt)
                // distanceText.color = "red";
                // var velocity =  MathUtil.getEndPoint(new Point(),newAngle,vector.distance);
                // this.velocityX = velocity.x;
                // this.velocityY = velocity.y;
                //this.velocityX = 0;
                //this.velocityY=0;
                break;
            }
            else
                distanceText.color = "white";
            distanceText.text = distance + ":" + rr;
        }

        // var vector = this.getVector();
        // var angle = vector.angle;
        // // var lastLine = null;
        // var newangle = 0;
        // var collision = false;
        // var endPoint = MathUtil.getEndPoint(vector.position,vector.angle,vector.distance)
        // // var collision = CollisionTester.checkintersection(lines,vector.position,endPoint, lastLine,function(point:Point, line:LineBody){
        // //     var p = MathUtil.subjectPoint(line.startPos,line.endPos);
        // //     var lineangle = Math.abs(MathUtil.toDegrees(Math.atan2(p.y,p.x)));
        // //     lastLine = line;
        // //     newangle = angle + (lineangle - angle)*2
        // //});
        // // if ( circlebodies.length > 0)
        // //     console.log("circle bodies :  " , circlebodies)
        
        // // CollisionTester.validCircleToLine(circlebodies,vector.position,endPoint,function(newpoint,angle,subdistance){
        // //       collision = newpoint;
        // //       newangle = angle;
        // //       console.log("valid")
        // // })
        

        // if (collision)
        // {
        //     // console.log("collistion")
        //     angle = newangle;
        //     var velocity =  MathUtil.getEndPoint(new Point(),angle,vector.distance);
        //     this.velocityX = velocity.x;
        //     this.velocityY = velocity.y;

        // }
    }

    getVector() : Vector{
        var vector = new Vector(this.shape);
        vector.angle = MathUtil.toDegrees(Math.atan2(-this.velocityY,this.velocityX));
        vector.distance =  MathUtil.getDistance(new Point(),new Point(this.velocityX,this.velocityY));
        this.angle = vector.angle;
        return vector;
    }

    move (x:number,y:number){
        this.velocityX = x;
        this.velocityY = y;
        var animate = new MoveAnimate();
        animate.data = this;
        animate.callback = function(data:CircleActor){
            
            var left =  data.shape.x - data.shape.width;
            var right = data.shape.x + data.shape.width;
            var top = data.shape.y - data.shape.width;
            var buttom = data.shape.y + data.shape.width;
            var rect = new Rect(left,top,data.shape.width*2,data.shape.width*2);
            var collistion = false;
            Resource.worldRect.collisionTest(rect,function(direction){
                collistion = true;
                switch(direction){
                    case "left":
                        data.velocityX = -data.velocityX;
                        break;
                    case "right":
                        data.velocityX = -data.velocityX;
                        break;
                    case "top":
                        data.velocityY = -data.velocityY;
                        break;
                    case "bottom":
                        data.velocityY = -data.velocityY;
                        break;                    
                    default:
                        data.update();
                        break;
                }
            });
            if (!collistion)
                data.update();
            data.shape.x += data.velocityX;
            data.shape.y += data.velocityY;
        };
        animate.start();
    }
}


var tester  = new Tester();

    