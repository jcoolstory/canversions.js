/// <reference path="main.d.ts" />

enum Controlmode {
    None,AddObject,
}

class Tester {
    ctx :Canvas2D= null;
    imageUrl1 = "imagetest.png";
    spriteImageUrl1 = "spriteimage.png";
    spriteBody :Cat ;
    vector : VectorBody;
    renderer: Renderer;
    mousePressed :boolean= false;
    status : Controlmode = Controlmode.None;
    lineActor : LineBody;
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
        }
    }

    onmousemove(event:MouseEvent){
        if (this.mousePressed){
            this.lineActor.endPos = new Point(event.x,event.y);
        }
    }

    onmouseup(evnt:MouseEvent){
        this.onmouseup;
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
        
        var image:any = Resource[this.imageUrl1];
        var testBitmap = new Bitmap(image);
        for (var i = 0 ; i < 10 ; i++){
            var x = MathUtil.randomInt( Resource.width);
            var y = MathUtil.randomInt(Resource.height);
            var testBody = new TestBody();
            testBody.shape = new Rect(x,y,100,100);
            //testBody.debugging = true;
                
            testBody.image =testBitmap;
            testBody.render(this.ctx);
            var moveX =  Math.random();
            var moveY = Math.random();
            testBody.move(moveX,moveY);
        // renderer.addObject(testBody);
        }

        var image1 : any =  Resource[this.spriteImageUrl1];
        var spriteImage = new SpriteBitmap(image1,[new Rect(0,0,512,256),new Rect(512,0,512,256), new Rect(0,256,512,256),new Rect(512,256,512,256),new Rect(0,512,512,256),new Rect(512,512,512,256)])
        this.spriteBody = new Cat();
        this.spriteBody.image = spriteImage;
        this.spriteBody.shape = new Rect(400,400,256,128);
    // renderer.addObject(spriteBody);
        var line = new LineBody(new Point(0,0), new Point(Resource.width/2, Resource.height/2));
        var wedge = new PolygonBody();
        
        wedge.setPoints([500,300,600,300,600,200,400,200,500,300]);    

        this.vector = new VectorBody(new Point(200,200),-30,1000);
        
        var box = new TestBody();
        box.color = "#00F";
        box.shape = new Rect(307,316,500,300);
        this.renderer.addObject(box);
        var polygon = new RayCastVectorBody();
        polygon.vector = this.vector;
        polygon.relationBody = [box,wedge];
        this.renderer.addObject(polygon);
        this.vector.startRotate();
        //renderer.addObject(vector);
        this.renderer.addObject(wedge);
        // renderer.addObject(line);
        
        //var PolygonBody : PolygonBody = new PolygonBody

        //renderer.refresh();
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