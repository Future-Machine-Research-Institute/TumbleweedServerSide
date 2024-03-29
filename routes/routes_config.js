
const DataBaseShareConfig = require("../util/db/db_config")
const DataBaseShareInstance = require("../util/db/db")
DataBaseShareConfig.dbConnectUrl = "mongodb://localhost:27017"
DataBaseShareConfig.dbConnectName = "tumbleweed"

const EDCryptionShareInstance = require("../node_modules/@future-machine-research-institute/jsbasetools/edcryption")

const successCode = 0
const failureCode = 1
const tokenNotLegalCode = 100003
const userNotHavePermissionCode = 100004
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
const responseMessage = {
    zh: {
        dataNotLegal: "数据不合法",
        accountAlreadyExists: "账号已存在",
        accountNotExists: "账号不存在",
        passwordIncorrect: "密码错误",
        tokenNotLegal: "token不合法",
        packageFormatNotLegal: "App包格式不合法",
        packageFileVerificationFailed: "App包MD5校验失败",
        userNotHavePermission: "用户没有权限",
        updatePackageNotExist: "更新的App包不存在",
        requestSucceeded: "请求成功"
    },
    en: {
        dataNotLegal: "The data is not legitimate",
        accountAlreadyExists: "Account already exists",
        accountNotExists: "Account does not exist",
        passwordIncorrect: "Incorrect password",
        tokenNotLegal: "Tokens are not legitimate",
        packageFormatNotLegal: "The app package format is not legal",
        packageFileVerificationFailed: "The MD5 verification of the App package failed",
        userNotHavePermission: "The user does not have permissions",
        updatePackageNotExist: "The updated app package does not exist",
        requestSucceeded: "The request is successful"
    }
}

// const routeHost = "localhost"
const routeHost = "192.168.1.3"

//language
const setResponseLanguage = async (req, res, next) => {
    try {
        req.responseLanguage = ["zh", "en"].indexOf(req.headers['accept-language']) > -1 ? req.headers['accept-language'] : "en"
        next()
    } catch (error) {
        next(error)
    }
}

//token验证中间件，仅用于需要token验证的普通接口
const checkTokenLegal = async (req, res, next) => {
    try {
        const account = req.body.account
        const token = req.body.token
        const user = await DataBaseShareInstance.findOne("users", { "account": account })
        if(user === null) {
            return res.send({
                ret: tokenNotLegalCode,
                message: responseMessage[req.responseLanguage].accountNotExists
            })
        } else {
            const dbToken = user.token
            const isLegal = await EDCryptionShareInstance.bcryptCompareAsync(token, dbToken)
            if (!isLegal) {
                return res.send({
                    ret: tokenNotLegalCode,
                    message: responseMessage[req.responseLanguage].tokenNotLegal
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
const checkTopPermissionLegal = async (req, res, next) => {
    try {
        const account = req.body.account
        const user = await DataBaseShareInstance.findOne("users", { "account": account })
        if(user === null) {
            return res.send({
                ret: userNotHavePermissionCode,
                message: responseMessage[req.responseLanguage].accountNotExists
            })
        } else {
            if (user.permission === 0) {
                next()
            } else {
                return res.send({
                    ret: userNotHavePermissionCode,
                    message: responseMessage[req.responseLanguage].userNotHavePermission
                })
            }
        }
    } catch (error) {
        next(error)
    }
}

const checkSubPermissionLegal = async (req, res, next) => {
    try {
        const account = req.body.account
        const user = await DataBaseShareInstance.findOne("users", { "account": account })
        if(user === null) {
            return res.send({
                ret: userNotHavePermissionCode,
                message: responseMessage[req.responseLanguage].accountNotExists
            })
        } else {
            if (user.permission === 0 || user.permission === 1) {
                next()
            } else {
                return res.send({
                    ret: userNotHavePermissionCode,
                    message: responseMessage[req.responseLanguage].userNotHavePermission
                })
            }
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {
    successCode,
    failureCode,
    tokenNotLegalCode,
    userNotHavePermissionCode,
    responseMessage,
    dataNotLegal,
    accountAlreadyExists,
    accountNotExists,
    passwordIncorrect,
    tokenNotLegal,
    packageFormatNotLegal,
    packageFileVerificationFailed,
    updatePackageNotExist,
    userNotHavePermission,
    requestSucceeded,
    routeHost,
    checkTokenLegal,
    checkTopPermissionLegal,
    checkSubPermissionLegal,
    setResponseLanguage
}