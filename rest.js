const express = require('express');
const app = express();
const cors = require('cors');
const crypto = require('node:crypto');
const movies = require('./movies.json');
const { validate, validatePatch } = require('./movies');


app.disable('x-powered-by');

app.use(cors());

const PORT  = process.env.PORT || 3000;

app.use(express.json())

app.get('/', (req, res) => {
    res.status(200).send('<h1>Bienvenido a la página principal</h1>');
});

// RECUPERAR TODAS LAS PELICULAS
app.get('/movies', (req, res) => {
    res.header('Access-control-allow-origin', '*');
    const {genre} = req.query;
    if(genre){
        const filteredMovies = movies.filter(movie => movie.genre.includes(genre));
        if(filteredMovies.length === 0){
            res.status(404).send('<h1>404 Not Found</h1>');
            return;
        }
        res.status(200).json(filteredMovies);
        return;
    };
    res.status(200).json(movies);
});

// RECUPERAR UNA PELICULA POR ID
app.get('/movies/:id', (req, res) => {
    const { id } = req.params;
    const movie = movies.find(movie => movie.id === id);
    if(movie){
        res.status(200).json(movie);
    }else{
        res.status(404).send('<h1>404 Not Found</h1>');
    }
});

// ELIMINAR UNA PELICULA POR ID
app.delete('/movies/:id', (req, res) => {
    res.header('Access-control-allow-origin', '*');
    res.header('Access-control-allow-methods', 'GET, POST, PATCH, DELETE');
    const { id } = req.params;
    const index = movies.findIndex(movie => movie.id === id);
    if(index === -1){
        res.status(404).send('<h1>404 Not Found no encontrado</h1>');
        return;
    }
    movies.splice(index, 1);
    res.status(204).send();
});



// CREAR UNA PELICULA
app.post('/movies', (req, res) => {
    const movs = validate(req.body);
    
    if(movs.success === false){
        res.status(400).json(movs.error);
        return;
    }
    const newmovie = {
        id: crypto.randomUUID(),
        ...movs.data
    };
    movies.push(newmovie)
    res.status(201).json(newmovie);
});

app.patch('/movies/:id', (req, res) => {
    const { id } = req.params;
    const result = validatePatch(req.body);
    const index = movies.findIndex(movie => movie.id === id);

    if(result.success == false){
        res.status(400).json({error: JSON.parse(result.error.message)});
        return;
    };

    if(index === -1){
        res.status(404).send('<h1>404 Not Found no encontrada</h1>');
        return;
    }

    const movieupdate = {
        ...movies[index],
        ...result.data
    }
    movies[index] = movieupdate
    return res.json(movieupdate)
});


app.use((req, res, next) => {
    res.status(404).send('<h1>Error 404</h1>');
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});