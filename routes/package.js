const express = require('express')
const router = express.Router()

const DataBaseShareConfig = require("../util/db/db_config")
const DataBaseShareInstance = require("../util/db/db")

DataBaseShareConfig.dbConnectUrl = "mongodb://localhost:27017"
DataBaseShareConfig.dbConnectName = "tumbleweed"

const { successCode, failureCode, dataNotLegal, accountAlreadyExists, accountNotExists, passwordIncorrect, tokenNotLegal, packageFormatNotLegal, requestSucceeded, routeHost} = require("../routes/routes_config")
const CheckShareInstance = require("../util/check/check")
const FileMangerInstance = require("../util/file/file")
const EDCryptionShareInstance = require("../node_modules/@future-machine-research-institute/jsbasetools/edcryption")
const path = require('path')

const multiparty = require('multiparty')
const { version } = require('os')
const plist = require('plist')
// const formData = new multiparty.Form();
// formData.uploadDir = path.resolve(__dirname, '..') + "\\resource\\app\\temp"
// // formData.maxFilesSize = 2 * 1024 * 1024;
// const originPath = path.resolve(__dirname, '..') + "\\resource\\app"

const isTokenLegal = async (account, token) => {
  try {
    const user = await DataBaseShareInstance.findOne("users", {"account": account})
    const dbToken = user.token
    const isLegal = await EDCryptionShareInstance.bcryptCompareAsync(token, dbToken)
    if(user === null || !isLegal) {
      console.log("token不合法")
      return false
    } else {
      return true
    }
  } catch (error) {
    return false
  }
}

router.post('/package/upload', async (req, res, next) => {

  //formData必须每次新建
  const formData = new multiparty.Form();
  formData.uploadDir = path.resolve(__dirname, '..') + "\\resource\\app\\temp"
  const originPath = path.resolve(__dirname, '..') + "\\resource\\app"
  formData.parse(req, async (err, fields, files) => {
    
    // console.log(err);
    // console.log(fields);
    // console.log(files);

    if(err) {
      next(error)
    } else {
      
      //数据校验,暂时只做token验证,文件和其他数据暂时不做校验 IOS = 0 正式版 = 0
      //从临时目录移动文件到指定目录
      //写入包和图标, IOS还需写入m配置文件
      //数据写入数据库
      //捕获到错误失败时进行文件和数据库清除操作
        
      // 上传完后处理
      const account = fields.account[0]
      const token = fields.token[0]
      const appId = fields.appId[0]
      const appIcon = fields.appIcon[0]
      const appName = fields.appName[0]
      const version = fields.version[0]
      const uploadTime = fields.uploadTime[0]
      const system = typeof(fields.system[0]) === "number" ? fields.system[0] : parseInt(fields.system[0]) 
      const progress = typeof(fields.progress[0]) === "number" ? fields.progress[0] : parseInt(fields.progress[0])

      const package = files.package
      const packageType = package[0].originalFilename.match(/[^.]+$/)[0]

      try {

        //只做了最基本的校验
        if(((packageType === "ipa" && system === 0) || (packageType === "apk" && system === 1)) && (progress === 0 || progress === 1)) {
          if(await isTokenLegal(account, token)) {
            const dirpath = await FileMangerInstance.mkdirAsync(path.join(originPath, appId))
            const oldPackagePath = package[0].path
            const newPackagePath = path.join(dirpath, `${appId}${"p"}.${packageType}`)
            await FileMangerInstance.renameAsync(oldPackagePath, newPackagePath)
            const iconBuffer = FileMangerInstance.base64ImageToBuffer(appIcon)
            const iconPath = path.join(dirpath, `${appId}${"i"}.${iconBuffer.type}`)
            await FileMangerInstance.writeStreamBufferAsync(iconPath, iconBuffer.data)

            const appIconLink = `https://${routeHost}/app/${appId}/${appId}i.${iconBuffer.type}`
            const packageLink = `https://${routeHost}/app/${appId}/${appId}p.${packageType}`
            if(packageType === "ipa") {
              console.log("进行ios包特殊处理, 写入m.plist文件")
              const plistJson = {
                "items":[{
                    "assets":[
                        {
                            "kind":"software-package",
                            "url":`${packageLink}`
                        },
                        {
                            "kind":"display-image",
                            "url":`${appIconLink}`
                        },
                        {
                            "kind":"full-size-image",
                            "url":`${appIconLink}`
                        }
                    ],
                    "metadata":{
                        "bundle-identifier":"com.*.*.*",
                        "bundle-version":"1.0.0",
                        "kind":"software",
                        "platform-identifier":"com.apple.platform.iphoneos",
                        "title":`${appName}`
                    }
                }]
              }
              const plistContent = plist.build(plistJson)
              const plistPath = path.join(dirpath, "manifest.plist")
              await FileMangerInstance.writeStreamBufferAsync(plistPath, plistContent)
            }
  
            const downloadLink = system === 0 ? `itms-services://?action=download-manifest&url=https://${routeHost}/app/${appId}/manifest.plist` : `https://${routeHost}/app/${appId}/${appId}p.apk`
            //写入数据库
            const result = await DataBaseShareInstance.insertOne("apps", {"appId": appId, "appName": appName, "version": version, "appIcon": appIconLink, "uploadTime": uploadTime, "lastModifiedTime": uploadTime, "downloadLink": downloadLink, "package": packageLink, "uploadAccount": account, "system": system, "progress": progress})
  
            res.send({
              ret: successCode,
              message: result
            })
  
          } else {
            console.log("清除app包")
            await FileMangerInstance.unlinkAsync(package[0].path)
            res.send({
              ret: failureCode,
              message: tokenNotLegal
            })
          }
          
        } else {
          console.log("清除app包")
          await FileMangerInstance.unlinkAsync(package[0].path)
          res.send({
            ret: failureCode,
            message: packageFormatNotLegal
          })
        }
      } catch (error) {
        console.log("清除app包")
        await FileMangerInstance.unlinkAsync(package[0].path)
        await FileMangerInstance.deleteDirectoryAsync(path.join(originPath, appId))
        next(error)
      }

    }
    
  })
    
})

module.exports = router