const express = require('express')
const router = express.Router()
const DataBaseShareConfig = require("../util/db/db_config")
const DataBaseShareInstance = require("../util/db/db")

DataBaseShareConfig.dbConnectUrl = "mongodb://localhost:27017"
DataBaseShareConfig.dbConnectName = "tumbleweed"

const { successCode, failureCode, dataNotLegal, accountAlreadyExists, accountNotExists, passwordIncorrect, requestSucceeded } = require("../routes/routes_config")
const CheckShareInstance = require("../util/check/check")
const { drawAvatar } = require("../util/tools/tools")
const FileMangerInstance = require("../util/file/file")
const EDCryptionShareInstance = require("../node_modules/@future-machine-research-institute/jsbasetools/edcryption")
const path = require('path')

/* GET users listing. */

router.post('/users/register', async (req, res, next) => {

  try {
    const name = req.body.name
    const shortName = name.charAt(0)
    const account = req.body.account
    const password = req.body.password
    const permission = req.body.permission
    if(CheckShareInstance.isUserName(name) && CheckShareInstance.isPhoneNumber(account)) {
      const user = await DataBaseShareInstance.findOne("users", {"account": account})
      if(user !== null) {
        res.send({
          ret: failureCode,
          message: accountAlreadyExists
        })
      } else {
        const avatarBuffer = drawAvatar(40, 40, shortName)
        const encryptionPassword = await EDCryptionShareInstance.bcryptHashAsync(password, 10)
        const avatarPath = await FileMangerInstance.writeStreamBufferAsync(path.resolve(__dirname, '..') + `\\resource\\avatar\\${account}.png`, avatarBuffer)
        const result = await DataBaseShareInstance.insertOne("users", {"name": name, "account": account, "password": encryptionPassword, "avatar": avatarPath, "permission": permission, "token": null})
        res.send({
          ret: successCode,
          message: result
        })
      }
    } else {
      res.send({
        ret: failureCode,
        message: dataNotLegal
      })
    }
  } catch (error) {
    next(error)
  }
  
})

router.post('/users/login', async (req, res, next) => {

  try {
    const account = req.body.account
    const password = req.body.password
    if(CheckShareInstance.isPhoneNumber(account)) {
      const user = await DataBaseShareInstance.findOne("users", {"account": account})
      if(user === null) {
        res.send({
          ret: failureCode,
          message: accountNotExists
        })
      } else {
        const dbPassword = user.password
        const isPasswordCorrect = await EDCryptionShareInstance.bcryptCompareAsync(password, dbPassword)
        if(isPasswordCorrect === true) {
          //生成token(NanoID)，返回客户端并保存到user表
          const { nanoid } = await import('nanoid/async')
          const sourceToken = await nanoid()
          const encryptionToken = await EDCryptionShareInstance.bcryptHashAsync(sourceToken, 10)
          const result = await DataBaseShareInstance.updateOne("users", {"account" : account}, {"token" : sourceToken})
          res.send({
            ret: successCode,
            token: encryptionToken,
            message: result
          })
        } else {
          res.send({
            ret: failureCode,
            message: passwordIncorrect
          })
        }
      }
    } else {
      res.send({
        ret: failureCode,
        message: dataNotLegal
      })
    }
  } catch (error) {
    next(error)
  }

})

// router.get('/', async (req, res, next) => {

//   try {
//     const result = await DataBaseShareInstance.find("users", {})
//     res.send(JSON.stringify(result))
//   } catch (error) {
//     next(error)
//   }

//   DataBaseShareInstance.find("users", {}, (error, result) => {
//     if(!error) {
//       res.send(JSON.stringify(result))
//     } else {
//       next(error)
//     }
//   })

//   try {
//     const result = await DataBaseShareInstance.updateOne("users", {"name" : "xj"}, {"password" : "123"})
//     res.send(JSON.stringify(result))
//   } catch (error) {
//     next(error)
//   }

//   DataBaseShareInstance.updateOne("users", {"name" : "xj"}, {"password" : "123456"}, (error, result) => {
//     if(!error) {
//       res.send(JSON.stringify(result))
//     } else {
//       next(error)
//     }
//   })

//   try {
//     const result = await DataBaseShareInstance.updateMany("users", {"name" : "xj"}, {"password" : "123"})
//     res.send(JSON.stringify(result))
//   } catch (error) {
//     next(error)
//   }

//   DataBaseShareInstance.updateMany("users", {"name" : "xj"}, {"password" : "123456"}, (error, result) => {
//     if(!error) {
//       res.send(JSON.stringify(result))
//     } else {
//       next(error)
//     }
//   })

//   try {
//     const result = await DataBaseShareInstance.insertOne("users", {"name" : "xj", "account" : "17826804289", "password" : "123456"})
//     res.send(JSON.stringify(result))
//   } catch (error) {
//     next(error)
//   }

//   const insertArray = [
//     {"name" : "xj", "account" : "17826804289", "password" : "123456"},
//     {"name" : "xj", "account" : "17826804289", "password" : "123456"},
//     {"name" : "xj", "account" : "17826804289", "password" : "123456"},
//     {"name" : "xj", "account" : "17826804289", "password" : "123456"}
//   ]

//   DataBaseShareInstance.insertMany("users", insertArray, (error, result) => {
//     if(!error) {
//       res.send(JSON.stringify(result))
//     } else {
//       next(error)
//     }
//   })

//   try {
//     const result = await DataBaseShareInstance.deleteOne("users", {"name" : "xj"})
//     res.send(JSON.stringify(result))
//   } catch (error) {
//     next(error)
//   }

//   DataBaseShareInstance.deleteOne("users", {"name" : "xj"}, (error, result) => {
//     if(!error) {
//       res.send(JSON.stringify(result))
//     } else {
//       next(error)
//     }
//   })

//   try {
//     const result = await DataBaseShareInstance.deleteMany("users", {"name" : "xj"})
//     res.send(JSON.stringify(result))
//   } catch (error) {
//     next(error)
//   }

//   DataBaseShareInstance.deleteMany("users", {"name" : "xj"}, (error, result) => {
//     if(!error) {
//       res.send(JSON.stringify(result))
//     } else {
//       next(error)
//     }
//   })

// })

module.exports = router
