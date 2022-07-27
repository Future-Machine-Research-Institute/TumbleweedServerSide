
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

// async function test() {
//     const { nanoid } = await import('nanoid/async')
//     const appId = await nanoid()
//     console.log(appId)
// }
// test()

// const fs = require('fs')
// const plist = require('plist')
// const path = require('path')
// const plistPath = path.resolve(__dirname, '.') + "/resource/app/test/manifest.plist"
// console.log(path)
// // var obj = plist.parse(fs.readFileSync(plistPath, 'utf8'))
// // console.log(JSON.stringify(obj))

// const ipaUrl = "https://192.168.1.3/app/test/testp.ipa"

// const displayImageUrl = "https://192.168.1.3/app/test/testi.png"

// const fullSizeImageUrl = "https://192.168.1.3/app/test/testi.png"

// const plistJson = {
//     "items":[{
//         "assets":[
//             {
//                 "kind":"software-package",
//                 "url":`${ipaUrl}`
//             },
//             {
//                 "kind":"display-image",
//                 "url":`${displayImageUrl}`
//             },
//             {
//                 "kind":"full-size-image",
//                 "url":`${fullSizeImageUrl}`
//             }
//         ],
//         "metadata":{
//             "bundle-identifier":"com.*.*.*",
//             "bundle-version":"1.0.0",
//             "kind":"software",
//             "platform-identifier":"com.apple.platform.*",
//             "title":"WebTestNoIcon"
//         }
//     }]
// }

// const plistContent = plist.build(plistJson)
// const FileMangerInstance = require("./util/file/file.js")
// FileMangerInstance.writeStreamBufferAsync(__dirname + "/resource/app/temp/manifest.plist", plistContent)
