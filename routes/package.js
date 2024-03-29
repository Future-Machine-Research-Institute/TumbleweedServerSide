const express = require('express')
const router = express.Router()

const DataBaseShareConfig = require("../util/db/db_config")
const DataBaseShareInstance = require("../util/db/db")

DataBaseShareConfig.dbConnectUrl = "mongodb://localhost:27017"
DataBaseShareConfig.dbConnectName = "tumbleweed"

const { successCode, failureCode, tokenNotLegalCode, userNotHavePermissionCode, responseMessage, routeHost, checkTokenLegal, checkSubPermissionLegal, setResponseLanguage} = require("../routes/routes_config")
const CheckShareInstance = require("../util/check/check")
const FileMangerInstance = require("../util/file/file")
const EDCryptionShareInstance = require("../node_modules/@future-machine-research-institute/jsbasetools/edcryption")
const path = require('path')
const fs = require('fs')

const multiparty = require('multiparty')
const { version } = require('os')
const plist = require('plist')

const {uuidCreate} = require('../util/tools/tools')
const { drawAvatar } = require("../util/tools/tools")
// const formData = new multiparty.Form();
// formData.uploadDir = path.resolve(__dirname, '..') + "\\resource\\app\\temp"
// // formData.maxFilesSize = 2 * 1024 * 1024;
// const originPath = path.resolve(__dirname, '..') + "\\resource\\app"

const originPath = path.resolve(__dirname, '..') + "\\resource\\app"
const originPathTemp = path.resolve(__dirname, '..') + "\\resource\\app\\temp"

//Just use in package.js for special method
const isTokenLegal = async (account, token) => {
  try {
    const user = await DataBaseShareInstance.findOne("users", {"account": account})
    if(user === null) {
      return false
    } else {
      const dbToken = user.token
      const isLegal = await EDCryptionShareInstance.bcryptCompareAsync(token, dbToken)
      if (!isLegal) {
        return false
      } else {
        return true
      }
    }
  } catch (error) {
    return false
  }
}

const isSubPermissionLegal = async (account) => {
  try {
      const user = await DataBaseShareInstance.findOne("users", { "account": account })
      if(user === null) {
        return false
      } else {
          if (user.permission === 0 || user.permission === 1) {
            return true
          } else {
            return false
          }
      }
  } catch (error) {
    return false
  }
}

