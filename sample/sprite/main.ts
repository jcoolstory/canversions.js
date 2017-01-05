/// <reference path="main.d.ts" />

enum Controlmode {
    None,AddObject,
}

class Tester {
    ctx :Canvas2D= null;
    imageUrl1 = "../../image/imagetest.png";
    spriteImageUrl1 = "../../image/spriteimage.png";
    background = "../../image/background.png";
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
        
        var backgroundSprite = new ScrollSprite();
        backgroundSprite.image =  new Bitmap(Resource[this.background]);
        backgroundSprite.region = new Rect(0,0,Resource.width,Resource.height);
        var hratio =  backgroundSprite.image.height/ Resource.height  ;
        
        backgroundSprite.view = new Rect(0,0,backgroundSprite.image.width * hratio, backgroundSprite.image.height);
        this.renderer.addObject(backgroundSprite);        
        var testBitmap = new Bitmap(Resource[this.imageUrl1]);

        for (var i = 0 ; i < 10 ; i++){
            var x = MathUtil.randomInt( Resource.width);
            var y = MathUtil.randomInt(Resource.height);
            var testBody = new TestBody();
            testBody.shape = new Rect(x,y,100,100);
                
            testBody.image =testBitmap;
            testBody.render(this.ctx);
            var moveX =  Math.random();
            var moveY = Math.random();
            testBody.move(moveX,moveY);
            this.renderer.addObject(testBody);
        }

        var image1 : any =  Resource[this.spriteImageUrl1];
        var spriteImage = new SpriteBitmap(image1,[new Rect(0,0,512,256),new Rect(512,0,512,256), new Rect(0,256,512,256),new Rect(512,256,512,256),new Rect(0,512,512,256),new Rect(512,512,512,256)])
        this.spriteBody = new Cat();
        this.spriteBody.image = spriteImage;
        this.spriteBody.shape = new Rect(100,300,256,128);
        this.renderer.addObject(this.spriteBody);
        
        document.addEventListener("keydown",this.OnKeyDown.bind(this));

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

class CircleActor extends CircleBody {
    relationBody :Body[];
    velocityX = 0;
    velocityY = 0;
    update(){
        var lines : Line[] =[];
        for (var i = 0 ; i < this.relationBody.length ; i++)
            getLineBody(this.relationBody[i],lines);

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

    