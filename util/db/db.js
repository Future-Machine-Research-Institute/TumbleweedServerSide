// import { MongoClient } from "mongodb";
// import DataBaseShareConfig from "./db_config.js";
const { MongoClient } = require("mongodb")
const DataBaseShareConfig = require("./db_config")

class DataBase {

    #db

    constructor() {
        this.#db = null
    }

    async #connect() {
        return new Promise(async (resolve, reject)=> {
            try {
                console.log(`begain to connecting: ${DataBaseShareConfig.dbConnectUrl}`)
                const client = await MongoClient.connect(DataBaseShareConfig.dbConnectUrl)
                this.#db = client.db(DataBaseShareConfig.dbConnectName)
                console.log(`db: ${DataBaseShareConfig.dbConnectName} connected succeed`)
                resolve(this.#db)
            } catch (error) {
                reject(error)
            }
        })
    }

    async find(collectionName, findObject) {
        return new Promise(async (resolve, reject)=> {
            try {
                if(!this.#db) {
                    await this.#connect()
                }
                const collection = this.#db.collection(collectionName)
                const result = await collection.find(findObject).toArray()
                resolve(result)
            } catch (error) {
                reject(error)
            }
        })
    }

    async updateOne(collectionName, filterObject, newObject) {
        return new Promise(async (resolve, reject)=> {
            try {
                if(!this.#db) {
                    await this.#connect()
                }
                const collection = this.#db.collection(collectionName)
                const result = await collection.updateOne(filterObject, { $set: newObject })
                resolve(result)
            } catch (error) {
                reject(error)
            }
        })
    }

    async updateMany(collectionName, filterObject, newObject) {
        return new Promise(async (resolve, reject)=> {
            try {
                if(!this.#db) {
                    await this.#connect()
                }
                const collection = this.#db.collection(collectionName)
                const result = await collection.updateMany(filterObject, { $set: newObject })
                resolve(result)
            } catch (error) {
                reject(error)
            }
        })
    }
    
    async insertOne(collectionName, insertObject) {
        return new Promise(async (resolve, reject)=> {
            try {
                if(!this.#db) {
                    await this.#connect()
                }
                const collection = this.#db.collection(collectionName)
                const result = await collection.insertOne(insertObject)
                resolve(result)
            } catch (error) {
                reject(error)
            }
        })
    }

    async insertMany(collectionName, insertObjectArray) {
        return new Promise(async (resolve, reject)=> {
            try {
                if(!this.#db) {
                    await this.#connect()
                }
                const collection = this.#db.collection(collectionName)
                const result = await collection.insertMany(insertObjectArray)
                resolve(result)
            } catch (error) {
                reject(error)
            }
        })
    }

    async deleteOne(collectionName, deleteObject) {
        return new Promise(async (resolve, reject)=> {
            try {
                if(!this.#db) {
                    await this.#connect()
                }
                const collection = this.#db.collection(collectionName)
                const result = await collection.deleteOne(deleteObject)
                resolve(result)
            } catch (error) {
                reject(error)
            }
        })
    }

    async deleteMany(collectionName, deleteObject) {
        return new Promise(async (resolve, reject)=> {
            try {
                if(!this.#db) {
                    await this.#connect()
                }
                const collection = this.#db.collection(collectionName)
                const result = await collection.deleteMany(deleteObject)
                resolve(result)
            } catch (error) {
                reject(error)
            }
        })
    }

}

const DataBaseShareInstance = new DataBase()

// export default DataBaseShareInstance
module.exports = DataBaseShareInstance
