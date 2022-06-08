
class Check {

    constructor() {
        
    }

    isPhoneNumber(str) {
        const reg = /^1[3456789]\d{9}$/
        return reg.test(str)
    }

    isPassword(str) {
        if((str.length > 8 && str.length < 20) && !/[@#!*$^%&]/.test(str)) {
            return true
        } else {
            return false
        }
    }

}

const CheckShareInstance = new Check()

module.exports = CheckShareInstance


