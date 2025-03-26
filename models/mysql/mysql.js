import mysql from 'mysql2/promise';
import { json  } from 'express';

const config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'moviesdb'
}

const connection = await mysql.createConnection(config);

connection.query

export class MovieModel {
    static getAll = async ({genre}) => {
        const [movies] = await connection.query('SELECT *, BIN_TO_UUID(idd) idd FROM movie');
        if(genre){
            const lowerCaseGenre = genre.toLowerCase();
            const [genres] = await connection.query('SELECT id, name FROM genre WHERE LOWER(name) = ?', [lowerCaseGenre]);
            if (genres.length === 0) {
                return [];
            }
            const [{ id }] = genres;
            const [moviesGenre] = await connection.query('SELECT *, BIN_TO_UUID(movie_id) movie_id FROM movie_genres WHERE genre_id = ?', [id]);
            const [{ movie_id }] = moviesGenre;
            const [movie] = await connection.query('SELECT *, BIN_TO_UUID(idd) idd FROM movie WHERE idd = UUID_TO_BIN(?)', [movie_id]);
            return movie;
        }
        return movies;
    }
    static async getById(id) {
        const [movie] = await connection.query('SELECT *, BIN_TO_UUID(idd) idd FROM movie WHERE idd = UUID_TO_BIN(?)', [id]);
        return movie;
    }
    static async create(data) {
        const movieData = {
            title: data.title,
            director: data.director,
            duration: data.duration,
            year: data.year,
            rate: data.rate,
            poster: data.poster
        };
        const [genderId] = await connection.query('SELECT id FROM genre WHERE name = ?', [data.genre]);
        if (genderId.length === 0) {
            return [];
        }
        try{
            await connection.query('INSERT INTO movie SET ?', movieData);
            const movie_id = await connection.query('SELECT idd FROM movie WHERE title = ?', [movieData.title]);
            const genreData = {
                movie_id: movie_id[0][0].idd,
                genre_id: genderId[0].id
            }
            await connection.query('INSERT INTO movie_genres SET ?', genreData);
            const result = await connection.query('SELECT *, BIN_TO_UUID(idd) idd FROM movie');
            return result[0];
        }
        catch{
            return "Ya esta cargado";
        }
        

    }
    static async delete ({ id }) {
        const result = await connection.query('DELETE FROM movie WHERE BIN_TO_UUID(idd) = ?', [id]);
        console.log(result);
        return result; 
    }
    static async update ({ id, data }) {
        const movie = await connection.query('SELECT *, BIN_TO_UUID(idd) idd FROM movie WHERE BIN_TO_UUID(idd) = ?', [id]);
        const a = await connection.query('SELECT BIN_TO_UUID(movie_id) movie_id, genre_id FROM movie_genres');
        if(movie[0].length == 1){
            if(data.genre == null){
                const titl = data.title ?? movie[0][0].title;
                const year = data.year ?? movie[0][0].year;
                const director = data.director ?? movie[0][0].director;
                const duration = data.duration ?? movie[0][0].duration;
                const poster = data.poster ?? movie[0][0].poster;
                const rate = data.rate ?? movie[0][0].rate;
                try{
                    await connection.query('UPDATE movie SET title = ?, year = ?, director = ?, duration = ?, poster = ?, rate = ? WHERE BIN_TO_UUID(idd) = ?', [titl, year, director, duration, poster, rate, id]);
                    const newMovie = await connection.query('SELECT *, BIN_TO_UUID(idd) idd FROM movie WHERE BIN_TO_UUID(idd) = ?', [id]);
                    return newMovie[0][0];
                }
                catch{
                    return "No se pudo cambiar los datos";
                }
            }
            const titl = data.title ?? movie[0][0].title;
            const year = data.year ?? movie[0][0].year;
            const director = data.director ?? movie[0][0].director;
            const duration = data.duration ?? movie[0][0].duration;
            const poster = data.poster ?? movie[0][0].poster;
            const rate = data.rate ?? movie[0][0].rate;
            const genre = data.genre;
            try{
                await connection.query('UPDATE movie SET title = ?, year = ?, director = ?, duration = ?, poster = ?, rate = ? WHERE BIN_TO_UUID(idd) = ?', [titl, year, director, duration, poster, rate, id]);
                const genre_id = await connection.query('SELECT id FROM genre WHERE LOWER(name) = ?', [genre[0]]);
                await connection.query('INSERT INTO movie_genres (movie_id, genre_id) VALUES (UUID_TO_BIN(?), ?)', [id, genre_id[0][0].id]);
                let newMovie = await connection.query('SELECT *, BIN_TO_UUID(idd) idd FROM movie WHERE BIN_TO_UUID(idd) = ?', [id]);
                newMovie.genre = genre;
                return newMovie;
            }
            catch{
                "No se pudo cambiar los datos"
            }
        }
        return "No se ha encontrado la pelicula";
    }   
}