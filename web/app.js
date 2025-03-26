import express from 'express'
const app = express()
import cors from 'cors'
import { createMovieRouter } from '../Routes/moviees.js';
import { MovieModel } from '../models/mysql/mysql.js'

export const createApp = ({movieModel}) => {
    app.disable('x-powered-by');
    
    app.use(cors());
    
    const PORT  = process.env.PORT || 3000;
    
    app.use(express.json())
    
    app.use('/movies', createMovieRouter({movieModel: MovieModel}));
    
    app.use((req, res, next) => {
        res.status(404).send('<h1>Error 404</h1>');
    });
    
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running at http://localhost:${PORT}/`);
    });
}
