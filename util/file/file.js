
const fs = require('fs')
const crypto = require('crypto')

class FileManger  {

    constructor() {
        
    }

    base64ImageToBuffer(base64String) {
        const buffer = new Object()
        const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
        // if (matches.length !== 3) {
        //     return new Error('Invalid base64String');
        // }
        buffer.type = matches[1].match(/\/(.*?)$/)[1]
        buffer.data = Buffer.from(matches[2], 'base64')
        return buffer
    }

    async writeStreamBufferAsync(path, buffer) {
        return new Promise(async (resolve, reject) => {

            const writeStream = fs.createWriteStream(path)

            writeStream.on('error', (err) => {
                // console.log("发生异常：", err)
                return reject(err)
            })

            writeStream.on('open', (fd) => {
                // console.log("文件已打开：", fd)
            })

            writeStream.on('finish', () => {
                // console.log("写入已完成..")
                return resolve(path)
            })

            writeStream.on('close', () => {
                // console.log("文件已关闭")
            })

            writeStream.write(buffer)
            writeStream.end()
            
        })
    }

    async getFileMd5Async(path) {
        return new Promise(async (resolve, reject) => {

            const readStream = fs.createReadStream(path)
            const hash = crypto.createHash('md5')

            readStream.on('error', (err) => {
                return reject(err)
            })

            readStream.on('open', (fd) => {
                console.log("文件已打开：", fd)
            })

            readStream.on('data', (data) => {
                hash.update(data)
            })

            readStream.on('close', () => {
                console.log("文件已关闭")
            })

            readStream.on('end', () => {
                const md5 = hash.digest('hex')
                return resolve(md5)
            })
            
        })
    }

    async mkdirAsync(newPath) {
        return new Promise(async (resolve, reject) => {
            
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
                    return reject(err)
                } else {
                    return resolve(newFilePath)
                }
            })
            
        })
    }

    async unlinkAsync(filePath) {
        return new Promise(async (resolve, reject) => {

            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                    if(err) {
                        console.log("unlink failed: ", err)
                        return reject(err)
                    } else {
                        return resolve(filePath)
                    }
                })
            } else {
                return resolve(filePath)
            }
            
        })
    }

    async deleteDirectoryAsync(directoryPath) {
        return new Promise(async (resolve, reject) => {

            try {
                if(fs.existsSync(directoryPath)) {
                    const files = fs.readdirSync(directoryPath)
                    files.forEach((file) => {
                        const curPath = directoryPath + "/" + file
                        if(fs.statSync(curPath).isDirectory()) {
                            deleteDirectoryAsync(curPath)
                        } else {
                            fs.unlinkSync(curPath)
                        }
                    })
                    fs.rmdirSync(directoryPath)
                    return resolve(directoryPath)
                } else {
                    return resolve(directoryPath)
                }
            } catch (error) {
                return reject(error)
            }

        })
    }

}


const FileMangerInstance = new FileManger()

module.exports = FileMangerInstance