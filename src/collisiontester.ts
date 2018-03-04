
class CollisionTester{
    static CollisionCircle(st : CircleBody, dt:CircleBody) : boolean
    {
        return MathUtil.getDistance(new Point(st.shape.x, st.shape.y), new Point(dt.shape.x, dt.shape.y)) < (st.shape.width + dt.shape.width)
    }

    static getMinDistancePoint(dp : Point, arryPoint : Point[]) : number {
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
    
    static validCircleToLine(circlebodies : CircleBody[], startPoint : Point, endPoint: Point, callback : Function){
        
        for (var i = 0 ; i <  circlebodies.length;i++){
            //
            var circle = circlebodies[i];
            
            var circlepoints = MathUtil.circlelineintersection(new Point(circle.shape.x,circle.shape.y), circle.shape.width,startPoint,endPoint);
            
            var centerpos = new Point(circle.shape.x,circle.shape.y);
            var minx = startPoint.x < endPoint.x ? startPoint.x : endPoint.x;
            var maxx = startPoint.x > endPoint.x ? startPoint.x : endPoint.x;
            var miny = startPoint.y < endPoint.y ? startPoint.y : endPoint.y;
            var maxy = startPoint.y > endPoint.y ? startPoint.y : endPoint.y;
            
            var interpoints : Point[] = [];
            var distances : number [] = [];
            for( var j = 0 ; j < circlepoints.length; j++){
                var ppoint = circlepoints[j];
                if (ppoint.x > minx && ppoint.x < maxx && ppoint.y > miny && ppoint.y < maxy){

                    interpoints.push(circlepoints[j]);

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
                // console.log("interpoints : " )
                // console.log("circlebodies : ", circlebodies.length)
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
