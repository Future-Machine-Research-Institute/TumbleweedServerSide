
// const EDCryptionShareInstance = require("./node_modules/@future-machine-research-institute/jsbasetools/edcryption")
// const saltRounds = 10
// const myPlaintextPassword = 'dzxzSR6DE0BVTt_wDx_aH'
// const someOtherPlaintextPassword = 'not_bacon'

// let result = EDCryptionShareInstance.bcryptHashSync(myPlaintextPassword, saltRounds)
// console.log(EDCryptionShareInstance.bcryptCompareSync(myPlaintextPassword, "$2a$10$pFM.o/CiE8s7EWowjjyscO.dKKe0EwfuxrBSwa6gyO2Nr/rT6nySi"))

// const CheckShareInstance = require("./util/check/check.js")

// console.log(CheckShareInstance.isPhoneNumber("17826805863"))

// console.log(CheckShareInstance.isPassword("178268058631"))

// console.log(CheckShareInstance.isUserName("我你好y_"))

// const fs = require("fs"), { createCanvas } = require("canvas")

// const FileMangerInstance = require("./util/file/file.js")

// const WIDTH = 40;
// const HEIGHT = 40;

// const canvas = createCanvas(WIDTH, HEIGHT);
// const ctx = canvas.getContext("2d");

// ctx.fillStyle = "#222222";
// ctx.fillRect(0, 0, WIDTH, HEIGHT);
// ctx.fillStyle = "#f2f2f2";
// ctx.font = "32px Arial";
// ctx.fillText("Hello", 13, 35);

// const buffer = canvas.toBuffer("image/png");
// FileMangerInstance.writeStreamBufferAsync(__dirname + "/resource/avatar/test.png", buffer)

// const EDCryptionShareInstance = require("./node_modules/@future-machine-research-institute/jsbasetools/edcryption")
// const saltRounds = 10
// const password = "123456789"
// const EDCryptionShareInstance = require("./node_modules/@future-machine-research-institute/jsbasetools/edcryption")
// console.log("md5: ", EDCryptionShareInstance.md5HashSync(password))

// const {drawAvatar} = require("./util/tools/tools")
// const FileMangerInstance = require("./util/file/file.js")
// FileMangerInstance.writeStreamBufferAsync(__dirname + "/resource/avatar/test.png", drawAvatar(40, 40, "徐"))

// const DataBaseShareConfig = require("./util/db/db_config")
// const DataBaseShareInstance = require("./util/db/db")

// DataBaseShareConfig.dbConnectUrl = "mongodb://localhost:27017"
// DataBaseShareConfig.dbConnectName = "tumbleweed"

// DataBaseShareInstance.findOne("users", {"account": "17826805865"}, (error, result) => {
//     if(error) {
//         console.log(error)
//     } else {
//         console.log(result)
//     }
// })