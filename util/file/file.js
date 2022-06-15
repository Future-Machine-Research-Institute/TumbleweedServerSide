
const fs = require('fs')

class FileManger  {

    constructor() {
        
    }

    async writeStreamBufferAsync(path, buffer) {
        return new Promise(async (resolve, reject) => {

            const writeStream = fs.createWriteStream(path)

            writeStream.on('error', (err) => {
                console.log("发生异常：", err)
                return reject(err)
            })

            writeStream.on('open', (fd) => {
                console.log("文件已打开：", fd)
            })

            writeStream.on('finish', () => {
                console.log("写入已完成..")
                return resolve(path)
            })

            writeStream.on('close', () => {
                console.log("文件已关闭")
            })

            writeStream.write(buffer)
            writeStream.end()
            
        })
    }

}


const FileMangerInstance = new FileManger()

module.exports = FileMangerInstance