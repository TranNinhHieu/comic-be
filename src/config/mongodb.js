import { MongoClient } from 'mongodb'
import { env } from './enviroment'

let dbInstance = null


export const connectDB = async () => {

    const client = new MongoClient(env.MONGODB_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })

    // Connect the client to server
    await client.connect()

    // Assign clientDB to our dbInstance
    dbInstance = client.db(env.DATABASE_NAME)

}

// Get Database Instance
export const getDB = () => {
    if (!dbInstance) throw new Error('Must connect to Database first!')
    return dbInstance
}

// const listDatabases = async (client) => {
//     const databasesList = await client.db().admin().listDatabases()
//     console.log(databasesList)
//     console.log('Your databases:')
//     databasesList.databases.forEach(db => console.log(` - ${db.name}`))
// }
