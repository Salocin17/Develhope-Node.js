import express from 'express';
import morgan from 'morgan';
import 'express-async-errors';
import { create, deleteByID, getAll, getOneByID, updateByID } from './controllers/server.js';
const app = express();
const port = 3000;
app.use(express.json());
app.use(morgan('dev'));
app.get("/api/planets", getAll);
app.get('/api/planets/:id', getOneByID);
app.post('/api/planets', create);
app.put('/api/planets/:id', updateByID);
app.delete('/api/planets/:id', deleteByID);
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
