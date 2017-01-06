
class CollisionTester{
    
    static getMinDistancePoint(dp : Point, arryPoint : Point[]){
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

    static checkintersection(lines:Line[], spoint:Point,epoint:Point,ignore:Line, resultF : Function): Point{
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
            var minIndex =  CollisionTester.getMinDistancePoint(spoint,interPoints);
            resultPoint = interPoints[minIndex];
            resultF(resultPoint,interLines[minIndex]);
        }

        return resultPoint;
    } 

    static validCircle(circlebodies : CircleBody[], startPoint : Point, endPoint: Point, callback : Function){
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

    // public bodies : Body[] = []
    // public world : Rect ;  
    // public checkBody(body:MoveAnimate,callback:Function){
    //     var opposite : Body; 
    //     var lines =  this.GetEdgeLine(this.world);
    // }

    // private GetEdgeLine(rect:Rect): Line[]{
    //     var pos : Point[] = [];
    //     pos.push(new Point(rect.x, rect.y));
    //     pos.push(new Point(rect.x + rect.width, rect.y));
    //     pos.push(new Point(rect.x + rect.width, rect.y+ rect.height));
    //     pos.push(new Point(rect.x, rect.y+ rect.height));
    //     var lines : Line[] =[];
        
    //     for(var i = 0 ; i<pos.length-1 ; i++){
    //         lines.push(new Line(pos[i], pos[i+1]));
    //     }

    //     lines.push(new Line(pos[pos.length -1 ],pos[0]));
    //     return lines;
    // }

    // private tester(object:Circle,vector:Vector,lines:Line[]){
    //     function valid(spoint:Point,epoint:Point,resultF : Function): Point{
    //         var resultPoint :Point;
    //          lines.forEach(element => {
    //             MathUtil.lineIntersection(spoint,epoint, element.startPos,element.endPos, function(result,point:Point){
    //                 if (result){
    //                     resultPoint = point;
    //                     resultF(resultPoint, element);
    //                     return;
    //                 }
    //             })
    //         });
    //         return resultPoint;
    //     }
        
    //     var startPoint = vector.position;
    //     var angle = vector.angle;
    //     var distance = vector.distance;
    //     var endpoint = MathUtil.getEndPoint(startPoint,angle,distance);
    //     valid(startPoint,endpoint,function(result:boolean,line:Line){
    //         var p = MathUtil.subjectPoint(line.startPos,line.endPos);
    //         var lineangle = MathUtil.toDegrees(Math.atan2(p.y,p.x));
    //         var newangle = angle + (lineangle - angle)*2
    //         vector.angle = newangle;
    //     });
    // }

}
