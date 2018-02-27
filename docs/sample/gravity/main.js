var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Canvas2D = /** @class */ (function (_super) {
    __extends(Canvas2D, _super);
    function Canvas2D() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.width = 1;
        _this.height = 1;
        return _this;
    }
    return Canvas2D;
}(CanvasRenderingContext2D));
var Action = /** @class */ (function () {
    function Action(data, dur, repeat) {
        if (repeat === void 0) { repeat = true; }
        this.duration = 500;
        this.repeat = true;
        this.count = 0;
        this.frame = -1;
        this.data = data;
        this.duration = dur;
        this.repeat = repeat;
    }
    Action.prototype.start = function () {
        var _this = this;
        var count = 0;
        var framerate = this.duration / this.frame;
        if (this.duration == -1)
            framerate = 1000 / 60;
        this.timer = setInterval(function () {
            if (!_this.callback)
                return;
            var isStop = _this.callback(_this, _this.data, count);
            if (isStop)
                _this.stop();
            count++;
            if (!_this.repeat && count == _this.frame) {
                _this.stop();
            }
        }, framerate);
    };
    Action.prototype.stop = function () {
        clearInterval(this.timer);
    };
    return Action;
}());
var MoveAnimate = /** @class */ (function () {
    function MoveAnimate() {
        this.timer = 0;
        this.duration = 0;
    }
    MoveAnimate.prototype.start = function () {
        var _this = this;
        this.timer = setInterval(function () {
            _this.callback(_this.data);
        }, 1000 / 60);
    };
    MoveAnimate.prototype.stop = function () {
        clearInterval(this.timer);
    };
    return MoveAnimate;
}());
var Point = /** @class */ (function () {
    function Point(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = 0;
        this.y = 0;
        this.x = x;
        this.y = y;
    }
    return Point;
}());
var Rect = /** @class */ (function (_super) {
    __extends(Rect, _super);
    function Rect(x, y, width, height) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        var _this = _super.call(this, x, y) || this;
        _this.width = 0;
        _this.height = 0;
        _this.width = width;
        _this.height = height;
        return _this;
    }
    Rect.prototype.containPoint = function (x, y) {
        if (this.x > x)
            return false;
        if (this.y > y)
            return false;
        if (this.x + this.width < x)
            return false;
        if (this.y + this.height < y)
            return false;
        return true;
    };
    Rect.prototype.containRect = function (rect) {
        if (!this.containPoint(rect.x, rect.y))
            return false;
        if (!this.containPoint(rect.x + rect.width, rect.y + rect.height))
            return false;
        return true;
    };
    Rect.prototype.collisionTest = function (rect, callback) {
        if (this.x > rect.x)
            callback("left");
        if (this.y > rect.y)
            callback("top");
        if (this.x + this.width < rect.x + rect.width)
            callback("right");
        if (this.y + this.height < rect.y + rect.height)
            callback("bottom");
    };
    return Rect;
}(Point));
var Bitmap = /** @class */ (function (_super) {
    __extends(Bitmap, _super);
    function Bitmap(image, width, height) {
        if (width === void 0) { width = image.width; }
        if (height === void 0) { height = image.height; }
        var _this = _super.call(this, 0, 0, width, height) || this;
        _this.source = null;
        _this.source = image;
        return _this;
    }
    return Bitmap;
}(Rect));
var SpriteAction = /** @class */ (function (_super) {
    __extends(SpriteAction, _super);
    function SpriteAction(data, dur, repeat) {
        if (repeat === void 0) { repeat = true; }
        var _this = _super.call(this, data, dur, repeat) || this;
        _this.frame = data.rects.length;
        _this.callback = _this.step;
        return _this;
    }
    SpriteAction.prototype.step = function (obj, dst, count) {
        dst.nextStep();
    };
    return SpriteAction;
}(Action));
var SpriteBitmap = /** @class */ (function () {
    function SpriteBitmap(image, rects) {
        this.source = null;
        this.currentIndex = 0;
        this.source = image;
        this.rects = rects;
    }
    SpriteBitmap.prototype.getImageShift = function () {
        var rect = this.getImageRect(this.currentIndex++);
        this.nextStep();
        return rect;
    };
    SpriteBitmap.prototype.nextStep = function () {
        this.currentIndex++;
        this.currentIndex = this.currentIndex % this.rects.length;
    };
    SpriteBitmap.prototype.currentImage = function () {
        return this.getImageRect(this.currentIndex);
    };
    SpriteBitmap.prototype.getImageRect = function (index) {
        return this.rects[index];
    };
    return SpriteBitmap;
}());
var PolygonBody = /** @class */ (function () {
    function PolygonBody() {
        this.color = "#FFF";
        this.points = [];
        this.shape = null;
        this.angle = 0;
        this.closedPath = true;
    }
    PolygonBody.prototype.setPoints = function (point) {
        this.points = [];
        while (point.length) {
            this.points.push(new Point(point.shift(), point.shift()));
        }
    };
    PolygonBody.prototype.render = function (canvas) {
        canvas.beginPath();
        canvas.strokeStyle = this.color;
        this.points.forEach(function (pt, index) {
            if (index == 0)
                canvas.moveTo(pt.x, pt.y);
            canvas.lineTo(pt.x, pt.y);
        });
        if (this.closedPath)
            canvas.closePath();
        canvas.stroke();
    };
    return PolygonBody;
}());
function getLineBody(body, lines) {
    if (body instanceof PolygonBody) {
        var pbody = body;
        var pos = pbody.points;
        for (var i = 0; i < pos.length - 1; i++) {
            lines.push(new Line(pos[i], pos[i + 1]));
        }
        return lines;
    }
    if (body instanceof RectBody) {
        var pos = [];
        pos.push(new Point(body.shape.x, body.shape.y));
        pos.push(new Point(body.shape.x + body.shape.width, body.shape.y));
        pos.push(new Point(body.shape.x + body.shape.width, body.shape.y + body.shape.height));
        pos.push(new Point(body.shape.x, body.shape.y + body.shape.height));
        for (var i = 0; i < pos.length - 1; i++) {
            lines.push(new Line(pos[i], pos[i + 1]));
        }
        lines.push(new Line(pos[pos.length - 1], pos[0]));
    }
    return lines;
}
var ScrollSprite = /** @class */ (function () {
    function ScrollSprite() {
        this.color = "black";
        this.view = new Rect();
        this.region = new Rect();
    }
    ScrollSprite.prototype.render = function (canvas) {
        canvas.save();
        canvas.drawImage(this.image.source, this.view.x, this.view.y, this.view.width, this.view.height, this.region.x, this.region.y, this.region.width, this.region.height);
        canvas.restore();
    };
    return ScrollSprite;
}());
var RayCastVectorBody = /** @class */ (function (_super) {
    __extends(RayCastVectorBody, _super);
    function RayCastVectorBody() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.vertexes = [];
        _this.guideLine = [];
        return _this;
    }
    RayCastVectorBody.prototype.render = function (canvas) {
        this.vertexes = [];
        this.guideLine = [];
        this.closedPath = false;
        this.updateVector();
        _super.prototype.render.call(this, canvas);
        for (var i = 0; i < this.vertexes.length; i++) {
            this.vertexes[i].render(canvas);
        }
        canvas.setLineDash([5, 15]);
        for (var i = 0; i < this.guideLine.length; i++) {
            this.guideLine[i].render(canvas);
        }
        canvas.setLineDash([]);
    };
    RayCastVectorBody.prototype.converttonumarray = function (point) {
        var array = [];
        point.forEach(function (el) {
            array.push(el.x, el.y);
        });
        return array;
    };
    RayCastVectorBody.prototype.updateVector = function () {
        var points = [this.vector.position];
        var lines = [];
        for (var i = 0; i < this.relationBody.length; i++)
            getLineBody(this.relationBody[i], lines);
        var circlebodies = [];
        for (var i = 0; i < this.relationBody.length; i++) {
            if (this.relationBody[i] instanceof CircleBody)
                circlebodies.push(this.relationBody[i]);
        }
        var startPoint = this.vector.position;
        var angle = this.vector.angle;
        var distance = this.vector.distance;
        var lastLine = null;
        while (true) {
            var newangle = 0;
            var endPoint = MathUtil.getEndPoint(startPoint, angle, distance);
            var midlePoint = CollisionTester.checkintersection(lines, startPoint, endPoint, lastLine, function (point, line) {
                var p = MathUtil.subjectPoint(line.startPos, line.endPos);
                var lineangle = Math.abs(MathUtil.toDegrees(Math.atan2(p.y, p.x)));
                lastLine = line;
                newangle = angle + (lineangle - angle) * 2;
            });
            if (midlePoint) {
                points.push(midlePoint);
                var dist = MathUtil.getDistance(startPoint, midlePoint);
                startPoint = midlePoint;
                angle = newangle;
                distance -= dist;
            }
            else {
                break;
            }
        }
        CollisionTester.validCircleToLine(circlebodies, startPoint, endPoint, function (newpoint, angle, subdistance) {
            distance -= subdistance;
            endPoint = MathUtil.getEndPoint(newpoint, angle, distance);
            points.push(newpoint);
        });
        points.push(endPoint);
        var vbuffer = this.converttonumarray(points);
        this.setPoints(vbuffer);
    };
    return RayCastVectorBody;
}(PolygonBody));
var Vector = /** @class */ (function () {
    function Vector(point, angle, distance) {
        if (angle === void 0) { angle = 0; }
        if (distance === void 0) { distance = 1; }
        this.position = new Point();
        this.angle = 0;
        this.distance = 1;
        this.position = point;
        this.angle = angle;
        this.distance = distance;
    }
    return Vector;
}());
var VectorBody = /** @class */ (function (_super) {
    __extends(VectorBody, _super);
    function VectorBody(point, angle, distance) {
        if (angle === void 0) { angle = 0; }
        if (distance === void 0) { distance = 1; }
        var _this = _super.call(this, point, angle, distance) || this;
        _this.color = "#FFF";
        return _this;
    }
    VectorBody.prototype.startRotate = function () {
        var animate = new MoveAnimate();
        animate.data = this;
        var roff = Math.random() / 2 - 0.5 / 2;
        animate.callback = function (data) {
            data.angle += roff;
        };
        animate.start();
    };
    VectorBody.prototype.render = function (canvas) {
        canvas.save();
        canvas.strokeStyle = this.color;
        canvas.beginPath();
        canvas.moveTo(this.position.x, this.position.y);
        var x = Math.cos(MathUtil.toRadians(this.angle)) * this.distance;
        var y = -Math.sin(MathUtil.toRadians(this.angle)) * this.distance;
        canvas.lineTo(this.position.x + x, this.position.y + y);
        canvas.stroke();
        canvas.restore();
    };
    return VectorBody;
}(Vector));
var Line = /** @class */ (function () {
    function Line(sp, ep) {
        this.startPos = sp;
        this.endPos = ep;
    }
    return Line;
}());
var LineBody = /** @class */ (function (_super) {
    __extends(LineBody, _super);
    function LineBody(start, end) {
        var _this = _super.call(this) || this;
        _this.startPos = start;
        _this.endPos = end;
        _this.updatePoint();
        return _this;
    }
    LineBody.prototype.updatePoint = function () {
        this.setPoints([this.startPos.x, this.startPos.y, this.endPos.x, this.endPos.y]);
    };
    return LineBody;
}(PolygonBody));
var Renderer = /** @class */ (function () {
    function Renderer() {
        this.backgroundColor = "#000";
        this.objects = [];
        this.timer = 0;
        this.canvas = undefined;
        this.frameRate = 60;
        this.offset = new Point();
    }
    Renderer.prototype.addObject = function (object) {
        this.objects.push(object);
    };
    Renderer.prototype.removeObject = function (object) {
        var index = this.objects.indexOf(object);
        if (index > -1)
            this.objects.splice(index, 1);
    };
    Renderer.prototype.render = function (canvas) {
        canvas.lineWidth = 1;
        var oldfillStyle = canvas.fillStyle;
        canvas.fillStyle = this.backgroundColor;
        canvas.fillRect(0, 0, Resource.width, Resource.height);
        canvas.fillStyle = oldfillStyle;
        this.objects.forEach(function (element) {
            element.render(canvas);
        });
    };
    Renderer.prototype.start = function () {
        var _this = this;
        this.timer = setInterval(function () {
            _this.render(_this.canvas);
        }, 1000 / this.frameRate);
    };
    Renderer.prototype.stop = function () {
        clearInterval(this.timer);
    };
    Renderer.prototype.refresh = function () {
        this.render(this.canvas);
    };
    return Renderer;
}());
var RBody = /** @class */ (function () {
    function RBody() {
        this.color = "#000";
        this.shape = new Rect();
        this.angle = 0;
    }
    RBody.prototype.render = function (canvas) {
    };
    return RBody;
}());
var Circle = /** @class */ (function () {
    function Circle() {
        this.radius = 0;
    }
    return Circle;
}());
var CircleBody = /** @class */ (function (_super) {
    __extends(CircleBody, _super);
    function CircleBody() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CircleBody.prototype.render = function (canvas) {
        canvas.save();
        canvas.translate(this.shape.x, this.shape.y);
        canvas.beginPath();
        canvas.strokeStyle = this.color;
        canvas.arc(0, 0, this.shape.width, 0, 2 * Math.PI, false);
        canvas.stroke();
        canvas.fillStyle = this.color;
        canvas.fill();
        //canvas.strokeRect(this.shape.x,this.shape.y,3,3)
        canvas.restore();
    };
    return CircleBody;
}(RBody));
var SpriteBody = /** @class */ (function (_super) {
    __extends(SpriteBody, _super);
    function SpriteBody() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.image = null;
        return _this;
    }
    SpriteBody.prototype.render = function (canvas) {
        canvas.save();
        canvas.translate(this.shape.x + this.shape.width / 2, this.shape.y + this.shape.height / 2);
        canvas.rotate(this.angle);
        canvas.translate(-this.shape.width / 2, -this.shape.height / 2);
        if (this.image) {
            var imageRegion = this.image.currentImage();
            canvas.drawImage(this.image.source, imageRegion.x, imageRegion.y, imageRegion.width, imageRegion.height, 0, 0, this.shape.width, this.shape.height);
        }
        else {
            canvas.strokeStyle = this.color;
            canvas.strokeRect(0, 0, this.shape.width, this.shape.height);
        }
        canvas.restore();
    };
    return SpriteBody;
}(RBody));
var RectBody = /** @class */ (function (_super) {
    __extends(RectBody, _super);
    function RectBody() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RectBody.prototype.render = function (canvas) {
        canvas.strokeStyle = this.color;
        canvas.beginPath();
        canvas.strokeRect(this.shape.x, this.shape.y, this.shape.width, this.shape.height);
        canvas.stroke();
    };
    return RectBody;
}(RBody));
var TextBody = /** @class */ (function (_super) {
    __extends(TextBody, _super);
    function TextBody() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TextBody.prototype.render = function (canvas) {
        canvas.fillStyle = this.color;
        if (this.text) {
            canvas.fillText(this.text, this.shape.x, this.shape.y, 100);
        }
    };
    return TextBody;
}(RectBody));
var ResourceManager = /** @class */ (function () {
    function ResourceManager() {
        this.width = 1;
        this.height = 1;
        this.Images = [];
        this.count = 0;
        this.loadedCount = 0;
    }
    ResourceManager.prototype.load = function () {
        var _this = this;
        this.count = this.Images.length;
        this.Images.forEach(function (el) {
            _this.imageLoad(el);
        });
    };
    ResourceManager.prototype.checkFinished = function () {
        if (this.count == this.loadedCount) {
            if (this.OnFinishedLoad) {
                this.OnFinishedLoad();
            }
        }
    };
    ResourceManager.prototype.imageLoad = function (url) {
        var _this = this;
        var img = new Image();
        img.src = url;
        img.onload = function () {
            Resource[url] = img;
            _this.loadedCount++;
            _this.checkFinished();
        };
    };
    return ResourceManager;
}());
var Resource = new ResourceManager();
var MathUtil = /** @class */ (function () {
    function MathUtil() {
    }
    MathUtil.lineIntersection = function (srt1, end1, srt2, end2, callback) {
        var dx_ba = end1.x - srt1.x;
        var dx_dc = end2.x - srt2.x;
        var dy_ba = end1.y - srt1.y;
        var dy_dc = end2.y - srt2.y;
        var den = dy_dc * dx_ba - dx_dc * dy_ba;
        if (den == 0)
            callback(false);
        var dy_ac = srt1.y - srt2.y;
        var dx_ac = srt1.x - srt2.x;
        var ua = (dx_dc * dy_ac - dy_dc * dx_ac) / den;
        var ub = (dx_ba * dy_ac - dy_ba * dx_ac) / den;
        if (0 < ua && ua < 1 && 0 < ub && ub < 1) {
            var nx = srt1.x + dx_ba * ua;
            var ny = srt1.y + dy_ba * ua;
            callback(true, { x: nx, y: ny });
        }
        else {
            callback(false);
        }
    };
    MathUtil.subjectPoint = function (sp, ep) {
        return {
            x: sp.x - ep.x,
            y: sp.y - ep.y
        };
    };
    MathUtil.getEndPoint = function (point, angle, distance) {
        var x = Math.cos(MathUtil.toRadians(angle)) * distance;
        var y = -Math.sin(MathUtil.toRadians(angle)) * distance;
        return { x: point.x + x, y: point.y + y };
    };
    MathUtil.getDistance = function (sp, ep) {
        return Math.sqrt(Math.pow(sp.x - ep.x, 2) + Math.pow(sp.y - ep.y, 2));
    };
    MathUtil.get3PointDegree = function (x1, y1, x2, y2) {
        return MathUtil.toDegrees(Math.atan2(y1 * x2 - x1 * y2, x1 * x2 + y1 * y2));
    };
    MathUtil.circlelineintersection = function (p1, r, p2, p3) {
        var x = p1.x;
        var y = p1.y;
        var a = p2.x;
        var b = p2.y;
        var c = p3.x;
        var d = p3.y;
        if (c != a) {
            var m = (d - b) / (c - a);
            ;
            var n = (b * c - a * d) / (c - a);
            var A = m * m + 1;
            var B1 = (m * n - m * y - x);
            var C = (x * x + y * y - r * r + n * n - 2 * n * y);
            var D = B1 * B1 - A * C;
            if (D < 0) {
                return [];
            }
            else if (D == 0) {
                var X = -B1 / A;
                var Y = m * X + n;
                return [new Point(X, Y)];
            }
            else {
                var X = -(B1 + Math.sqrt(D)) / A;
                var Y = m * X + n;
                var X2 = -(B1 - Math.sqrt(D)) / A;
                var Y2 = m * X2 + n;
                return [new Point(X, Y), new Point(X2, Y2)];
            }
        }
        else {
            if (a < (x - r) || a > (x + r)) {
                return [];
            }
            else if (a == (x - r) || a == (x + r)) {
                var X = a;
                var Y = y;
                return [new Point(X, Y)];
            }
            else {
                var X = a;
                var Y = y + Math.sqrt(r * r - (a - x) * (a - x));
                var Y1 = y - Math.sqrt(r * r - (a - x) * (a - x));
                return [new Point(X, Y), new Point(X, Y1)];
            }
        }
    };
    MathUtil.randomInt = function (max) {
        return (Math.random() * max) | 0;
    };
    MathUtil.toRadians = function (degrees) {
        return degrees * Math.PI / 180;
    };
    // Converts from radians to degrees.
    MathUtil.toDegrees = function (radians) {
        return radians * 180 / Math.PI;
    };
    return MathUtil;
}());
var CollisionTester = /** @class */ (function () {
    function CollisionTester() {
    }
    CollisionTester.CollisionCircle = function (st, dt) {
        return MathUtil.getDistance(new Point(st.shape.x, st.shape.y), new Point(dt.shape.x, dt.shape.y)) < (st.shape.width + dt.shape.width);
    };
    CollisionTester.getMinDistancePoint = function (dp, arryPoint) {
        var dists = [];
        for (var i = 0; i < arryPoint.length; i++) {
            dists.push(MathUtil.getDistance(dp, arryPoint[i]));
        }
        var min = Number.MAX_VALUE;
        var minindex = 0;
        for (var i = 0; i < dists.length; i++) {
            if (min > dists[i]) {
                min = dists[i];
                minindex = i;
            }
        }
        return minindex;
    };
    CollisionTester.checkintersection = function (lines, spoint, epoint, ignore, resultF) {
        var resultPoint;
        var interPoints = [];
        var interLines = [];
        for (var i = 0; i < lines.length; i++) {
            var element = lines[i];
            if (element == ignore)
                continue;
            MathUtil.lineIntersection(spoint, epoint, element.startPos, element.endPos, function (result, point) {
                if (result) {
                    interPoints.push(point);
                    interLines.push(element);
                }
            });
        }
        if (interPoints.length > 0) {
            var minIndex = CollisionTester.getMinDistancePoint(spoint, interPoints);
            resultPoint = interPoints[minIndex];
            resultF(resultPoint, interLines[minIndex]);
        }
        return resultPoint;
    };
    CollisionTester.validCircleToLine = function (circlebodies, startPoint, endPoint, callback) {
        for (var i = 0; i < circlebodies.length; i++) {
            //
            var circle = circlebodies[i];
            var circlepoints = MathUtil.circlelineintersection(new Point(circle.shape.x, circle.shape.y), circle.shape.width, startPoint, endPoint);
            var centerpos = new Point(circle.shape.x, circle.shape.y);
            var minx = startPoint.x < endPoint.x ? startPoint.x : endPoint.x;
            var maxx = startPoint.x > endPoint.x ? startPoint.x : endPoint.x;
            var miny = startPoint.y < endPoint.y ? startPoint.y : endPoint.y;
            var maxy = startPoint.y > endPoint.y ? startPoint.y : endPoint.y;
            var interpoints = [];
            var distances = [];
            for (var j = 0; j < circlepoints.length; j++) {
                var ppoint = circlepoints[j];
                if (ppoint.x > minx && ppoint.x < maxx && ppoint.y > miny && ppoint.y < maxy) {
                    interpoints.push(circlepoints[j]);
                    var dist = MathUtil.getDistance(startPoint, ppoint);
                    distances.push(dist);
                }
            }
            var min = Number.MIN_VALUE;
            var minIndex = 0;
            distances.forEach(function (element, index) {
                if (min > element) {
                    minIndex = index;
                }
            });
            if (interpoints.length > 0) {
                // console.log("interpoints : " )
                // console.log("circlebodies : ", circlebodies.length)
                var newpoint = interpoints[minIndex];
                var linevect = MathUtil.subjectPoint(startPoint, endPoint);
                var linedgree = MathUtil.toDegrees(Math.atan2(-linevect.y, linevect.x));
                var subp1 = MathUtil.subjectPoint(centerpos, newpoint);
                var guideStart = new Point(startPoint.x + subp1.x, startPoint.y + subp1.y);
                var subp2 = MathUtil.subjectPoint(centerpos, guideStart);
                var d3angle = linedgree - MathUtil.get3PointDegree(subp1.x, subp1.y, subp2.x, subp2.y) * 2;
                var subdistanc = MathUtil.getDistance(newpoint, startPoint);
                callback(newpoint, d3angle, subdistanc);
            }
        }
    };
    return CollisionTester;
}());
/// <reference path="../src/dependency.d.ts" />
var TestBody = /** @class */ (function (_super) {
    __extends(TestBody, _super);
    function TestBody() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.image = null;
        _this.debugging = false;
        _this.angle = 0;
        _this.selected = false;
        return _this;
    }
    TestBody.prototype.move = function (x, y) {
        var vector = new Vector(this.shape, this.shape.y);
        vector.angle = MathUtil.toDegrees(Math.atan2(y, x));
        vector.distance = MathUtil.getDistance(new Point(), new Point(x, y));
        var animate = new MoveAnimate();
        animate.data = this;
        var roff = Math.random() / 2 - 0.5 / 2;
        animate.callback = function (data) {
            Resource.worldRect.collisionTest(data.shape, function (direction) {
                switch (direction) {
                    case "left":
                        x = -x;
                        break;
                    case "right":
                        x = -x;
                        break;
                    case "top":
                        y = -y;
                        break;
                    case "bottom":
                        y = -y;
                        break;
                }
            });
            data.shape.x += x;
            data.shape.y += y;
            data.angle += roff;
        };
        animate.start();
    };
    TestBody.prototype.render = function (canvas) {
        canvas.save();
        canvas.translate(this.shape.x + this.shape.width / 2, this.shape.y + this.shape.height / 2);
        canvas.rotate(this.angle);
        canvas.translate(-this.shape.width / 2, -this.shape.height / 2);
        if (this.image) {
            canvas.drawImage(this.image.source, this.image.x, this.image.y, this.image.width, this.image.height, 0, 0, this.shape.width, this.shape.height);
        }
        else {
            canvas.strokeStyle = this.color;
            canvas.strokeRect(0, 0, this.shape.width, this.shape.height);
        }
        if (this.selected) {
            canvas.strokeStyle = "#FFF";
            canvas.strokeRect(0, 0, this.shape.width, this.shape.height);
        }
        canvas.restore();
    };
    return TestBody;
}(RectBody));
var SampleRenderer = /** @class */ (function (_super) {
    __extends(SampleRenderer, _super);
    function SampleRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SampleRenderer.prototype.addMouseEvent = function (element) {
        element.addEventListener("mousedown", this.onmousedown.bind(this));
        element.addEventListener("mousemove", this.onmousemove.bind(this));
        element.addEventListener("mouseup", this.onmouseup.bind(this));
    };
    SampleRenderer.prototype.onmousedown = function (event) {
        var _sbody = this.selectedBody;
        this.objects.forEach(function (el) {
            if (el instanceof TestBody) {
                if (el.shape.containPoint(event.x, event.y)) {
                    el.selected = true;
                    _sbody = el;
                    return;
                }
            }
        });
        if (_sbody) {
            if (this.selectedBody)
                this.selectedBody.selected = false;
            this.selectedBody = _sbody;
            this.offset.x = this.selectedBody.shape.x - event.x;
            this.offset.y = this.selectedBody.shape.y - event.y;
        }
    };
    SampleRenderer.prototype.onmousemove = function (event) {
        if (this.selectedBody) {
            this.selectedBody.shape.x = event.x + this.offset.x;
            this.selectedBody.shape.y = event.y + this.offset.y;
        }
    };
    SampleRenderer.prototype.onmouseup = function (event) {
        if (this.selectedBody) {
            this.selectedBody.selected = false;
            this.selectedBody = null;
        }
    };
    return SampleRenderer;
}(Renderer));
/// <reference path="main.d.ts" />
var Controlmode;
(function (Controlmode) {
    Controlmode[Controlmode["None"] = 0] = "None";
    Controlmode[Controlmode["AddObject"] = 1] = "AddObject";
})(Controlmode || (Controlmode = {}));
var Tester = /** @class */ (function () {
    function Tester() {
        this.ctx = null;
        this.background = "../../image/background.png";
        this.mousePressed = false;
        this.status = Controlmode.None;
        this.relationBody = [];
    }
    Tester.prototype.init = function () {
        var c = document.getElementById("canvas");
        Resource.width = c.width;
        Resource.height = c.height;
        Resource.worldRect = new Rect(0, 0, Resource.width, Resource.height);
        this.ctx = c.getContext("2d");
        this.ctx.width = c.width;
        this.ctx.height = c.height;
        Resource.Images.push(this.background);
        Resource.OnFinishedLoad = function () {
            this.initBodies();
        }.bind(this);
        Resource.load();
        this.renderer = new SampleRenderer();
        this.renderer.canvas = this.ctx;
        this.renderer.addMouseEvent(c);
        c.addEventListener("mousedown", this.onmousedown.bind(this));
        c.addEventListener("mousemove", this.onmousemove.bind(this));
        c.addEventListener("mouseup", this.onmouseup.bind(this));
    };
    Tester.prototype.onmousedown = function (event) {
        this.mousePressed = true;
        if (this.status == Controlmode.AddObject) {
        }
    };
    Tester.prototype.onmousemove = function (event) {
        if (this.mousePressed) {
            if (this.status == Controlmode.AddObject) {
            }
        }
    };
    Tester.prototype.onmouseup = function (evnt) {
        this.mousePressed = false;
        ;
        if (this.status == Controlmode.AddObject) {
        }
    };
    Tester.prototype.setStatus = function (mode) {
        this.status = Controlmode[mode];
    };
    Tester.prototype.stepframe = function () {
        this.renderer.refresh();
    };
    Tester.prototype.start = function () {
        this.renderer.start();
    };
    Tester.prototype.stop = function () {
        this.renderer.stop();
    };
    Tester.prototype.initBodies = function () {
        var box1 = new TestBody();
        box1.color = "#02F";
        box1.shape = new Rect(40, 300, 150, 80);
        this.relationBody.push(box1);
        this.renderer.addObject(box1);
        var box2 = new TestBody();
        box2.color = "#F2F";
        box2.shape = new Rect(440, 100, 350, 5);
        this.relationBody.push(box2);
        this.renderer.addObject(box2);
        var box3 = new TestBody();
        box3.color = "#F21";
        box3.shape = new Rect(540, 400, 5, 80);
        this.relationBody.push(box3);
        this.renderer.addObject(box3);
        var wedge1 = new PolygonBody();
        wedge1.setPoints([500, 300, 600, 300, 600, 250, 400, 250, 500, 300]);
        this.relationBody.push(wedge1);
        this.renderer.addObject(wedge1);
        var wedge2 = new PolygonBody();
        wedge2.setPoints([150, 100, 300, 200, 300, 210, 150, 110, 150, 100]);
        this.relationBody.push(wedge2);
        this.renderer.addObject(wedge2);
        var ball1 = new CircleActor();
        ball1.color = "red";
        ball1.shape.x = 50;
        ball1.shape.y = 50;
        ball1.shape.width = 5;
        ball1.relationBody = this.relationBody;
        ball1.move(1, 0);
        this.renderer.addObject(ball1);
        var ball2 = new CircleActor();
        ball2.color = "magenta";
        ball2.shape.x = 50;
        ball2.shape.y = 250;
        ball2.shape.width = 6;
        ball2.relationBody = this.relationBody;
        ball2.move(7, 0);
        this.renderer.addObject(ball2);
        var ball3 = new CircleActor();
        ball3.color = "#3F1";
        ball3.shape.x = 450;
        ball3.shape.y = 50;
        ball3.shape.width = 16;
        ball3.relationBody = this.relationBody;
        ball3.move(-3, 0);
        this.renderer.addObject(ball3);
        var ball4 = new CircleActor();
        ball4.color = "gray";
        ball4.shape.x = 250;
        ball4.shape.y = 70;
        ball4.shape.width = 3;
        ball4.relationBody = this.relationBody;
        ball4.move(4, 0);
        this.renderer.addObject(ball4);
        var circleBody1 = new CircleBody();
        circleBody1.shape.x = 300;
        circleBody1.shape.y = 400;
        circleBody1.shape.width = 50;
        circleBody1.color = "yellow";
        this.relationBody.push(circleBody1);
        this.renderer.addObject(circleBody1);
        document.addEventListener("keydown", this.OnKeyDown);
        this.start();
    };
    Tester.prototype.OnKeyDown = function (evt) {
    };
    return Tester;
}());
var CircleActor = /** @class */ (function (_super) {
    __extends(CircleActor, _super);
    function CircleActor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.relationBody = [];
        _this.velocityX = 0;
        _this.velocityY = 0;
        return _this;
    }
    CircleActor.prototype.update = function () {
        this.velocityY += 9.8 / 60;
        var lines = [];
        for (var i = 0; i < this.relationBody.length; i++)
            getLineBody(this.relationBody[i], lines);
        var circlebodies = [];
        for (var i = 0; i < this.relationBody.length; i++) {
            if (this.relationBody[i] instanceof CircleBody)
                circlebodies.push(this.relationBody[i]);
        }
        var vector = this.getVector();
        var angle = vector.angle;
        var lastLine = null;
        var newangle = 0;
        var endPoint = MathUtil.getEndPoint(vector.position, vector.angle, vector.distance);
        var collision = CollisionTester.checkintersection(lines, vector.position, endPoint, lastLine, function (point, line) {
            var p = MathUtil.subjectPoint(line.startPos, line.endPos);
            var lineangle = Math.abs(MathUtil.toDegrees(Math.atan2(p.y, p.x)));
            lastLine = line;
            newangle = angle + (lineangle - angle) * 2;
        });
        CollisionTester.validCircleToLine(circlebodies, vector.position, endPoint, function (newpoint, angle, subdistance) {
            collision = newpoint;
            newangle = angle;
        });
        if (collision) {
            angle = newangle;
            var velocity = MathUtil.getEndPoint(new Point(), angle, vector.distance);
            this.velocityX = velocity.x;
            this.velocityY = velocity.y;
        }
    };
    CircleActor.prototype.getVector = function () {
        var vector = new Vector(this.shape, this.shape.y);
        vector.angle = MathUtil.toDegrees(Math.atan2(-this.velocityY, this.velocityX));
        vector.distance = MathUtil.getDistance(new Point(), new Point(this.velocityX, this.velocityY));
        this.angle = vector.angle;
        return vector;
    };
    CircleActor.prototype.move = function (x, y) {
        this.velocityX = x;
        this.velocityY = y;
        var animate = new MoveAnimate();
        animate.data = this;
        animate.callback = function (data) {
            var left = data.shape.x - data.shape.width;
            var right = data.shape.x + data.shape.width;
            var top = data.shape.y - data.shape.width;
            var buttom = data.shape.y + data.shape.width;
            var rect = new Rect(left, top, data.shape.width * 2, data.shape.width * 2);
            var collistion = false;
            Resource.worldRect.collisionTest(rect, function (direction) {
                collistion = true;
                switch (direction) {
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
                    default:
                        data.update();
                        break;
                }
            });
            if (!collistion)
                data.update();
            data.shape.x += data.velocityX;
            data.shape.y += data.velocityY;
        };
        animate.start();
    };
    return CircleActor;
}(CircleBody));
var tester = new Tester();
//# sourceMappingURL=main.js.map