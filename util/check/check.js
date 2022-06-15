
class Check {

    constructor() {
        
    }

    isPhoneNumber(str) {
        const reg = /^1[3456789]\d{9}$/
        return reg.test(str)
    }

    //8-20位不含特殊字符和空格
    isPassword(str) {
        if((str.length > 7 && str.length < 21) && !/[@#!*$^%&]/.test(str) && !/[/\s+/g]/.test(str)) {
            return true
        } else {
            return false
        }
    }

    //2-24位不含特殊字符和空格
    isUserName(str) {
        if((str.length > 1 && str.length < 25) && !/[@#!*$^%&]/.test(str) && !/[/\s+/g]/.test(str)) {
            return true
        } else {
            return false
        }
    }

}

const CheckShareInstance = new Check()

module.exports = CheckShareInstance


