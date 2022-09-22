
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
const packageFileVerificationFailed = "App包MD5校验失败"
const userNotHavePermission = "用户没有权限"
const updatePackageNotExist = "更新的App包不存在"
const requestSucceeded = "请求成功"

// const routeHost = "localhost"
const routeHost = "192.168.1.3"

//token验证中间件，仅用于需要token验证的普通接口
const checkTokenLegal = async (req, res, next) => {
    const account = req.body.account
    const token = req.body.token
    try {
        const user = await DataBaseShareInstance.findOne("users", { "account": account })
        if(user === null) {
            res.send({
                ret: failureCode,
                message: accountNotExists
            })
        } else {
            const dbToken = user.token
            const isLegal = await EDCryptionShareInstance.bcryptCompareAsync(token, dbToken)
            if (!isLegal) {
                res.send({
                    ret: failureCode,
                    message: tokenNotLegal
                })
            } else {
                next()
            }
        }
    } catch (error) {
        next(error)
    }
}

// top-admin: permission === 0 | sub-admin === 1 | ordinary === 2
const CheckTopPermissionLegal = async (req, res, next) => {
    const account = req.body.account
    try {
        const user = await DataBaseShareInstance.findOne("users", { "account": account })
        if(user === null) {
            res.send({
                ret: failureCode,
                message: accountNotExists
            })
        } else {
            if (user.permission !== 0) {
                res.send({
                    ret: failureCode,
                    message: userNotHavePermission
                })
            } else {
                next()
            }
        }
    } catch (error) {
        next(error)
    }
}

const CheckSubPermissionLegal = async (req, res, next) => {
    const account = req.body.account
    try {
        const user = await DataBaseShareInstance.findOne("users", { "account": account })
        if(user === null) {
            res.send({
                ret: failureCode,
                message: accountNotExists
            })
        } else {
            if (user.permission !== 0 || user.permission !== 1) {
                res.send({
                    ret: failureCode,
                    message: userNotHavePermission
                })
            } else {
                next()
            }
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {
    successCode,
    failureCode,
    dataNotLegal,
    accountAlreadyExists,
    accountNotExists,
    passwordIncorrect,
    tokenNotLegal,
    packageFormatNotLegal,
    packageFileVerificationFailed,
    updatePackageNotExist,
    requestSucceeded,
    routeHost,
    checkTokenLegal,
    CheckTopPermissionLegal,
    CheckSubPermissionLegal
}