var ctx :Canvas2D= null;
var imageUrl = "imagetest.png";

function init(){
    var c  = <HTMLCanvasElement> document.getElementById("canvas");
    Resource.width = c.width;
    Resource.height = c.height;   
    Resource.worldRect = new Rect(0,0,Resource.width,Resource.height); 
    ctx  = <Canvas2D> c.getContext("2d");
    ctx.width = c.width;
    ctx.height = c.height;
    //woldRectangle = new Rect(0,0,width,height);
    Resource.Images.push( imageUrl);
    Resource.OnFinishedLoad = function(){
        initBodies();
    }
    Resource.load();
}

var vector : VectorBody;
var renderer: Renderer;
function start(){
    renderer.start();
}
function stop(){
    renderer.stop();
}
function initBodies(){
    renderer = new Renderer();
    
    renderer.canvas = ctx;
    
    for (var i = 0 ; i < 10 ; i++){
        var x = MathUtil.randomInt( Resource.width);
        var y = MathUtil.randomInt(Resource.height);
        var testBody = new TestBody();
        testBody.shape = new Rect(x,y,100,100);
        testBody.debugging = true;
        var image:any = Resource[imageUrl];    
        testBody.image = new Bitmap(image);
        testBody.render(ctx);
        var moveX =  Math.random();
        var moveY = Math.random();
        testBody.move(moveX,moveY);
        renderer.addObject(testBody);
    }

    var line = new LineBody(new Point(0,0), new Point(Resource.width/2, Resource.height/2));
    var wedge = new PolygonBody();
    wedge.setPoints([10,10,30,10,40,20,50,150,20,60]);

    vector = new VectorBody(new Point(200,200),-30,200);
   // vector.color = "#F00"
   // vector.startRotate();
    
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
    renderer.refresh();
}

function changeAngle(data){
    var angle = parseFloat(data);
    vector.angle = angle;
}

