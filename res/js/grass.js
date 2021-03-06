function load() {
    var canvas = document.getElementById('test'),
        ctx = canvas.getContext('2d'),
        stack = [],
        w = window.innerWidth,
        h = window.innerHeight;

    var drawer = function () {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
        stack.forEach(function (el) {
            el();
        })
        requestAnimationFrame(drawer);
    }
    var anim = function () {
        var x = 0;
        var speed = Math.random() * 5;
        var position = Math.random() * w - w / 2;
        var maxTall = Math.random() * 12;
        var maxSize = Math.random() * 6;
        var c = function (l, u) {
            return Math.round(Math.random() * (u || 255) + l || 0);
        }
        var color = 'rgb(' + c(60, 10) + ',' + c(201, 50) + ',' + c(120, 50) + ')';
        return function () {
            var deviation = Math.cos(x / 60) * Math.min(x / 70, 80),
                tall = Math.min(x / 12, maxTall),
                size = Math.min(x / 50, maxSize);


            x += speed;
            ctx.save();

            ctx.strokeWidth = 10;
            ctx.translate(w / 2 + position, h)
            ctx.fillStyle = color;

            ctx.beginPath();
            ctx.lineTo(-size, 0);
            ctx.quadraticCurveTo(-size, -tall / 2, deviation, -tall);
            ctx.quadraticCurveTo(size, -tall / 2, size, 0);
            //ctx.closePath();
            ctx.fill();

            ctx.restore()
        }
    };

    for (var x = 0; x < 700; x++) {
        stack.push(anim());
    }
    canvas.width = w;
    canvas.height = h;
    drawer();
}