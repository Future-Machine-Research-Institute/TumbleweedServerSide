const EDCryptionShareInstance = require("./util/edcryption/edcryption")

const saltRounds = 10
const myPlaintextPassword = 's0/\/\P4$$w0rD'
const someOtherPlaintextPassword = 'not_bacon'

let result = EDCryptionShareInstance.bcryptHashSync(myPlaintextPassword, saltRounds)
console.log(EDCryptionShareInstance.bcryptCompareSync(myPlaintextPassword, result))

// async function test(rawString, saltRounds) {
//     return new Promise(async (resolve, reject) => {
//         try {
//             let resultString = await EDCryptionShareInstance.bcryptHashAsync(rawString, saltRounds)
//             let isSame = await EDCryptionShareInstance.bcryptCompareAsync(rawString, resultString)
//             return resolve(isSame) 
//         } catch (error) {
//             return reject(error)
//         }
//     })
// }

// async function main(rawString, saltRounds) {
//     let result = await test(rawString, saltRounds)
//     console.log(result)
// }

// main(myPlaintextPassword, saltRounds)