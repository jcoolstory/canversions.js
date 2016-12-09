/// <reference path="main.d.ts" />
var ctx :Canvas2D= null;
var imageUrl1 = "imagetest.png";
var spriteImageUrl1 = "spriteimage.png";
var spriteBody = new SpriteBody();
var vector : VectorBody;
var renderer: Renderer;

function init(){
    
    var c  = <HTMLCanvasElement> document.getElementById("canvas");
    Resource.width = c.width;
    Resource.height = c.height;   
    Resource.worldRect = new Rect(0,0,Resource.width,Resource.height); 
    ctx  = <Canvas2D> c.getContext("2d");
    ctx.width = c.width;
    ctx.height = c.height;
    //woldRectangle = new Rect(0,0,width,height);
    Resource.Images.push(imageUrl1);
    Resource.Images.push(spriteImageUrl1);
    Resource.OnFinishedLoad = function(){
        initBodies();
    }
    Resource.load();
    renderer = new Renderer();
    
    renderer.canvas = ctx;
    renderer.addMouseEvent(c);    
}


function start(){
    renderer.start();
}
function stop(){
    renderer.stop();
}
function initBodies(){
    
    var image:any = Resource[imageUrl1];
    var testBitmap = new Bitmap(image);
    for (var i = 0 ; i < 10 ; i++){
        var x = MathUtil.randomInt( Resource.width);
        var y = MathUtil.randomInt(Resource.height);
        var testBody = new TestBody();
        testBody.shape = new Rect(x,y,100,100);
        //testBody.debugging = true;
            
        testBody.image =testBitmap;
        testBody.render(ctx);
        var moveX =  Math.random();
        var moveY = Math.random();
        testBody.move(moveX,moveY);
        renderer.addObject(testBody);
    }

    var image1 : any =  Resource[spriteImageUrl1];
    var spriteImage = new SpriteBitmap(image1,[new Rect(0,0,512,256),new Rect(512,0,512,256), new Rect(0,256,512,256),new Rect(512,256,512,256),new Rect(0,512,512,256),new Rect(512,512,512,256)])

    spriteBody.image = spriteImage;
    spriteBody.shape = new Rect(400,400,256,128);
    renderer.addObject(spriteBody);
    var line = new LineBody(new Point(0,0), new Point(Resource.width/2, Resource.height/2));
    var wedge = new PolygonBody();
    wedge.setPoints([10,10,30,10,40,20,50,150,20,60]);

    vector = new VectorBody(new Point(200,200),-30,200);
    
    var box = new TestBody();
    box.color = "#00F";
    box.shape = new Rect(150,150,200,100);
    renderer.addObject(box);
    var polygon = new RayCastVectorBody();
    polygon.vector = vector;
    polygon.relationBody = box;
    renderer.addObject(polygon);
    vector.startRotate();
    //renderer.addObject(vector);
    // renderer.addObject(wedge);
    // renderer.addObject(line);
    spriteBody.run();
    renderer.refresh();
    document.addEventListener("keydown",OnKeyDown);
}

function changeAngle(data){
    var angle = parseFloat(data);
    vector.angle = angle;
}

function OnKeyDown(evt:KeyboardEvent) : any{
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
            spriteBody.jump();
            break;
    }
}