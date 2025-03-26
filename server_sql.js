import { createApp } from './web/app.js'
import { MovieModel } from './models/mysql/mysql.js'
createApp({ movieModel: MovieModel })