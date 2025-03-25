import { MovieModel } from '../models/movie.js';
import { validate, validatePatch } from '../movies.js';

export class MovieController {
    static async getAll(req, res){
        const {genre} = req.query;
        const movies = await MovieModel.getAll({genre});
        res.status(200).json(movies);
    }
    static async getById(req, res){
        const { id } = req.params;
        const movie = await MovieModel.getById(id);
        if(movie){
            res.status(200).json(movie);
        }else{
            res.status(404).send('<h1>404 Not Found</h1>');
        }
    }
    static async create(req, res){
        const movs = validate(req.body);
        if(movs.success === false){
            res.status(400).json(movs.error);
            return;
        }
        const newmovie = await MovieModel.create(movs.data);
        res.status(201).json(newmovie);
    }
    static async update(req, res){
        const result = validatePatch(req.body);
        const { id } = req.params;
        const movieupdate = await MovieModel.update({
            id,
            data: result.data
        });
        return res.json(movieupdate);
    }
    static async delete(req, res){
        const { id } = req.params;
        const result = await MovieModel.delete({ id });
        if(!result){
            res.status(404).send('<h1>404 Not Found</h1>');
            return;
        }
        res.json({message: 'Movie deleted'});
    }
}