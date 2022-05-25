const express = require('express')
const router = express.Router()
const DataBaseShareConfig = require("../util/db/db_config")
const DataBaseShareInstance = require("../util/db/db")

DataBaseShareConfig.dbConnectUrl = "mongodb://localhost:27017"
DataBaseShareConfig.dbConnectName = "tumbleweed"

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   try {
//     DataBaseShareInstance.find("users", {}).then(result => {
//       res.send(JSON.stringify(result))
//     }).catch(error => {
//       next(error)
//     })
//   } catch (error) {
//     next(error)
//   }
// })

router.get('/', async (req, res, next) => {

  try {
    const result = await DataBaseShareInstance.find("users", {})
    res.send(JSON.stringify(result))
  } catch (error) {
    next(error)
  }

  // DataBaseShareInstance.find("users", {}, (error, result) => {
  //   if(!error) {
  //     res.send(JSON.stringify(result))
  //   } else {
  //     next(error)
  //   }
  // })

  // try {
  //   const result = await DataBaseShareInstance.updateOne("users", {"name" : "xj"}, {"password" : "123"})
  //   res.send(JSON.stringify(result))
  // } catch (error) {
  //   next(error)
  // }

  // DataBaseShareInstance.updateOne("users", {"name" : "xj"}, {"password" : "123456"}, (error, result) => {
  //   if(!error) {
  //     res.send(JSON.stringify(result))
  //   } else {
  //     next(error)
  //   }
  // })

  // try {
  //   const result = await DataBaseShareInstance.updateMany("users", {"name" : "xj"}, {"password" : "123"})
  //   res.send(JSON.stringify(result))
  // } catch (error) {
  //   next(error)
  // }

  // DataBaseShareInstance.updateMany("users", {"name" : "xj"}, {"password" : "123456"}, (error, result) => {
  //   if(!error) {
  //     res.send(JSON.stringify(result))
  //   } else {
  //     next(error)
  //   }
  // })

  // try {
  //   const result = await DataBaseShareInstance.insertOne("users", {"name" : "xj", "account" : "17826804289", "password" : "123456"})
  //   res.send(JSON.stringify(result))
  // } catch (error) {
  //   next(error)
  // }

  // const insertArray = [
  //   {"name" : "xj", "account" : "17826804289", "password" : "123456"},
  //   {"name" : "xj", "account" : "17826804289", "password" : "123456"},
  //   {"name" : "xj", "account" : "17826804289", "password" : "123456"},
  //   {"name" : "xj", "account" : "17826804289", "password" : "123456"}
  // ]

  // DataBaseShareInstance.insertMany("users", insertArray, (error, result) => {
  //   if(!error) {
  //     res.send(JSON.stringify(result))
  //   } else {
  //     next(error)
  //   }
  // })

  // try {
  //   const result = await DataBaseShareInstance.deleteOne("users", {"name" : "xj"})
  //   res.send(JSON.stringify(result))
  // } catch (error) {
  //   next(error)
  // }

  // DataBaseShareInstance.deleteOne("users", {"name" : "xj"}, (error, result) => {
  //   if(!error) {
  //     res.send(JSON.stringify(result))
  //   } else {
  //     next(error)
  //   }
  // })

  // try {
  //   const result = await DataBaseShareInstance.deleteMany("users", {"name" : "xj"})
  //   res.send(JSON.stringify(result))
  // } catch (error) {
  //   next(error)
  // }

  // DataBaseShareInstance.deleteMany("users", {"name" : "xj"}, (error, result) => {
  //   if(!error) {
  //     res.send(JSON.stringify(result))
  //   } else {
  //     next(error)
  //   }
  // })

})

module.exports = router
