
class MathUtil {
    public static randomInt =  function(max:number) : number{
        return (Math.random() * max )| 0;
    }

    public static toRadians = function(degrees) {
        return degrees * Math.PI / 180;
    };
 
    // Converts from radians to degrees.
    public static toDegrees = function(radians) {
        return radians * 180 / Math.PI;
    };

    public static lineIntersection(srt1:Point, end1:Point,srt2:Point,end2:Point, callback:Function){

        var dx_ba = end1.x - srt1.x;
        var dx_dc = end2.x - srt2.x;
        var dy_ba = end1.y - srt1.y;
        var dy_dc = end2.y - srt2.y;
        var den = dy_dc * dx_ba - dx_dc * dy_ba;

        if (den == 0)
            callback(false);

        var dy_ac = srt1.y-srt2.y;
        var dx_ac = srt1.x-srt2.x
        var ua = (dx_dc * dy_ac-dy_dc * dx_ac) / den;
        var ub = (dx_ba * dy_ac-dy_ba * dx_ac) / den;

        if ( 0 < ua && ua <1 && 0 < ub && ub <1 )
        {   
            var nx = srt1.x + dx_ba * ua;
            var ny = srt1.y + dy_ba * ua;
            callback(true,{x:nx,y:ny});
        }else{
            callback(false)
        }
    }

    public static subjectPoint(sp:Point, ep:Point) : Point{
        return {
            x:sp.x - ep.x,
            y:sp.y - ep.y
        }
    }
    
    public static getEndPoint(point:Point,angle:number,distance:number) : Point{
        var x = Math.cos(MathUtil.toRadians(angle)) * distance;
        var y = -Math.sin(MathUtil.toRadians(angle)) * distance;                           
        return { x: point.x + x, y:point.y+y};
    }

    public static getDistance(sp:Point,ep:Point) : number{            
        return Math.sqrt(Math.pow(sp.x - ep.x,2) + Math.pow(sp.y - ep.y,2));
    }

    public static get3PointDegree(x1 : number, y1: number, x2: number,y2: number){
        return MathUtil.toDegrees(Math.atan2(y1*x2-x1*y2, x1*x2+y1*y2));
    }

    
    public static circlelineintersection(p1:Point,r:number,p2:Point,p3:Point) : Array<Point> {

        var x = p1.x;
        var y = p1.y;

        var a = p2.x;
        var b = p2.y;
        var c = p3.x;
        var d = p3.y;

        if (c != a){
            var m = (d-b)/(c-a);;
            var n = (b*c-a*d)/(c-a);

            var A = m*m+1;
            var B1 = (m*n-m*y-x);
            var C = (x*x+y*y-r*r + n*n - 2 * n * y);
            var D = B1 * B1 - A*C;

            if (D<0){
                return []
            }
            else if (D==0){
                var X = -B1/A
                var Y = m*X+n
                return [new Point(X,Y)]
            }
            else {
                var X = -(B1 + Math.sqrt(D))/A
                var Y = m*X + n

                var X2 = -(B1 - Math.sqrt(D))/A
                var Y2 = m*X2+n
                return [ new Point(X,Y), new Point(X2,Y2)]
            }
        }
        else {
            if (a < (x - r) || a > (x + r) ) {
                return []
            }
            else if (a == (x-r) || a ==(x+r)){
                var X=a;
                var Y=y;
                return [new Point(X,Y)]
            }
            else {
                var X = a
                var Y = y + Math.sqrt( r * r - (a-x)*(a-x))
                
                var Y1 = y - Math.sqrt( r * r - (a-x)*(a-x))

                return [new Point(X,Y), new Point(X,Y1)]
            }
        }
    }

}
