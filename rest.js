import express from 'express'
const app = express()
import cors from 'cors'
import { moviesRouter } from './Routes/moviees.js';


app.disable('x-powered-by');

app.use(cors());

const PORT  = process.env.PORT || 3000;

app.use(express.json())

app.use('/movies', moviesRouter);

app.use((req, res, next) => {
    res.status(404).send('<h1>Error 404</h1>');
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});