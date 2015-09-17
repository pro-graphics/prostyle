/*!
 * VERSION: 1.0.0
 * DATE: 12-Sep-2015
 * UPDATES AND DOCS AT: https://prostyle.io/plus/
 * 
 * This file is part of ProStyle Plus, a set of premium extensions for ProStyle.
 * 
 * @copyright - Copyright (c) 2013-2015, Pro Graphics, Inc. All rights reserved. 
 * @license - This work is subject to the terms at https://prostyle.io/plus/
 * @author: Gary Chamberlain, gary@pro.graphics.
 * 
 **/

/// <reference path="../../../ts/prostyle.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ProStyle;
(function (ProStyle) {
    var Extensions;
    (function (Extensions) {
        var Controllers;
        (function (Controllers) {
            var MouseMove;
            (function (MouseMove) {
                var MouseMoveController = (function (_super) {
                    __extends(MouseMoveController, _super);
                    function MouseMoveController(startPercent, endPercent) {
                        if (startPercent === void 0) { startPercent = 0; }
                        if (endPercent === void 0) { endPercent = 100; }
                        _super.call(this, "mousemove");
                        this.startPercent = startPercent;
                        this.endPercent = endPercent;
                        this.mousemoveBound = undefined;
                        this.mouseoutBound = undefined;
                        this.canvas = undefined;
                        this.player = undefined;
                        this.startVal = 0;
                        this.endVal = 100;
                        startPercent = Math.max(Math.min(0, startPercent), 100);
                        endPercent = Math.max(Math.min(0, endPercent), 100);
                        this.startVal = this.startPercent / 100;
                        this.endVal = this.endPercent / 100;
                        this.mousemoveBound = this.mousemove.bind(this);
                        this.mouseoutBound = this.mouseout.bind(this);
                    }
                    MouseMoveController.prototype.start = function (canvas, player) {
                        this.stop();
                        this.canvas = canvas;
                        this.player = player;
                        canvas.frame.div.addEventListener("mousemove", this.mousemoveBound);
                        canvas.frame.div.addEventListener("mouseout", this.mouseoutBound);
                    };
                    MouseMoveController.prototype.stop = function () {
                        if (this.player !== undefined) {
                            this.canvas.frame.div.removeEventListener("mousemove", this.mousemoveBound);
                            this.canvas.frame.div.removeEventListener("mouseout", this.mouseoutBound);
                            this.canvas = undefined;
                            this.player = undefined;
                        }
                    };
                    MouseMoveController.prototype.mouseout = function (m) {
                        if (this.player)
                            this.player.playCurrentStep();
                    };
                    MouseMoveController.prototype.mousemove = function (m) {
                        var div = m.currentTarget;
                        var rect = ProStyle.Util.getOffset(div);
                        var pos = m.pageX - rect.left;
                        var w = div.offsetWidth;
                        this.player.seek(this.posToSeek(pos / w));
                        m.stopPropagation();
                        m.preventDefault();
                    };
                    MouseMoveController.prototype.posToSeek = function (pos) {
                        var range;
                        if (this.startVal == this.endVal) {
                            return pos < this.startVal ? 0 : 100;
                        }
                        else if (this.startVal < this.endVal) {
                            if (pos < this.startVal)
                                return 0;
                            else if (pos > this.endVal)
                                return 100;
                            else {
                                range = this.endVal - this.startVal;
                                return (pos - this.startVal) / range;
                            }
                        }
                        else {
                            if (pos > this.startVal)
                                return 0;
                            else if (pos < this.endVal)
                                return 100;
                            else {
                                range = this.startVal - this.endVal;
                                return (this.startVal - pos) / range;
                            }
                        }
                    };
                    MouseMoveController.prototype.serialize = function () {
                        return MouseMove.serialize(this);
                    };
                    return MouseMoveController;
                })(ProStyle.Controllers.Controller);
                MouseMove.MouseMoveController = MouseMoveController;
            })(MouseMove = Controllers.MouseMove || (Controllers.MouseMove = {}));
        })(Controllers = Extensions.Controllers || (Extensions.Controllers = {}));
    })(Extensions = ProStyle.Extensions || (ProStyle.Extensions = {}));
})(ProStyle || (ProStyle = {}));
var ProStyle;
(function (ProStyle) {
    var Extensions;
    (function (Extensions) {
        var bs = 28;
        var bx2 = 1 << bs;
        var bm = bx2 - 1;
        var bx = bx2 >> 1;
        var bd = bs >> 1;
        var bdm = (1 << bd) - 1;
        var log2 = Math.log(2);
        var a;
        var b;
        function badd(a, b) {
            var al = a.length, bl = b.length;
            if (al < bl)
                return badd(b, a);
            var c = 0, r = [], n = 0;
            for (; n < bl; n++) {
                c += a[n] + b[n];
                r[n] = c & bm;
                c >>>= bs;
            }
            for (; n < al; n++) {
                c += a[n];
                r[n] = c & bm;
                c >>>= bs;
            }
            if (c)
                r[n] = c;
            return r;
        }
        function beq(a, b) {
            if (a.length != b.length)
                return 0;
            for (var n = a.length - 1; n >= 0; n--)
                if (a[n] != b[n])
                    return 0;
            return 1;
        }
        function bsub(a, b) {
            var al = a.length, bl = b.length, c = 0, r = [];
            if (bl > al) {
                return [];
            }
            if (bl == al) {
                if (b[bl - 1] > a[bl - 1])
                    return [];
                if (bl == 1)
                    return [a[0] - b[0]];
            }
            for (var n = 0; n < bl; n++) {
                c += a[n] - b[n];
                r[n] = c & bm;
                c >>= bs;
            }
            for (; n < al; n++) {
                c += a[n];
                r[n] = c & bm;
                c >>= bs;
            }
            if (c) {
                return [];
            }
            if (r[n - 1])
                return r;
            while (n > 1 && r[n - 1] == 0)
                n--;
            return r.slice(0, n);
        }
        function bmul(a, b) {
            b = b.concat([0]);
            var al = a.length, bl = b.length, r = [], n, nn, aa, c, m;
            var g, gg, h, hh, ghhb;
            for (n = al + bl; n >= 0; n--)
                r[n] = 0;
            for (n = 0; n < al; n++) {
                if (aa = a[n]) {
                    c = 0;
                    hh = aa >> bd;
                    h = aa & bdm;
                    m = n;
                    for (nn = 0; nn < bl; nn++, m++) {
                        g = b[nn];
                        gg = g >> bd;
                        g = g & bdm;
                        var ghh = g * hh + h * gg;
                        ghhb = ghh >> bd;
                        ghh &= bdm;
                        c += r[m] + h * g + (ghh << bd);
                        r[m] = c & bm;
                        c = (c >> bs) + gg * hh + ghhb;
                    }
                }
            }
            n = r.length;
            if (r[n - 1])
                return r;
            while (n > 1 && r[n - 1] == 0)
                n--;
            return r.slice(0, n);
        }
        function blshift(a, b) {
            var n, c = 0, r = [];
            for (n = 0; n < a.length; n++) {
                c |= (a[n] << b);
                r[n] = c & bm;
                c >>= bs;
            }
            if (c)
                r[n] = c;
            return r;
        }
        function brshift(a) {
            var c = 0, n, cc, r = [];
            for (n = a.length - 1; n >= 0; n--) {
                cc = a[n];
                c <<= bs;
                r[n] = (cc | c) >> 1;
                c = cc & 1;
            }
            while (r.length > 1 && r[r.length - 1] == 0) {
                r = r.slice(0, -1);
            }
            this.a = r;
            this.c = c;
            return this;
        }
        function zeros(n) { var r = []; while (n-- > 0)
            r[n] = 0; return r; }
        function toppart(x, start, len) {
            var n = 0;
            while (start >= 0 && len-- > 0)
                n = n * bx2 + x[start--];
            return n;
        }
        function bdiv(x, y) {
            var n = x.length - 1, t = y.length - 1, nmt = n - t;
            if (n < t || n == t && (x[n] < y[n] || n > 0 && x[n] == y[n] && x[n - 1] < y[n - 1])) {
                this.q = [0];
                this.mod = x;
                return this;
            }
            if (n == t && toppart(x, t, 2) / toppart(y, t, 2) < 4) {
                var q = 0, xx;
                for (;;) {
                    xx = bsub(x, y);
                    if (xx.length == 0)
                        break;
                    x = xx;
                    q++;
                }
                this.q = [q];
                this.mod = x;
                return this;
            }
            var shift, shift2;
            shift2 = Math.floor(Math.log(y[t]) / log2) + 1;
            shift = bs - shift2;
            if (shift) {
                x = x.concat();
                y = y.concat();
                for (i = t; i > 0; i--)
                    y[i] = ((y[i] << shift) & bm) | (y[i - 1] >> shift2);
                y[0] = (y[0] << shift) & bm;
                if (x[n] & ((bm << shift2) & bm)) {
                    x[++n] = 0;
                    nmt++;
                }
                for (i = n; i > 0; i--)
                    x[i] = ((x[i] << shift) & bm) | (x[i - 1] >> shift2);
                x[0] = (x[0] << shift) & bm;
            }
            var i, j, x2, y2, q = zeros(nmt + 1);
            y2 = zeros(nmt).concat(y);
            for (;;) {
                x2 = bsub(x, y2);
                if (x2.length == 0)
                    break;
                q[nmt]++;
                x = x2;
            }
            var yt = y[t], top = toppart(y, t, 2);
            for (i = n; i > t; i--) {
                var m = i - t - 1;
                if (i >= x.length)
                    q[m] = 1;
                else if (x[i] == yt)
                    q[m] = bm;
                else
                    q[m] = Math.floor(toppart(x, i, 2) / yt);
                var topx = toppart(x, i, 3);
                while (q[m] * top > topx)
                    q[m]--;
                y2 = y2.slice(1);
                x2 = bsub(x, bmul([q[m]], y2));
                if (x2.length == 0) {
                    q[m]--;
                    x2 = bsub(x, bmul([q[m]], y2));
                }
                x = x2;
            }
            if (shift) {
                for (i = 0; i < x.length - 1; i++)
                    x[i] = (x[i] >> shift) | ((x[i + 1] << shift2) & bm);
                x[x.length - 1] >>= shift;
            }
            while (q.length > 1 && q[q.length - 1] == 0)
                q = q.slice(0, q.length - 1);
            while (x.length > 1 && x[x.length - 1] == 0)
                x = x.slice(0, x.length - 1);
            this.mod = x;
            this.q = q;
            return this;
        }
        function bmod(p, m) {
            if (m.length == 1) {
                if (p.length == 1)
                    return [p[0] % m[0]];
                if (m[0] < bdm)
                    return [simplemod(p, m[0])];
            }
            var r = bdiv(p, m);
            return r.mod;
        }
        function simplemod(i, m) {
            if (m > bdm)
                return bmod(i, [m]);
            var c = 0, v;
            for (var n = i.length - 1; n >= 0; n--) {
                v = i[n];
                c = ((v >> bd) + (c << bd)) % m;
                c = ((v & bdm) + (c << bd)) % m;
            }
            return c;
        }
        function bmodexp(xx, y, m) {
            var r = [1], n, an, a, x = xx.concat();
            var mu = [];
            n = m.length * 2;
            mu[n--] = 1;
            for (; n >= 0; n--)
                mu[n] = 0;
            mu = bdiv(mu, m).q;
            for (n = 0; n < y.length; n++) {
                for (a = 1, an = 0; an < bs; an++, a <<= 1) {
                    if (y[n] & a)
                        r = bmod2(bmul(r, x), m, mu);
                    x = bmod2(bmul(x, x), m, mu);
                }
            }
            return r;
        }
        function bmod2(x, m, mu) {
            var xl = x.length - (m.length << 1);
            if (xl > 0) {
                return bmod2(x.slice(0, xl).concat(bmod2(x.slice(xl), m, mu)), m, mu);
            }
            var ml1 = m.length + 1, ml2 = m.length - 1, rr;
            var q3 = bmul(x.slice(ml2), mu).slice(ml1);
            var r1 = x.slice(0, ml1);
            var r2 = bmul(q3, m).slice(0, ml1);
            var r = bsub(r1, r2);
            if (r.length == 0) {
                r1[ml1] = 1;
                r = bsub(r1, r2);
            }
            for (var n = 0;; n++) {
                rr = bsub(r, m);
                if (rr.length == 0)
                    break;
                r = rr;
                if (n >= 3)
                    return bmod2(r, m, mu);
            }
            return r;
        }
        function sub2(a, b) {
            var r = bsub(a, b);
            if (r.length == 0) {
                this.a = bsub(b, a);
                this.sign = 1;
            }
            else {
                this.a = r;
                this.sign = 0;
            }
            return this;
        }
        function signedsub(a, b) {
            if (a.sign) {
                if (b.sign) {
                    return sub2(b, a);
                }
                else {
                    this.a = badd(a, b);
                    this.sign = 1;
                }
            }
            else {
                if (b.sign) {
                    this.a = badd(a, b);
                    this.sign = 0;
                }
                else {
                    return sub2(a, b);
                }
            }
            return this;
        }
        function modinverse(x, n) {
            var y = n.concat(), t, r, bq, a = [1], b = [0], ts;
            a.sign = 0;
            b.sign = 0;
            while (y.length > 1 || y[0]) {
                t = y.concat();
                r = bdiv(x, y);
                y = r.mod;
                var q = r.q;
                x = t;
                t = b.concat();
                ts = b.sign;
                bq = bmul(b, q);
                bq.sign = b.sign;
                r = signedsub(a, bq);
                b = r.a;
                b.sign = r.sign;
                a = t;
                a.sign = ts;
            }
            if (beq(x, [1]) == 0)
                return [0];
            if (a.sign) {
                a = bsub(n, a);
            }
            return a;
        }
        function crt_RSA(m, d, p, q) {
            var xp = bmodexp(bmod(m, p), bmod(d, bsub(p, [1])), p);
            var xq = bmodexp(bmod(m, q), bmod(d, bsub(q, [1])), q);
            var t = bsub(xq, xp);
            if (t.length == 0) {
                t = bsub(xp, xq);
                t = bmod(bmul(t, modinverse(p, q)), q);
                t = bsub(q, t);
            }
            else {
                t = bmod(bmul(t, modinverse(p, q)), q);
            }
            return badd(bmul(t, p), xp);
        }
        function t2b(s) {
            var bits = s.length * 8, bn = 1, r = [0], rn = 0, sn = 0, sb = 1;
            var c = s.charCodeAt(0);
            for (var n = 0; n < bits; n++) {
                if (bn > bm) {
                    bn = 1;
                    r[++rn] = 0;
                }
                if (c & sb)
                    r[rn] |= bn;
                bn <<= 1;
                if ((sb <<= 1) > 255) {
                    sb = 1;
                    c = s.charCodeAt(++sn);
                }
            }
            return r;
        }
        function b2t(b) {
            var bits = b.length * bs, bn = 1, bc = 0, r = [0], rb = 1, rn = 0;
            for (var n = 0; n < bits; n++) {
                if (b[bc] & bn)
                    r[rn] |= rb;
                if ((rb <<= 1) > 255) {
                    rb = 1;
                    r[++rn] = 0;
                }
                if ((bn <<= 1) > bm) {
                    bn = 1;
                    bc++;
                }
            }
            while (r[rn] == 0) {
                rn--;
            }
            var rr = '';
            for (var n = 0; n <= rn; n++)
                rr += String.fromCharCode(r[n]);
            return rr;
        }
        var b64s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';
        function textToBase64(t) {
            var r = '';
            var m = 0;
            var a = 0;
            var tl = t.length - 1;
            var c;
            for (var n = 0; n <= tl; n++) {
                c = t.charCodeAt(n);
                r += b64s.charAt((c << m | a) & 63);
                a = c >> (6 - m);
                m += 2;
                if (m == 6 || n == tl) {
                    r += b64s.charAt(a);
                    if ((n % 45) == 44) {
                        r += "\n";
                    }
                    m = 0;
                    a = 0;
                }
            }
            return r;
        }
        function base64ToText(t) {
            var r = '';
            var m = 0;
            var a = 0;
            var c;
            for (var n = 0; n < t.length; n++) {
                c = b64s.indexOf(t.charAt(n));
                if (c >= 0) {
                    if (m) {
                        r += String.fromCharCode((c << (8 - m)) & 255 | a);
                    }
                    a = c >> m;
                    m += 2;
                    if (m == 8) {
                        m = 0;
                    }
                }
            }
            return r;
        }
        function rc4(key, text) {
            var i, x, y, t, x2, kl = key.length;
            var s = [];
            for (i = 0; i < 256; i++)
                s[i] = i;
            y = 0;
            for (var j = 0; j < 2; j++) {
                for (x = 0; x < 256; x++) {
                    y = (key.charCodeAt(x % kl) + s[x] + y) % 256;
                    t = s[x];
                    s[x] = s[y];
                    s[y] = t;
                }
            }
            var z = "";
            for (x = 0; x < text.length; x++) {
                x2 = x & 255;
                y = (s[x2] + y) & 255;
                t = s[x2];
                s[x2] = s[y];
                s[y] = t;
                z += String.fromCharCode((text.charCodeAt(x) ^ s[(s[x2] + s[y]) % 256]));
            }
            return z;
        }
        function ror(a, n) { n &= 7; return n ? ((a >> n) | ((a << (8 - n)) & 255)) : a; }
        function hash(s, l) {
            var sl = s.length, r = [], rr = '', v = 1, lr = 4;
            for (var n = 0; n < l; n++)
                r[n] = (v = ((v * v * 5081 + n) & 255));
            while (sl--) {
                lr = r[sl % l] ^= ror(s.charCodeAt(sl), lr) ^ r[r[(sl * 5081) % l] % l];
            }
            for (var n = 0; n < l; n++)
                rr += String.fromCharCode(r[n] ^
                    ror(r[r[(n * 171) % l] % l], r[n]));
            return rr;
        }
        function rsaDecode(key, text) {
            text = base64ToText(text);
            var sessionKeyLength = text.charCodeAt(0);
            var sessionKeyEncryptedText = text.substr(1, sessionKeyLength);
            text = text.substr(sessionKeyLength + 1);
            var sessionKeyEncrypted = t2b(sessionKeyEncryptedText);
            var sessionkey = crt_RSA(sessionKeyEncrypted, key[0], key[1], key[2]);
            sessionkey = b2t(sessionkey);
            text = rc4(sessionkey, text);
            return text;
        }
        function c() {
            if (ProStyle["pl"])
                return;
            var hn = window.location.hostname.trim().toLowerCase();
            if (hn === '' || hn === 'localhost' || hn === '127.0.0.1')
                return;
            ProStyle["hn"] = hn;
            var plk = ProStyle["plusLicense"];
            if (plk === undefined) {
                ProStyle["pl"] = 2;
            }
            else {
                var k = [[239800443, 61606552, 84], [201280845, 11], [166507101, 13]];
                var pld = rsaDecode(k, plk);
                ProStyle["pld"] = pld;
                ProStyle["pl"] = pld === hn ? 1 : 3;
            }
        }
        Extensions.c = c;
    })(Extensions = ProStyle.Extensions || (ProStyle.Extensions = {}));
})(ProStyle || (ProStyle = {}));
/// <reference path="MouseMoveController.ts" />
/// <reference path="../../l.ts" />
var ProStyle;
(function (ProStyle) {
    var Extensions;
    (function (Extensions) {
        var Controllers;
        (function (Controllers) {
            var MouseMove;
            (function (MouseMove) {
                function deserialize(json) {
                    Extensions.c();
                    return new MouseMove.MouseMoveController(json.start, json.end);
                }
                MouseMove.deserialize = deserialize;
            })(MouseMove = Controllers.MouseMove || (Controllers.MouseMove = {}));
        })(Controllers = Extensions.Controllers || (Extensions.Controllers = {}));
    })(Extensions = ProStyle.Extensions || (ProStyle.Extensions = {}));
})(ProStyle || (ProStyle = {}));
/// <reference path="MouseMoveController.ts" />
var ProStyle;
(function (ProStyle) {
    var Extensions;
    (function (Extensions) {
        var Controllers;
        (function (Controllers) {
            var MouseMove;
            (function (MouseMove) {
                function serialize(controller) {
                    var json = {
                        start: controller.startPercent,
                        end: controller.endPercent
                    };
                    return json;
                }
                MouseMove.serialize = serialize;
            })(MouseMove = Controllers.MouseMove || (Controllers.MouseMove = {}));
        })(Controllers = Extensions.Controllers || (Extensions.Controllers = {}));
    })(Extensions = ProStyle.Extensions || (ProStyle.Extensions = {}));
})(ProStyle || (ProStyle = {}));
//# sourceMappingURL=prostyle.controller.mousemove.js.map