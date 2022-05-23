
const defaultUrl = 'mongodb://localhost:27017'
const defaultName = 'tumbleweed'

class DataBaseConfig {

    #dbUrl
    #dbName

    constructor() {
        this.#dbUrl = this.dbConnectUrl
        this.#dbName = this.dbConnectName
    }

    get dbConnectUrl() {
        return this.#dbUrl === undefined ? defaultUrl : this.#dbUrl
    }

    set dbConnectUrl(value) {
        this.#dbUrl = value === undefined ? defaultUrl : value
    }

    get dbConnectName() {
        return this.#dbName === undefined ? defaultName : this.#dbName
    }

    set dbConnectName(value) {
        this.#dbName = value === undefined ? defaultName : value
    }

}

const DataBaseShareConfig = new DataBaseConfig()

// export default DataBaseShareConfig
module.exports = DataBaseShareConfig