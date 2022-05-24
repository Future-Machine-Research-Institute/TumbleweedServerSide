const express = require('express')
const router = express.Router()
const DataBaseShareConfig = require("../util/db/db_config")
const DataBaseShareInstance = require("../util/db/db")

DataBaseShareConfig.dbConnectUrl = "mongodb://localhost:27017"
DataBaseShareConfig.dbConnectName = "tumbleweed"

/* GET users listing. */
router.get('/', function(req, res, next) {
  try {
    DataBaseShareInstance.find("users", {}).then(result => {
      res.send(JSON.stringify(result))
    }).catch(error => {
      next(error)
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
