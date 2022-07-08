const express = require('express')
const router = express.Router()

const DataBaseShareConfig = require("../util/db/db_config")
const DataBaseShareInstance = require("../util/db/db")

DataBaseShareConfig.dbConnectUrl = "mongodb://localhost:27017"
DataBaseShareConfig.dbConnectName = "tumbleweed"

const { successCode, failureCode, dataNotLegal, accountAlreadyExists, accountNotExists, passwordIncorrect, requestSucceeded } = require("../routes/routes_config")
const CheckShareInstance = require("../util/check/check")
const FileMangerInstance = require("../util/file/file")
const EDCryptionShareInstance = require("../node_modules/@future-machine-research-institute/jsbasetools/edcryption")
const path = require('path')
const multiparty = require('multiparty')

router.post('/package/upload', async (req, res, next) => {

    try {

        //数据校验
        //写入包和图标
        //数据写入数据库
        
        // 接收参数
        let form = new multiparty.Form();
        // 设置文件存储路径
        form.uploadDir = path.resolve(__dirname, '..') + "\\resource\\app";
        // 设置单文件大小设置
        //form.maxFilesSize = 2 * 1024 * 1024;
        // 上传完后处理
        form.parse(req, function (err, fields, files) {
          console.log(err);
          console.log(fields);
          // console.log(files);
          res.send({
            ret: successCode,
            message: requestSucceeded
          })
        })
        
    } catch (error) {
      next(error)
    }
    
  })

module.exports = router