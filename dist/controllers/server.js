import 'express-async-errors';
import Joi from 'joi';
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
const getAll = (req, res) => {
    res.status(200).json(planets);
};
const getOneByID = (req, res) => {
    const { id } = req.params;
    const planet = planets.find((planet) => planet.id === Number(id));
    res.status(200).json(planet);
};
const create = (req, res) => {
    const { error } = planetSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    const { id, name } = req.body;
    const newPlanet = { id, name };
    planets = [...planets, newPlanet];
    res.status(201).json({ msg: 'planet added' });
};
const updateByID = (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    planets = planets.map((planet) => planet.id === Number(id) ? Object.assign(Object.assign({}, planet), { name }) : planet);
    res.status(200).json({ msg: 'planet updated' });
};
const deleteByID = (req, res) => {
    const { id } = req.params;
    planets = planets.filter(planet => planet.id !== Number(id));
    res.status(200).json({ msg: 'Planet Deleted' });
};
export { getAll, getOneByID, create, updateByID, deleteByID };
