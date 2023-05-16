import express from 'express';
const app = express();
const port = 4000;
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
app.get("/planets", (req, res) => {
    res.status(200).json(planets);
});
app.listen(port, () => {
    console.log(`Listening on port${port}`);
});