router.post('/package/upload', setResponseLanguage, async (req, res, next) => {

  try {
    if (!fs.existsSync(originPath)) {
      await FileMangerInstance.mkdirAsync(originPath)
    }
  
    if (!fs.existsSync(originPathTemp)) {
      await FileMangerInstance.mkdirAsync(originPathTemp)
    }
  } catch (error) {
    next(error)
  }

  //formData必须每次新建
  const formData = new multiparty.Form();
  formData.uploadDir = originPathTemp
  formData.parse(req, async (err, fields, files) => {
    
    // console.log(err);
    // console.log(fields);
    // console.log(files);

    if(err) {
      next(err)
    } else {

      //数据校验,暂时只做token验证, 其他数据暂时不做校验 IOS = 0 正式版 = 0
      //从临时目录移动文件到指定目录
      //写入包和图标, IOS还需写入m配置文件
      //数据写入数据库
      //捕获到错误失败时进行文件和数据库清除操作
      let appId = null
      const package = files.package

      try {  
        // 上传完后处理
        const account = fields.account[0]
        const token = fields.token[0]
        const appName = fields.appName[0]
        // appId 在服务端生成
        // const appId = fields.appId[0]
        const md5 = fields.md5[0]
        let appIcon = ""
        if(fields.appIcon[0] === "null") {
          const appIconBuffer = drawAvatar(60, 60, appName.charAt(0))
          appIcon = 'data:image/png;base64,' + appIconBuffer.toString('base64')
        } else {
          appIcon = fields.appIcon[0]
        }
        
        const version = fields.version[0]
        //时间戳格式
        const uploadTime = fields.uploadTime[0]
        const system = typeof (fields.system[0]) === "number" ? fields.system[0] : parseInt(fields.system[0])
        const progress = typeof (fields.progress[0]) === "number" ? fields.progress[0] : parseInt(fields.progress[0])
        const description = fields.description[0]
        const descriptionLogs = [
          {
            timeStamp: uploadTime,
            description: description
          }
        ]

        // const package = files.package
        const packageType = package[0].originalFilename.match(/[^.]+$/)[0]
      
        
        //文件md5验证
        if(md5 !== (await FileMangerInstance.getFileMd5Async(package[0].path))) {
          console.log("清除app包")
          await FileMangerInstance.unlinkAsync(package[0].path)
          return res.send({
            ret: failureCode,
            message: responseMessage[req.responseLanguage].packageFileVerificationFailed
          })
        }

        //增加账号校验
        if(!CheckShareInstance.isPhoneNumber(account)) {
          console.log("清除app包")
          await FileMangerInstance.unlinkAsync(package[0].path)
          return res.send({
            ret: failureCode,
            message: responseMessage[req.responseLanguage].dataNotLegal
          })
        }

        //只做了最基本的校验
        if(((packageType === "ipa" && system === 0) || (packageType === "apk" && system === 1)) && (progress === 0 || progress === 1)) {
          if(await isTokenLegal(account, token)) {

            if(!(await isSubPermissionLegal(account))) {
              return res.send({
                ret: userNotHavePermissionCode,
                message: responseMessage[req.responseLanguage].userNotHavePermission
              })
            }

            appId = uuidCreate(16, 16)

            const dirpath = await FileMangerInstance.mkdirAsync(path.join(originPath, appId))
            const oldPackagePath = package[0].path
            const newPackagePath = path.join(dirpath, `${appId}${"p"}.${packageType}`)
            await FileMangerInstance.renameAsync(oldPackagePath, newPackagePath)
            const iconBuffer = FileMangerInstance.base64ImageToBuffer(appIcon)
            const iconPath = path.join(dirpath, `${appId}${"i"}.${iconBuffer.type}`)
            await FileMangerInstance.writeStreamBufferAsync(iconPath, iconBuffer.data)

            const staticResourceSuffix = '?timestamp=' + new Date().getTime()

            const appIconLink = `https://${routeHost}/app/${appId}/${appId}i.${iconBuffer.type}${staticResourceSuffix}`
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
            const result = await DataBaseShareInstance.insertOne("apps", {
              "appId": appId, 
              "appName": appName, 
              "version": version, 
              "appIcon": appIconLink, 
              "uploadTime": uploadTime, 
              "lastModifiedTime": uploadTime, 
              "downloadLink": downloadLink, 
              "packageLink": packageLink, 
              "uploadAccount": account, 
              "system": system, 
              "progress": progress, 
              "descriptionLogs": descriptionLogs
            })
  
            return res.send({
              ret: successCode,
              message: result
            })
  
          } else {
            console.log("清除app包")
            await FileMangerInstance.unlinkAsync(package[0].path)
            return res.send({
              ret: tokenNotLegalCode,
              message: responseMessage[req.responseLanguage].tokenNotLegal
            })
          }
          
        } else {
          console.log("清除app包")
          await FileMangerInstance.unlinkAsync(package[0].path)
          return res.send({
            ret: failureCode,
            message: responseMessage[req.responseLanguage].packageFormatNotLegal
          })
        }
      } catch (error) {
        console.log("清除app包")
        await FileMangerInstance.unlinkAsync(package[0].path)
        //在移动app包到新文件夹（新创建的文件夹）之后可能会捕获到错误
        if(appId !== null) {
          await FileMangerInstance.deleteDirectoryAsync(path.join(originPath, appId))
        }
        next(error)
      }

    }
    
  })
    
})

