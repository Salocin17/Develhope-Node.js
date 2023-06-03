import pgPromise from "pg-promise";
import express, { Request, Response } from 'express';
import morgan from 'morgan';
import 'express-async-errors';
import dotenv from 'dotenv';
import multer from 'multer';
import { create, deleteByID, getAll, getOneByID, updateByID, addImage } from './controllers/server.js';
import { logIn, signUp, logOut } from './controllers/users.js';
import {authorize} from '../middleware/authorize.js';
import './passport.js'

const storage = multer.diskStorage({
  destination: (req: Request, file: any, cb: any) => {
    cb(null, "./uploads");
  },
  filename: (req: Request, file: any, cb: any) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

dotenv.config()
const app = express();
const port = 4000;


const db = pgPromise()({
  host: '127.0.0.1',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'postgres'
})

const setupDb = async () => {
  await db.none(`
    DROP TABLE IF EXISTS planets;
    CREATE TABLE planets(
      id SERIAL NOT NULL PRIMARY KEY,
      name TEXT NOT NULL,
      image TEXT
    );

    DROP TABLE IF EXISTS users;

  CREATE TABLE users (
    id SERIAL NOT NULL PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    token TEXT
  );
    
    INSERT INTO planets (name) VALUES ('Earth');
    INSERT INTO planets (name) VALUES ('Mars');
    `)
}

setupDb()

app.use(express.json());
app.use(morgan('dev'));

app.get("/planets", getAll);

app.get('/planets/:id', getOneByID);

app.post('/planets', create);

app.put('/planets/:id', updateByID);

app.delete('/planets/:id', deleteByID);

app.post('/planets/:id/image', upload.single("image"), addImage);

app.post('/users/signup', signUp);

app.post('/users/login', logIn)

app.get('/users/logout', authorize, logOut)

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});


export { db, setupDb }