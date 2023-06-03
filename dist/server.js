var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import pgPromise from "pg-promise";
import express from 'express';
import morgan from 'morgan';
import 'express-async-errors';
import dotenv from 'dotenv';
import multer from 'multer';
import { create, deleteByID, getAll, getOneByID, updateByID, addImage } from './controllers/server.js';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });
dotenv.config();
const app = express();
const port = 4000;
const db = pgPromise()({
    host: '127.0.0.1',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'postgres'
});
const setupDb = () => __awaiter(void 0, void 0, void 0, function* () {
    yield db.none(`
    DROP TABLE IF EXISTS planets;
    CREATE TABLE planets(
      id SERIAL NOT NULL PRIMARY KEY,
      name TEXT NOT NULL,
      image TEXT
    );
    
    INSERT INTO planets (name) VALUES ('Earth');
    INSERT INTO planets (name) VALUES ('Mars');
    `);
});
setupDb();
app.use(express.json());
app.use(morgan('dev'));
app.get("/api/planets", getAll);
app.get('/api/planets/:id', getOneByID);
app.post('/api/planets', create);
app.put('/api/planets/:id', updateByID);
app.delete('/api/planets/:id', deleteByID);
app.post('/planets/:id/image', upload.single("image"), addImage);
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
export { db, setupDb };
