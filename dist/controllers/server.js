var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import 'express-async-errors';
import Joi from 'joi';
import { db } from '../dbSetup.js';
let planets = [
    {
        id: 1,
        name: "Earth",
    },
    {
        id: 2,
        name: "Mars",
    },
];
const planetSchema = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().required(),
});
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const planets = yield db.many(`
        SELECT * FROM planets;
    `);
    res.status(200).json(planets);
});
const getOneByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const planet = yield db.oneOrNone(`
        SELECT * FROM planets;
    `, id);
    res.status(200).json(planet);
});
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = planetSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    const { name } = req.body;
    const planets = yield db.oneOrNone(`
        INSERT INTO planets (name) VALUES ($1);
    `, name);
    res.status(201).json({ msg: 'planet added' });
});
const updateByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name } = req.body;
    const planets = yield db.oneOrNone(`
        UPDATE planets SET name=$2 WHERE id=$1;
    `, [id, name]);
    res.status(200).json({ msg: 'planet updated' });
});
const deleteByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const planets = yield db.oneOrNone(`
        DELETE FROM planets WHERE id=$1;
    `, id);
    res.status(200).json({ msg: 'Planet Deleted' });
});
export { getAll, getOneByID, create, updateByID, deleteByID };
