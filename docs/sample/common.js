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
//# sourceMappingURL=common.js.map