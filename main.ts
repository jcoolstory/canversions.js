/// <reference path="main.d.ts" />

enum Controlmode {
    None,AddObject,
}

class Tester {
    ctx :Canvas2D= null;
    imageUrl1 = "./image/imagetest.png";
    spriteImageUrl1 = "./image/spriteimage.png";
    background = "./image/background.png";
    spriteBody :Cat ;
    vector : VectorBody;
    renderer: Renderer;
    mousePressed :boolean= false;
    status : Controlmode = Controlmode.None;
    lineActor : LineBody;
    polygon : RayCastVectorBody;
    init(){
        
        var c  = <HTMLCanvasElement> document.getElementById("canvas");
        Resource.width = c.width;
        Resource.height = c.height;   
        Resource.worldRect = new Rect(0,0,Resource.width,Resource.height); 
        this.ctx  = <Canvas2D> c.getContext("2d");
        this.ctx.width = c.width;
        this.ctx.height = c.height;
        //woldRectangle = new Rect(0,0,width,height);
        Resource.Images.push(this.imageUrl1);
        Resource.Images.push(this.spriteImageUrl1);
        Resource.Images.push(this.background);
        Resource.OnFinishedLoad = function(){
            this.initBodies();
        }.bind(this)
        Resource.load();
        this.renderer = new Renderer();
        
        this.renderer.canvas = this.ctx;
        this.renderer.addMouseEvent(c);

        c.addEventListener("mousedown",this.onmousedown.bind(this));
        c.addEventListener("mousemove",this.onmousemove.bind(this));
        c.addEventListener("mouseup",this.onmouseup.bind(this));    
    }

    onmousedown(event:MouseEvent){
        this.mousePressed = true;
        if (this.status == Controlmode.AddObject){
            var P : Point =  new Point(event.x,event.y);            
            this.lineActor = new LineBody(P,P);
            this.lineActor.color = "#F00";
        }
    }

    onmousemove(event:MouseEvent){
        if (this.mousePressed){
            if (this.status == Controlmode.AddObject){
                this.lineActor.endPos = new Point(event.x,event.y);
            }
        }
    }

