
// const EDCryptionShareInstance = require("./node_modules/@future-machine-research-institute/jsbasetools/edcryption")
// const saltRounds = 10
// const myPlaintextPassword = 's0/\/\P4$$w0rD'
// const someOtherPlaintextPassword = 'not_bacon'

// let result = EDCryptionShareInstance.bcryptHashSync(myPlaintextPassword, saltRounds)
// console.log(EDCryptionShareInstance.bcryptCompareSync(someOtherPlaintextPassword, result))

const CheckShareInstance = require("./util/check/check.js")

console.log(CheckShareInstance.isPhoneNumber("17826805863"))

console.log(CheckShareInstance.isPassword("178268058631"))
