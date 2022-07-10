
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

    async mkdirAsync(newPath) {
        return new Promise(async (resolve, reject) => {
            console.log("newPath: ", newPath)
            if (!fs.existsSync(newPath)) {
                fs.mkdir(newPath, (err) => {
                    if(err) {
                        console.log("mkdir failed: ", err)
                        return reject(err)
                    } else {
                        return resolve(newPath)
                    }
                })
            } else {
                return resolve(newPath)
            }
            
        })
    }

    async renameAsync(oldFilePath, newFilePath) {
        return new Promise(async (resolve, reject) => {

            fs.rename(oldFilePath, newFilePath, (err) => {
                if(err) {
                    console.log("rename failed: ", err)
                    return reject(false)
                } else {
                    return resolve(true)
                }
            })
            
        })
    }

}


const FileMangerInstance = new FileManger()

module.exports = FileMangerInstance