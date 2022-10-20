const express = require('express')
const router = express.Router()
const DataBaseShareConfig = require("../util/db/db_config")
const DataBaseShareInstance = require("../util/db/db")

DataBaseShareConfig.dbConnectUrl = "mongodb://localhost:27017"
DataBaseShareConfig.dbConnectName = "tumbleweed"

const { successCode, checkTokenLegal, setResponseLanguage, responseMessage } = require("../routes/routes_config")

router.post('/home/obtain', setResponseLanguage, checkTokenLegal, async (req, res, next) => {
    try {
        const requiredCount = req.body.requiredCount
        const obtainedCount = req.body.obtainedCount
        const queryConditions = req.body.queryConditions
        const result = await DataBaseShareInstance.findSkipAndLimit("apps", queryConditions, { _id: 0, uploadTime: 0, uploadAccount: 0 }, obtainedCount, requiredCount)
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