
const EDCryptionShareInstance = require("@future-machine-research-institute/jsbasetools")
const saltRounds = 10
const myPlaintextPassword = 's0/\/\P4$$w0rD'
const someOtherPlaintextPassword = 'not_bacon'

let result = EDCryptionShareInstance.bcryptHashSync(myPlaintextPassword, saltRounds)
console.log(EDCryptionShareInstance.bcryptCompareSync(someOtherPlaintextPassword, result))
