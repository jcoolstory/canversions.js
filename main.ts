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

    var line = new LineBody(new Point(0,0), new Point(Resource.width/2, Resource.height/2));
    var wedge = new PolygonBody();
    wedge.setPoints([10,10,30,10,40,20,50,150,20,60]);

    vector = new Vector(new Point(200,200),-30,340);
    vector.color = "#F00"
   // vector.startRotate();
    
    var box = new Body();
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
}

function changeAngle(data){
    var angle = parseFloat(data);
    vector.angle = angle;
}