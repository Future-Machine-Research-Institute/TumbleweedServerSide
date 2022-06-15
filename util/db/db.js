// import { MongoClient } from "mongodb";
// import DataBaseShareConfig from "./db_config.js";
const { MongoClient } = require("mongodb")
const DataBaseShareConfig = require("./db_config")

class DataBase {

    #db
    #dbConnected

    constructor() {
        this.#db = null
        this.#dbConnected = false
    }

    async #connect(callback) {
        if(this.#dbConnected === true) {
            if(callback && typeof callback === "function") {
                callback(null, this.#db)
            } else {
                return new Promise(async (resolve, reject) => {
                    return resolve(this.#db)
                })
            }
        } else {
            if(callback && typeof callback === "function") {
                console.log(`begain to connecting: ${DataBaseShareConfig.dbConnectUrl}`)
                MongoClient.connect(DataBaseShareConfig.dbConnectUrl, (error, result) => {
                    if(!error) {
                        this.#db = result.db(DataBaseShareConfig.dbConnectName)
                        this.#dbConnected = true
                        console.log(`db: ${DataBaseShareConfig.dbConnectName} connected succeed`)
                        callback(error, this.#db)
                    } else {
                        this.#dbConnected = false
                        callback(error, null)
                    }
                })
            } else {
                return new Promise(async (resolve, reject) => {
                    try {
                        console.log(`begain to connecting: ${DataBaseShareConfig.dbConnectUrl}`)
                        const client = await MongoClient.connect(DataBaseShareConfig.dbConnectUrl)
                        this.#db = client.db(DataBaseShareConfig.dbConnectName)
                        this.#dbConnected = true
                        console.log(`db: ${DataBaseShareConfig.dbConnectName} connected succeed`)
                        return resolve(this.#db)
                    } catch (error) {
                        this.#dbConnected = false
                        return reject(error)
                    }
                })
            }
        }
    }

    async find(collectionName, findObject, callback) {
        if(callback && typeof callback === "function") {
            this.#connect((error, resultDB) => {
                if(!error) {
                    resultDB.collection(collectionName).find(findObject).toArray((error, result) => {
                        callback(error, result)
                    })
                } else {
                    callback(error, null)
                }
            })
        } else {
            return new Promise(async (resolve, reject) => {
                try {
                    const db = await this.#connect()
                    const collection = db.collection(collectionName)
                    const result = await collection.find(findObject).toArray()
                    return resolve(result)
                } catch (error) {
                    return reject(error)
                }
            })
        }
    }

    async updateOne(collectionName, filterObject, newObject, callback) {
        if(callback && typeof callback === "function") {
            this.#connect((error, resultDB) => {
                if(!error) {
                    resultDB.collection(collectionName).updateOne(filterObject, { $set: newObject }, (error, result) => {
                        callback(error, result)
                    })
                } else {
                    callback(error, null)
                }
            })
        } else {
            return new Promise(async (resolve, reject) => {
                try {
                    const db = await this.#connect()
                    const collection = db.collection(collectionName)
                    const result = await collection.updateOne(filterObject, { $set: newObject })
                    return resolve(result)
                } catch (error) {
                    return reject(error)
                }
            })
        }  
    }

    async updateMany(collectionName, filterObject, newObject, callback) {
        if(callback && typeof callback === "function") {
            this.#connect((error, resultDB) => {
                if(!error) {
                    resultDB.collection(collectionName).updateMany(filterObject, { $set: newObject }, (error, result) => {
                        callback(error, result)
                    })
                } else {
                    callback(error, null)
                }
            })
        } else {
            return new Promise(async (resolve, reject) => {
                try {
                    const db = await this.#connect()
                    const collection = db.collection(collectionName)
                    const result = await collection.updateMany(filterObject, { $set: newObject })
                    return resolve(result)
                } catch (error) {
                    return reject(error)
                }
            })
        }
    }

    async insertOne(collectionName, insertObject, callback) {
        if(callback && typeof callback === "function") {
            this.#connect((error, resultDB) => {
                if(!error) {
                    resultDB.collection(collectionName).insertOne(insertObject, (error, result) => {
                        callback(error, result)
                    })
                } else {
                    callback(error, null)
                }
            })
        } else {
            return new Promise(async (resolve, reject) => {
                try {
                    const db = await this.#connect()
                    const collection = db.collection(collectionName)
                    const result = await collection.insertOne(insertObject)
                    return resolve(result)
                } catch (error) {
                    return reject(error)
                }
            })
        }
    }

    async insertMany(collectionName, insertObjectArray, callback) {
        if(callback && typeof callback === "function") {
            this.#connect((error, resultDB) => {
                if(!error) {
                    resultDB.collection(collectionName).insertMany(insertObjectArray, (error, result) => {
                        callback(error, result)
                    })
                } else {
                    callback(error, null)
                }
            })
        } else {
            return new Promise(async (resolve, reject) => {
                try {
                    const db = await this.#connect()
                    const collection = db.collection(collectionName)
                    const result = await collection.insertMany(insertObjectArray)
                    return resolve(result)
                } catch (error) {
                    return reject(error)
                }
            })
        }
    }

    async deleteOne(collectionName, deleteObject, callback) {
        if(callback && typeof callback === "function") {
            this.#connect((error, resultDB) => {
                if(!error) {
                    resultDB.collection(collectionName).deleteOne(deleteObject, (error, result) => {
                        callback(error, result)
                    })
                } else {
                    callback(error, null)
                }
            })
        } else {
            return new Promise(async (resolve, reject) => {
                try {
                    const db = await this.#connect()
                    const collection = db.collection(collectionName)
                    const result = await collection.deleteOne(deleteObject)
                    return resolve(result)
                } catch (error) {
                    return reject(error)
                }
            })
        }
    }

    async deleteMany(collectionName, deleteObject, callback) {
        if(callback && typeof callback === "function") {
            this.#connect((error, resultDB) => {
                if(!error) {
                    resultDB.collection(collectionName).deleteMany(deleteObject, (error, result) => {
                        callback(error, result)
                    })
                } else {
                    callback(error, null)
                }
            })
        } else {
            return new Promise(async (resolve, reject) => {
                try {
                    const db = await this.#connect()
                    const collection = db.collection(collectionName)
                    const result = await collection.deleteMany(deleteObject)
                    return resolve(result)
                } catch (error) {
                    return reject(error)
                }
            })
        }
    }

}

const DataBaseShareInstance = new DataBase()

// export default DataBaseShareInstance
module.exports = DataBaseShareInstance
