import express from 'express';
import morgan from 'morgan';
import 'express-async-errors';
import Joi from 'joi';

const app = express();
const port = 4000;

app.use(express.json());
app.use(morgan('dev'));

type Planet = {
    id: number,
    name: string,
};

type Planets = Planet[];

let planets: Planets = [
    {
        id: 1,
        name: "Earth",
    },
    {
        id: 2,
        name: "Mars",
    },
];

app.get("/api/planets", (req, res) => {
    res.status(200).json(planets);
});

app.get('/api/planets/:id', (req, res) => {
    const { id } = req.params;
    const planet = planets.find((planet) => planet.id === Number(id));
    res.status(200).json(planet);
});

const planetSchema = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().required(),
});

app.post('/api/planets', (req, res) => {
    const { error } = planetSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { id, name } = req.body;
    const newPlanet = { id, name };
    planets = [...planets, newPlanet];
    res.status(201).json({ msg: 'planet added' });
});

app.put('/api/planets/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    planets = planets.map((planet) => planet.id === Number(id) ? { ...planet, name } : planet);
    res.status(200).json({ msg: 'planet updated' });
});

app.delete('/api/planets/:id', (req, res) => {
    const { id } = req.params;
    planets = planets.filter(planet => planet.id !== Number(id));
    res.status(200).json({ msg: 'Planet Deleted' });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
