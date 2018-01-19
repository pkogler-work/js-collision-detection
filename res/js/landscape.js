/*
**  HTML5/Canvas Landscape Generator
**  Copyright (C) 2011 Ingo Ruhnke <grumbel@gmail.com>
**
**  This program is free software: you can redistribute it and/or modify
**  it under the terms of the GNU General Public License as published by
**  the Free Software Foundation, either version 3 of the License, or
**  (at your option) any later version.
**
**  This program is distributed in the hope that it will be useful,
**  but WITHOUT ANY WARRANTY; without even the implied warranty of
**  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
**  GNU General Public License for more details.
**
**  You should have received a copy of the GNU General Public License
**  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

window.onload = my_onload;

function my_onload() {
    var canvas = document.getElementById("landscapecanvas");
    var ctx = canvas.getContext("2d");

    draw(ctx, canvas.width, canvas.height);

    return false;
}

function gen_segment(a, b, depth, midfunc) {
    function loop(a, b, r) {
        if (r == 0) {
            return [a];
        }
        else {
            var m = midfunc(a, b, depth - r);
            var lhs = loop(a, m, r - 1);
            var rhs = loop(m, b, r - 1);
            return lhs.concat(rhs);
        }
    }

    ary = loop(a, b, depth).concat([b]);
    return ary;
}

function draw_mountain(ctx, y, width, height) {
    // get a heightmap
    var points = gen_segment(y + (Math.random() - 0.5) * height / 3.0,
        y + (Math.random() - 0.5) * height / 3.0,
        8,
        function (a, b, d) {
            return (a + b) / 2.0 + ((Math.random() - 0.5) * (height / 6.0)) / (1 << d);
        });

    // draw the mountain
    ctx.beginPath();
    ctx.moveTo(0, height);
    for (var i = 0; i < points.length; ++i) {
        ctx.lineTo(width / (points.length - 1) * i,
            points[i]);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();
}

function draw_starfield(ctx, width, height) {
    for (var i = 0; i < 500; ++i) {
        var gray = Math.ceil(Math.random() * 255);
        ctx.beginPath();
        ctx.fillStyle = "rgb(" + gray + ", " + gray + ", " + gray + ")";
        ctx.arc(width * Math.random(),
            height * Math.random(),
            1.5, 0.0, 2 * Math.PI);
        ctx.fill();
    }
}

function draw_moon(ctx, width, height, color) {
    var radius = Math.random() * 32 + 32;
    var x = width * Math.random();
    var y = height / 2.0 * Math.random();

    var shadow_x = x + radius * (Math.random() - 0.5) * 3.0;
    var shadow_y = y + radius * (Math.random() - 0.5) * 3.0;

    ctx.fillStyle = "rgb(" + Math.ceil(color[0] * 0.8) + ", " + Math.ceil(color[1] * 0.8) + ", " + Math.ceil(color[2] * 0.8) + ")";
    ctx.beginPath();
    ctx.arc(x, y, radius + 3.0,
        0.0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")";
    ctx.beginPath();
    ctx.arc(x, y, radius,
        0.0, 2 * Math.PI);
    ctx.fill();

    ctx.save();

    ctx.beginPath();
    ctx.arc(x, y, radius + 3.5,
        0.0, 2 * Math.PI);
    ctx.clip();

    ctx.fillStyle = "rgba(7, 27, 38, 1)";
    ctx.beginPath();
    ctx.arc(shadow_x, shadow_y, radius * 2,
        0.0, 2 * Math.PI);
    ctx.fill();

    ctx.restore();
}

x = 10;
dx = 1;
y = 25;
dy = 1;

function draw_path(ctx, width, height, color) {
    var versatz = height;
    var rechts = 0;
    ctx.clearRect(0, height-34, width, height-40);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.rect(0, height-34, width, height-40);
    ctx.fill();
    ctx.closePath();
    for (var ii = 0; ii < 75; ii++) {
        ctx.fillStyle = '#006005';
        ctx.beginPath();
        ctx.moveTo(0 + rechts, versatz);
        ctx.lineTo(0 + rechts, versatz - 3);
        ctx.lineTo(x + rechts, versatz - y);
        ctx.lineTo(20 + rechts, versatz - 3);
        ctx.lineTo(20 + rechts, versatz);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#003407';
        ctx.beginPath();
        ctx.moveTo(10 + rechts, versatz - 3);
        ctx.lineTo(10 + rechts, versatz - 6);
        ctx.lineTo(x * 2 + rechts, versatz - y - (1 * 3));
        ctx.lineTo(30 + rechts, versatz - 6);
        ctx.lineTo(30 + rechts, versatz - 3);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#005307';
        ctx.beginPath();
        ctx.moveTo(20 + rechts, versatz - 6);
        ctx.lineTo(20 + rechts, versatz - 9);
        ctx.lineTo(x * 3 + rechts, versatz - y - (2 * 3));
        ctx.lineTo(40 + rechts, versatz - 9);
        ctx.lineTo(40 + rechts, versatz - 6);
        ctx.closePath();
        ctx.fill();
        rechts += 20;
    }
    console.log("draw");
    if (x === 14) {
        dx = -1;

    }
    if (x === 6) {
        dx = 1;
    }
    if (y === 28) {
        dy = -1;
    }
    if (y === 22) {
        dy = 1;
    }
    x += dx;
    y += dy;
}

function draw(ctx, width, height) {
    var y = height / 2.0;
    var n = 33;

    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.clearRect(0, 0, width, height);

    var color = [Math.ceil(Math.random() * 255),
        Math.ceil(Math.random() * 255),
        Math.ceil(Math.random() * 255)];

    draw_starfield(ctx, width, height);

    draw_moon(ctx, width, height, color);

    for (var i = 0; i < n; ++i) {
        var p = i / (n - 1);

        var r = Math.ceil(Math.pow(p, 2.2) * color[0]);
        var g = Math.ceil(Math.pow(p, 2.2) * color[1]);
        var b = Math.ceil(Math.pow(p, 2.2) * color[2]);

        ctx.fillStyle = "rgb(" + r + ", " + g + ", " + b + ")";

        var yof = y + Math.pow(2, p * 8);
        draw_mountain(ctx, yof, width, height);

        if (i === n - 1) {
            r = Math.ceil(Math.pow(p, 2.2) * color[0]);
            g = Math.ceil(Math.pow(p, 2.2) * color[1]);
            b = Math.ceil(Math.pow(p, 2.2) * color[2]);
            console.log(r);
            console.log(g);
            console.log(b);
            setInterval(function () {
                draw_path(ctx, width, height, "rgb(" + r + ", " + g + ", " + b + ")");
            }, 150);
        }
    }

}

/* EOF */