import express, {Request, Response} from 'express';
import morgan from 'morgan';
import 'express-async-errors';
import Joi from 'joi';
import {db} from '../dbSetup.js'

const planetSchema = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().required(),
});

const getAll = async (req: Request, res: Response) => {
    const planets = await db.many(`
        SELECT * FROM planets;
    `)
    res.status(200).json(planets);
}

const getOneByID = async (req: Request, res: Response) => {
    const { id } = req.params;
    const planet = await db.oneOrNone(`
        SELECT * FROM planets WHERE id=$1;
    `, id)
    res.status(200).json(planet);
};

const create = async (req: Request, res: Response) => {
    const { error } = planetSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { name } = req.body;
    const planets = await db.oneOrNone(`
        INSERT INTO planets (name) VALUES ($1);
    `,name)
    res.status(201).json({ msg: 'planet added' });
};

const updateByID = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;
    const planets = await db.oneOrNone(`
        UPDATE planets SET name=$2 WHERE id=$1;
    `, [id, name])
    res.status(200).json({ msg: 'planet updated' });
};

const deleteByID = async (req: Request, res: Response) => {
    const { id } = req.params;
    const planets = await db.oneOrNone(`
        DELETE FROM planets WHERE id=$1;
    `, id)
    res.status(200).json({ msg: 'Planet Deleted' });
};

export {getAll, getOneByID, create, updateByID, deleteByID}