import { randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const movies = require('../movies.json');

export class MovieModel {
    static getAll = async ({genre}) => {
        if(genre){
            return movies.filter(movie => movie.genre.includes(genre));
        }
        return movies;
    }
    static async getById(id) {
        const movie = movies.find(movie => movie.id === id);
        return movie;
    }
    static async create(data) {
        const newmovie = {
            id: randomUUID(),
            ...data
        };
        movies.push(newmovie)
        return newmovie;
    }
    static async delete ({ id }) {
        const index = movies.findIndex(movie => movie.id === id);
        if(index === -1){
            return false;
        }
        movies.splice(index, 1);
        return true;
    }
    static async update ({ id, data }) {
        const index = movies.findIndex(movie => movie.id === id);
        if(index === -1){
            return false;
        }
        const movieupdate = {
            ...movies[index],
            ...data
        }
        movies[index] = movieupdate
        return movieupdate;
    }
}