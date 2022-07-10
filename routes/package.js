const express = require('express')
const router = express.Router()

const DataBaseShareConfig = require("../util/db/db_config")
const DataBaseShareInstance = require("../util/db/db")

DataBaseShareConfig.dbConnectUrl = "mongodb://localhost:27017"
DataBaseShareConfig.dbConnectName = "tumbleweed"

const { successCode, failureCode, dataNotLegal, accountAlreadyExists, accountNotExists, passwordIncorrect, tokenNotLegal, requestSucceeded } = require("../routes/routes_config")
const CheckShareInstance = require("../util/check/check")
const FileMangerInstance = require("../util/file/file")
const EDCryptionShareInstance = require("../node_modules/@future-machine-research-institute/jsbasetools/edcryption")
const path = require('path')

const multiparty = require('multiparty')
const formData = new multiparty.Form();
formData.uploadDir = path.resolve(__dirname, '..') + "\\resource\\app\\temp"
// formData.maxFilesSize = 2 * 1024 * 1024;
const originPath = path.resolve(__dirname, '..') + "\\resource\\app"

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

  formData.parse(req, async (err, fields, files) => {

    console.log(err);
    console.log(fields);
    console.log(files);

    if(err) {
      next(error)
    } else {

      try {

        //数据校验,暂时只做token验证,文件和其他数据暂时不做校验
        //从临时目录移动文件到指定目录
        //写入包和图标
        //数据写入数据库
        
        // 上传完后处理

        const account = fields.account[0]
        const token = fields.token[0]
        const appId = fields.appId[0]
        const appIcon = fields.appIcon[0]
        const appName = fields.appName[0]
        const uploadTime = fields.uploadTime[0]
        const system = fields.system[0]
        const progress = fields.progress[0]

        const package = files.package

        if(await isTokenLegal(account, token)) {
          const dirpath = await FileMangerInstance.mkdirAsync(path.join(originPath, appId))
          const oldPackagePath = package[0].path
          const newPackagePath = path.join(dirpath, `${appId}.apk`)
          const isSucceed = await FileMangerInstance.renameAsync(oldPackagePath, newPackagePath)

          res.send({
            ret: successCode,
            message: requestSucceeded
          })

        } else {
          res.send({
            ret: failureCode,
            message: tokenNotLegal
          })
        }
        
      } catch (error) {
        next(error)
      }

    }
    
  })
    
})

module.exports = router