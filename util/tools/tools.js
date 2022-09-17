
const { createCanvas } = require("canvas")

//返回buffer
const drawAvatar = function(width, height, rawString) {
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext("2d")
    ctx.fillStyle = "#409eff"
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = "#ffffff"
    ctx.font = "32px Sans"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(rawString, width / 2.0, height / 2.0)
    const buffer = canvas.toBuffer("image/png")
    return buffer
}

const uuidCreate = function(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;
    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        var r;
        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
}

module.exports = {
    drawAvatar,
    uuidCreate
}