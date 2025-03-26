import { MovieModel } from '../models/mysql/mysql.js';
import { validate, validatePatch } from '../movies.js';

export class MovieController {
    constructor ({movieModel}){
        this.movieModel = movieModel;
    }
    getAll = async (req, res) => {
        const {genre} = req.query;
        const movies = await this.movieModel.getAll({genre});
        res.status(200).json(movies);
    }
    getById = async (req, res) => {
        const { id } = req.params;
        const movie = await this.movieModel.getById(id);
        if(movie){
            res.status(200).json(movie);
        }else{
            res.status(404).send('<h1>404 Not Found</h1>');
        }
    }
    create = async (req, res) => {
        const movs = validate(req.body);
        if(movs.success === false){
            res.status(400).json(movs.error);
            return;
        }
        const newmovie = await this.movieModel.create(movs.data);
        res.status(201).json(newmovie);
    }
    update = async(req, res) => {
        const result = validatePatch(req.body);
        const { id } = req.params;
        const movieupdate = await this.movieModel.update({
            id,
            data: result.data
        });
        return res.json(movieupdate);
    }
    delete = async (req, res) => {
        const { id } = req.params;
        const result = await this.movieModel.delete({ id });
        if(!result){
            res.status(404).send('<h1>404 Not Found</h1>');
            return;
        }
        res.json({message: result});
    }
}