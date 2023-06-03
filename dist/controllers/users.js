var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as dotenv from "dotenv";
dotenv.config();
import { db } from '../server.js';
import jwt from "jsonwebtoken";
const logIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield db.one(`SELECT * FROM users WHERE username=$1`, username);
    if (user && user.password === password) {
        const payload = {
            id: user.id,
            username,
        };
        const { SECRET = '' } = process.env;
        const token = jwt.sign(payload, SECRET);
        console.log(token);
        yield db.none(`UPDATE users SET token=$2 WHERE id=$1`, [user.id, token]);
        res.status(201).json({ id: user.id, username, token });
    }
    else {
        return res.status(400).json({ msg: "Username or password incorrect" });
    }
});
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield db.oneOrNone(`SELECT * FROM users WHERE username=$1`, username);
    if (user) {
        res.status(409).json({ msg: "Username already exists" });
    }
    else {
        const { id } = yield db.one(`INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id`, [username, password]);
        res.status(201).json({ id, msg: "Signup successful. Now you can log in." });
    }
});
export { logIn, signUp };