    onmouseup(evnt:MouseEvent){
        
        this.mousePressed = false;;
        if (this.status == Controlmode.AddObject){
            this.lineActor.updatePoint();
            this.renderer.addObject(this.lineActor);
            this.polygon.relationBody.push(this.lineActor);
                console.log(this.lineActor)
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
        this.spriteBody.run();    
    }
    stop(){
        this.renderer.stop();
    }
    initBodies(){
        
        var testBitmap = new Bitmap(Resource[this.imageUrl1]);
        // for (var i = 0 ; i < 10 ; i++){
        //     var x = MathUtil.randomInt( Resource.width);
        //     var y = MathUtil.randomInt(Resource.height);
        //     var testBody = new TestBody();
        //     testBody.shape = new Rect(x,y,100,100);
                
        //     testBody.image =testBitmap;
        //     testBody.render(this.ctx);
        //     var moveX =  Math.random();
        //     var moveY = Math.random();
        //     testBody.move(moveX,moveY);
        // }

        var backgroundSprite = new ScrollSprite();
        backgroundSprite.image =  new Bitmap(Resource[this.background]);
        backgroundSprite.region = new Rect(0,0,Resource.width,Resource.height);
        var hratio =  backgroundSprite.image.height/ Resource.height  ;
        
        backgroundSprite.view = new Rect(0,0,backgroundSprite.image.width * hratio, backgroundSprite.image.height);
        //this.renderer.addObject(backgroundSprite);


        var image1 : any =  Resource[this.spriteImageUrl1];
        var spriteImage = new SpriteBitmap(image1,[new Rect(0,0,512,256),new Rect(512,0,512,256), new Rect(0,256,512,256),new Rect(512,256,512,256),new Rect(0,512,512,256),new Rect(512,512,512,256)])
        this.spriteBody = new Cat();
        this.spriteBody.image = spriteImage;
        this.spriteBody.shape = new Rect(400,400,256,128);
    // renderer.addObject(spriteBody);
        var line = new LineBody(new Point(0,0), new Point(Resource.width/2, Resource.height/2));
        var wedge = new PolygonBody();
        
        wedge.setPoints([500,300,600,300,600,200,400,200,500,300]);    

        
        
        var box = new TestBody();
        box.color = "#00F";
        box.shape = new Rect(307,316,500,300);
        this.renderer.addObject(box);
        //this.vector = new VectorBody(new Point(200,200),-30,5000);
        var anlearray = [-30,30,45,90,100,140,200,240,300,330]
        var relationBody : Body[]= [box,wedge];
        for (var i= 0 ; i < 10; i++){
            var vector= new VectorBody(new Point(200,200),anlearray[i],500);
            var polygon = new RayCastVectorBody();
            polygon.vector = vector;
            polygon.relationBody = relationBody;
           this.renderer.addObject(polygon);
            vector.startRotate();
        }

          var vector1= new VectorBody(new Point(500,400),140,200);
            var polygon1 = new RayCastVectorBody();
            polygon1.vector = vector1;
            polygon1.relationBody = relationBody;
            this.renderer.addObject(polygon1);
            //vector.startRotate();

        this.polygon = polygon;

        //this.vector.startRotate();
        //renderer.addObject(vector);
        this.renderer.addObject(wedge);
        // renderer.addObject(line);
        
        //var PolygonBody : PolygonBody = new PolygonBody

        //renderer.refresh();

        var circleBody  = new CircleActor();
        circleBody.shape.x = 500;
        circleBody.shape.y = 400;
        circleBody.shape.width = 5;        
        circleBody.color = "red";
        circleBody.relationBody = relationBody;
        circleBody.move(5,-2);

        var circleBody1 = new CircleBody();
        circleBody1.shape.x = 500;
        circleBody1.shape.y = 100;
        circleBody1.shape.width = 50;
        circleBody1.color= "blue";
        relationBody.push(circleBody1);
        this.renderer.addObject(circleBody1)

        var lines = new LineBody(new Point(102,102), new Point(105,170));
        lines.color = "red";
        this.renderer.addObject(lines);
        //this.renderer.addObject(circleBody);
        
        var points =  MathUtil.circlelineintersection(new Point(circleBody1.shape.x,circleBody1.shape.y), circleBody1.shape.width,lines.startPos,lines.endPos);

        for( var i = 0 ; i < points.length; i++){
            var vertex1 = new CircleBody();
            vertex1.shape.x = points[i].x;
            vertex1.shape.y = points[i].y;
            vertex1.shape.width = 1;
            vertex1.color = "yellow"    
            this.renderer.addObject(vertex1);
        }


        var line2 = new LineBody(new Point(200,200), new Point(225,125));
        line2.color = "yellow";

        var vertex3 = new CircleBody();
        vertex3.shape.x = 200;
        vertex3.shape.y = 10;
        vertex3.shape.width = 1;
        vertex3.color = "yellow";
        this.renderer.addObject(line2);
        this.renderer.addObject(vertex3);
        document.addEventListener("keydown",this.OnKeyDown);

        this.start();
    }

    changeAngle(data){
        var angle = parseFloat(data);
        this.vector.angle = angle;
    }

    OnKeyDown(evt:KeyboardEvent) : any{
        switch(evt.code){
            case "ArrowUp":
                
                break;
            case "ArrowDown":
                
                break;
            case "ArrowLeft":
                
                break;
            case "ArrowRight":
                
                break;
            case "Space":
                this.spriteBody.jump();
                break;
        }
    }
}
class CircleActor extends CircleBody {
    relationBody :Body[];
    velocityX = 0;
    velocityY = 0;
    update(){
        var lines : Line[] =[];
        for (var i = 0 ; i < this.relationBody.length ; i++)
            getLineBody(this.relationBody[i],lines);

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
        
        function valid(spoint:Point,epoint:Point,ignore:Line, resultF : Function): Point{
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

        var vector = this.getVector();
        var angle = vector.angle;
        var lastLine = null;
        var newangle = 0;
        var endPoint = MathUtil.getEndPoint(vector.position,vector.angle,vector.distance)
        var collision = valid(vector.position,endPoint, lastLine,function(point:Point, line:LineBody){
            var p = MathUtil.subjectPoint(line.startPos,line.endPos);
            var lineangle = Math.abs(MathUtil.toDegrees(Math.atan2(p.y,p.x)));
            lastLine = line;
            newangle = angle + (lineangle - angle)*2
        });

        if (collision)
        {
            angle = newangle;
            var velocity =  MathUtil.getEndPoint(new Point(),angle,vector.distance);
            this.velocityX = velocity.x;
            this.velocityY = velocity.y;
        }
    }

    getVector() : Vector{
        var vector = new Vector(this.shape,this.shape.y);
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
            data.update();
            var left =  data.shape.x - data.shape.width;
            var right = data.shape.x + data.shape.width;
            var top = data.shape.y - data.shape.width;
            var buttom = data.shape.y + data.shape.width;
            var rect = new Rect(left,top,data.shape.width*2,data.shape.width*2);

            Resource.worldRect.collisionTest(rect,function(direction){
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
                }
            });
            
            data.shape.x += data.velocityX;
            data.shape.y += data.velocityY;
        };
        animate.start();
    }
}

class Cat extends SpriteBody{
        isRun = false;
        public run(){
            if (this.isRun)
                return
            var animate = new SpriteAction(this.image,500);        
            animate.start();
            this.currentAnimation = animate;
            this.isRun = true;
        }

        public jump(){
            if (this.currentAnimation){
                console.log(this.currentAnimation)
                this.currentAnimation.stop();
            }
            var _this = this; 
            this.image.currentIndex = 0;
            class tempJump extends JumpAction{
                stop(){
                    super.stop();
                    _this.run();
                }
            }
            var jump = new tempJump(_this,-1,true);
            jump.start();
            this.currentAnimation = jump;
            this.isRun = false;
        }
    }

class JumpAction extends Action{
    offset : number = 0;
    up:boolean = true;
    height : number = 50;
    frame : number = 30;
    callback = function(obj:JumpAction,data:SpriteBody,count:number){
        
        if (obj.up)
        {
            obj.offset++;
            data.shape.y--;
            data.angle = 100;                    
        }
        else
        {
            obj.offset--;
            data.shape.y++;
            data.angle = 0;
        }

        if (obj.offset > obj.height)
            obj.up = false;
        
        if (obj.offset < 0){
            data.angle = 0;
            return true;                    
        }
    }
    stop(){
        super.stop();
    }
}

var tester  = new Tester();

    