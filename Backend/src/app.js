import 'dotenv/config'
import express from "express"
import cors from 'cors'
import helmet from "helmet"
import compression from "compression"
import morgan from "morgan"
import { fileURLToPath } from 'url'
import path from "path"
import { mkdir } from 'fs/promises'
import imageRoutes from './routes/image.routes.js'
import galleryRoutes from './routes/gallery.routes.js'
import { errorHandler } from "./middleware/errorHandler.js"
import { connectDatabase } from "./config/database.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(helmet({
    crossOriginResourcePolicy: {
        policy: 'cross-origin'
      }
}))
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3004'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(compression())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

try {
    await mkdir(path.join(__dirname, '../uploads/thumbnails'), { recursive: true });
} catch (err) {
    if (err.code !== 'EEXIST') {
        console.error('Error creating uploads directory:', err);
    }
}

app.use('/uploads', (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  }, express.static(path.join(__dirname, '../uploads')));

app.use('/api/images', imageRoutes)
app.use('/api/galleries', galleryRoutes)

app.use(errorHandler)
connectDatabase()


const Port = process.env.PORT || 3000
app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`)
})

export default app