//先更新文件再更新数据库
router.post('/package/update', setResponseLanguage, async (req, res, next) => {

  try {
    if (!fs.existsSync(originPath)) {
      await FileMangerInstance.mkdirAsync(originPath)
    }
  
    if (!fs.existsSync(originPathTemp)) {
      await FileMangerInstance.mkdirAsync(originPathTemp)
    }
  } catch (error) {
    next(error)
  }

  //formData必须每次新建
  const formData = new multiparty.Form();
  formData.uploadDir = originPathTemp
  formData.parse(req, async (err, fields, files) => {

    if(err) {
      next(err)
    } else {

      const appId = fields.appId[0]
      const package = files.package

      try {

        // 上传完后处理
        const account = fields.account[0]
        const token = fields.token[0]
        const appName = fields.appName[0]
        const md5 = fields.md5[0]
        let appIcon = ""
        if(fields.appIcon[0] === "null") {
          const appIconBuffer = drawAvatar(60, 60, appName.charAt(0))
          appIcon = 'data:image/png;base64,' + appIconBuffer.toString('base64')
        } else {
          appIcon = fields.appIcon[0]
        }
        
        const version = fields.version[0]
        //时间戳格式
        const lastModifiedTime = fields.lastModifiedTime[0]
        const system = typeof (fields.system[0]) === "number" ? fields.system[0] : parseInt(fields.system[0])
        const progress = typeof (fields.progress[0]) === "number" ? fields.progress[0] : parseInt(fields.progress[0])
        const description = fields.description[0]

        // const package = files.package
        const packageType = package[0].originalFilename.match(/[^.]+$/)[0]
      
        
        //文件md5验证
        if(md5 !== (await FileMangerInstance.getFileMd5Async(package[0].path))) {
          console.log("清除app包")
          await FileMangerInstance.unlinkAsync(package[0].path)
          return res.send({
            ret: failureCode,
            message: responseMessage[req.responseLanguage].packageFileVerificationFailed
          })
        }

        //增加账号校验
        if(!CheckShareInstance.isPhoneNumber(account) || !CheckShareInstance.isAppId(appId)) {
          console.log("清除app包")
          await FileMangerInstance.unlinkAsync(package[0].path)
          return res.send({
            ret: failureCode,
            message: responseMessage[req.responseLanguage].dataNotLegal
          })
        }

        if(((packageType === "ipa" && system === 0) || (packageType === "apk" && system === 1)) && (progress === 0 || progress === 1)) {

          if(await isTokenLegal(account, token)) {

            if(!(await isSubPermissionLegal(account))) {
              return res.send({
                ret: userNotHavePermissionCode,
                message: responseMessage[req.responseLanguage].userNotHavePermission
              })
            }
            
            const app = await DataBaseShareInstance.findOne("apps", { "appId": appId })
            const oldDirpath = path.join(originPath, appId)
            const packagePath = path.join(oldDirpath, `${appId}p.${packageType}`)
            const iconPath = path.join(oldDirpath, `${appId}i.png`)
            const manifestPath = path.join(oldDirpath, "manifest.plist")
            const appFileExist = system === 0 ? (fs.existsSync(packagePath) && fs.existsSync(iconPath) && fs.existsSync(manifestPath)) : (fs.existsSync(packagePath) && fs.existsSync(iconPath))
            if((app === null) || (app.system !== system) || !appFileExist) {
              console.log("清除app包")
              await FileMangerInstance.unlinkAsync(package[0].path)
              return res.send({
                ret: failureCode,
                message: responseMessage[req.responseLanguage].updatePackageNotExist
              })
            } else {
              const tempPackagePath = package[0].path
              await FileMangerInstance.renameAsync(tempPackagePath, packagePath)
              const iconBuffer = FileMangerInstance.base64ImageToBuffer(appIcon)
              await FileMangerInstance.writeStreamBufferAsync(iconPath, iconBuffer.data)

              const staticResourceSuffix = '?timestamp=' + new Date().getTime()

              const appIconLink = `https://${routeHost}/app/${appId}/${appId}i.png${staticResourceSuffix}`
              const packageLink = `https://${routeHost}/app/${appId}/${appId}p.${packageType}`
              if (packageType === "ipa") {
                console.log("进行ios包特殊处理, 写入m.plist文件")
                const plistJson = {
                  "items": [{
                    "assets": [
                      {
                        "kind": "software-package",
                        "url": `${packageLink}`
                      },
                      {
                        "kind": "display-image",
                        "url": `${appIconLink}`
                      },
                      {
                        "kind": "full-size-image",
                        "url": `${appIconLink}`
                      }
                    ],
                    "metadata": {
                      "bundle-identifier": "com.*.*.*",
                      "bundle-version": "1.0.0",
                      "kind": "software",
                      "platform-identifier": "com.apple.platform.iphoneos",
                      "title": `${appName}`
                    }
                  }]
                }
                const plistContent = plist.build(plistJson)
                await FileMangerInstance.writeStreamBufferAsync(manifestPath, plistContent)
              }

              const downloadLink = system === 0 ? `itms-services://?action=download-manifest&url=https://${routeHost}/app/${appId}/manifest.plist` : `https://${routeHost}/app/${appId}/${appId}p.apk`

              let descriptionLogs = app.descriptionLogs
              descriptionLogs.push({
                timeStamp: lastModifiedTime,
                description: description
              })

              //更新数据库
              const result = await DataBaseShareInstance.updateOne("apps", {"appId": appId}, {
                "appName": appName,
                "version": version,
                "appIcon": appIconLink, 
                "lastModifiedTime": lastModifiedTime,
                "downloadLink": downloadLink, 
                "packageLink": packageLink, 
                "uploadAccount": account,
                "progress": progress,
                "descriptionLogs": descriptionLogs
              })

              return res.send({
                ret: successCode,
                message: result
              })

            }
          } else {
            console.log("清除app包")
            await FileMangerInstance.unlinkAsync(package[0].path)
            return res.send({
              ret: tokenNotLegalCode,
              message: responseMessage[req.responseLanguage].tokenNotLegal
            })
          }

        } else {
          console.log("清除app包")
          await FileMangerInstance.unlinkAsync(package[0].path)
          return res.send({
            ret: failureCode,
            message: responseMessage[req.responseLanguage].packageFormatNotLegal
          })
        }
      
      } catch (error) {
        console.log("清除app包")
        console.log(error)
        await FileMangerInstance.unlinkAsync(package[0].path)
        //在移动app包到新文件夹（新创建的文件夹）之后可能会捕获到错误
        // if(appId !== null) {
        //   await FileMangerInstance.deleteDirectoryAsync(path.join(originPath, appId))
        // }
        next(error)
      }
    }

  })

})

router.post('/package/delete', setResponseLanguage, checkTokenLegal, checkSubPermissionLegal, async (req, res, next) => {
  try {
    const appIdArray = req.body.appIdArray
    const result = await DataBaseShareInstance.deleteMany("apps", {$or:appIdArray})
    for(const object of appIdArray) {
      await FileMangerInstance.deleteDirectoryAsync(path.join(originPath, object.appId))
    }
    return res.send({
      ret: successCode,
      message: result,
    })
  } catch (error) {
    next(error)
  }
})

router.post('/package/obtain', setResponseLanguage, checkTokenLegal, checkSubPermissionLegal, async (req, res, next) => {
  try {
    const requiredCount = req.body.requiredCount
    const obtainedCount = req.body.obtainedCount
    const queryConditions = req.body.queryConditions
    const result = await DataBaseShareInstance.findSkipAndLimit("apps", queryConditions, {_id: 0, lastModifiedTime: 0, downloadLink: 0, packageLink: 0, descriptionLogs: 0}, obtainedCount, requiredCount)
    const finished = result.length < requiredCount ? true : false
    return res.send({
      ret: successCode,
      message: responseMessage[req.responseLanguage].requestSucceeded,
      items: result,
      finished: finished
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router