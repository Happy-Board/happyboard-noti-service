const mongoose = require('mongoose')
const mongoConfig = require('../../config/mongo.config')

class Database {
    constructor() {
        this.connect()
    }
  
    connect(type = 'mongodb') {
        if(1 === 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', { color: true })
        }
  
        mongoose.connect(mongoConfig, {
            maxPoolSize: 50
        })
        .then( _ => console.log('\x1b[42m%s\x1b[0m', 'MongoDB: Connect succefully'))
        .catch((err) => {
            console.log('Connect to MongoDB failure::', err)
        })
    }
  
    static getInstance() {
        if(!Database.instance) {
            Database.instance = new Database()
        }
    
        return Database.instance
    }
}
  
const instanceMongodb = Database.getInstance()

module.exports = instanceMongodb