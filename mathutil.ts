
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
}
