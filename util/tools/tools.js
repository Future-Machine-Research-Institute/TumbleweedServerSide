
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

module.exports = {
    drawAvatar
}