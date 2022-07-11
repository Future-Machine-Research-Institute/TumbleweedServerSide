
const DataBaseShareConfig = require("../util/db/db_config")
const DataBaseShareInstance = require("../util/db/db")
DataBaseShareConfig.dbConnectUrl = "mongodb://localhost:27017"
DataBaseShareConfig.dbConnectName = "tumbleweed"

const EDCryptionShareInstance = require("../node_modules/@future-machine-research-institute/jsbasetools/edcryption")

const successCode = 0
const failureCode = 1
const dataNotLegal = "数据不合法"
const accountAlreadyExists = "账号已存在"
const accountNotExists = "账号不存在"
const passwordIncorrect = "密码错误"
const tokenNotLegal = "token不合法"
const packageFormatNotLegal = "App包格式不合法"
const requestSucceeded = "请求成功"

const routeHost = "localhost"

//token验证中间件


module.exports = {
    successCode,
    failureCode,
    dataNotLegal,
    accountAlreadyExists,
    accountNotExists,
    passwordIncorrect,
    tokenNotLegal,
    packageFormatNotLegal,
    requestSucceeded,
    routeHost
}