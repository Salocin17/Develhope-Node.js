import pgPromise from "pg-promise";
import dotenv from 'dotenv';

dotenv.config()


const db = pgPromise()({
    host:'127.0.0.1',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'postgres'
})

const setupDb = async () => {
    await db.none(`
    DROP TABLE IF EXISTS planets;

    CREATE TABLE planets (
        id SERIAL NOT NULL PRIMARY KEY,
        name TEXT NOT NULL
    )

    `)

    await writePlanet()
    
}

const writePlanet = async () => {
    await db.many(`
    INSERT INTO planets (name) VALUES ('Earth');
    INSERT INTO planets (name) VALUES ('Mars');
    `)
}


export {db, setupDb}