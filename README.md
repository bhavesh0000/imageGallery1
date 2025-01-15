# Drag & Drop Image Gallery Library

A lightweight, customizable, and reusable image gallery component with drag-and-drop functionality for React applications.

## Features

- **Dynamic Image Management**
  - Upload images with drag-and-drop support
  - Organize images into galleries
  - Move images between galleries
  - Automatic thumbnail generation
  - Image preview and modal view

- **Gallery Organization**
  - Create and manage multiple galleries
  - Unnamed gallery for unassigned images
  - Drag-and-drop images between galleries
  - Gallery grid and masonry layout options

- **Responsive Design**
  - Mobile-first approach
  - Grid and masonry layout options
  - Responsive image grid
  - Touch-friendly interactions

- **Advanced Features**
  - Image caching for performance
  - Lazy loading
  - Custom image thumbnails
  - Gallery and image metadata support

## Installation

```bash
# Using npm
npm install drag-drop-gallery

# Using yarn
yarn add drag-drop-gallery
```

## Backend Setup

1. Install required dependencies:
```bash
npm install express mongoose multer sharp redis
```

2. Configure MongoDB connection:
```javascript
// config/database.js
import mongoose from 'mongoose';

export const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        process.exit(1);
    }
};
```

3. Set up environment variables:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/image-gallery
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Frontend Integration

### React Component Usage

```jsx
import { ImageGallery } from 'Image-Gallery';

function App() {
  return (
    <ImageGallery 
      apiUrl="http://your-backend-url"
      onImageUpload={(image) => console.log('Image uploaded:', image)}
      onGalleryCreate={(gallery) => console.log('Gallery created:', gallery)}
      onImageMove={(image, sourceGallery, targetGallery) => {
        console.log('Image moved:', image);
      }}
    />
  );
}
```

### Component Props

| Prop | Type | Description |
|------|------|-------------|
| apiUrl | string | Backend API URL |
| onImageUpload | function | Callback when image is uploaded |
| onGalleryCreate | function | Callback when gallery is created |
| onImageMove | function | Callback when image is moved |
| layout | 'grid' \| 'masonry' | Gallery layout style |
| theme | object | Custom theme configuration |

### Customization

```jsx
const theme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    background: '#ffffff'
  },
  spacing: {
    grid: '1rem',
    container: '2rem'
  }
};

<ImageGallery theme={theme} />
```

## API Endpoints

### Galleries
- `GET /api/galleries` - Get all galleries
- `POST /api/galleries` - Create new gallery
- `GET /api/galleries/:id` - Get gallery by ID
- `PATCH /api/galleries/:id` - Update gallery
- `DELETE /api/galleries/:id` - Delete gallery

### Images
- `POST /api/images` - Upload image
- `GET /api/images` - Get all images
- `GET /api/images/:id` - Get image by ID
- `PATCH /api/images/:id` - Update image
- `DELETE /api/images/:id` - Delete image

## Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Imagegallery1.git
cd drag-drop-gallery
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Start development servers:
```bash
# Start backend server
cd backend
npm run dev

# Start frontend development server
cd frontend
npm start
```

## Project Structure

```
IMAGEGALLERY/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── app.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   |
│   │   └── App.js
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- React Beautiful DND for drag-and-drop functionality
- Sharp for image processing
- MongoDB for database management
- Express.js for API development

