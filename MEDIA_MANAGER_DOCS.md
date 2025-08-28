# Media Manager Documentation

## Overview

The Media Manager is a comprehensive file management system for the CMS company profile that provides:

- File upload with validation and type detection
- Automatic thumbnail generation for images
- Media metadata management (title, alt text, description)
- RESTful API endpoints for all CRUD operations
- Reusable frontend components for media selection
- Integration with existing content management sections

## Backend Components

### Models

#### Enhanced Media Model
Located in `backend/core/models.py`

**Key Fields:**
- `file`: FileField for the actual file upload
- `file_name`, `file_type`, `file_size`, `mime_type`: Automatically detected metadata
- `title`, `alt_text`, `description`: User-defined metadata
- `width`, `height`: Automatically detected for images
- `thumbnail_small`, `thumbnail_medium`, `thumbnail_large`: Auto-generated thumbnails
- `company`, `uploaded_by`: Relationship fields

**File Types Supported:**
- Images: JPG, PNG, WEBP, GIF
- Documents: PDF, DOC, DOCX, TXT, RTF
- Videos: MP4, AVI, MOV, WMV, WEBM
- Audio: MP3, WAV, OGG, M4A

### API Endpoints

#### Media ViewSet (`/api/media/`)

**Standard CRUD:**
- `GET /api/media/` - List all media files (paginated)
- `GET /api/media/{id}/` - Get specific media file
- `PUT /api/media/{id}/` - Update media metadata
- `DELETE /api/media/{id}/` - Delete media file

**Special Endpoints:**
- `POST /api/media/upload/` - Upload new media file
- `GET /api/media/images/` - Get only image files
- `DELETE /api/media/{id}/delete_file/` - Delete file and all thumbnails
- `GET /api/media/?company_id={id}` - Filter by company
- `GET /api/media/?file_type={type}` - Filter by file type

#### Upload API Request Format

```bash
curl -X POST http://127.0.0.1:8000/api/media/upload/ \
  -F "file=@/path/to/image.jpg" \
  -F "title=My Image Title" \
  -F "alt_text=Alternative text for accessibility" \
  -F "description=Detailed description" \
  -F "company=1"
```

#### Response Format

```json
{
    "id": 1,
    "file_url": "http://127.0.0.1:8000/media/uploads/2025/08/image.jpg",
    "thumbnail_urls": {
        "small": "http://127.0.0.1:8000/media/thumbnails/small/2025/08/small_image.jpg",
        "medium": "http://127.0.0.1:8000/media/thumbnails/medium/2025/08/medium_image.jpg",
        "large": "http://127.0.0.1:8000/media/thumbnails/large/2025/08/large_image.jpg"
    },
    "file_name": "image.jpg",
    "file_type": "image",
    "file_size": 1305,
    "mime_type": "image/jpeg",
    "title": "My Image Title",
    "alt_text": "Alternative text for accessibility",
    "description": "Detailed description",
    "width": 800,
    "height": 600,
    "display_name": "My Image Title",
    "created_at": "2025-08-28T09:18:25.939380Z"
}
```

### Utility Functions

#### File Processing (`backend/core/utils.py`)

**Key Functions:**
- `validate_file_upload(uploaded_file)` - Validates file size and type
- `process_media_file(media_instance, uploaded_file)` - Processes file and creates thumbnails
- `create_thumbnail(image_file, size_key)` - Creates individual thumbnails
- `delete_media_files(media_instance)` - Cleans up all associated files

**Thumbnail Sizes:**
- Small: 150x150px
- Medium: 300x300px  
- Large: 600x600px

**Validation Rules:**
- Maximum file size: 10MB
- Maximum image size: 5MB
- Allowed extensions: See file types above

## Frontend Components

### Core Components

#### MediaPicker (`frontend/src/components/Media/MediaPicker.jsx`)

A modal component for selecting media files with two tabs:

**Library Tab:**
- Browse existing media files
- Search functionality
- Grid view with thumbnails
- Multi-select support

**Upload Tab:**
- Drag and drop file upload
- Multiple file upload support
- Progress indication
- Error handling

**Props:**
```javascript
<MediaPicker
  isOpen={boolean}
  onClose={() => {}}
  onSelect={(media) => {}}
  allowMultiple={boolean}
  fileTypes={['image', 'document', 'video', 'audio']}
  title="Select Media"
/>
```

#### MediaButton (`frontend/src/components/Media/MediaButton.jsx`)

A button component that triggers the MediaPicker:

**Props:**
```javascript
<MediaButton
  selectedMedia={media} // Single media object or array
  onMediaSelect={(media) => {}}
  onMediaRemove={() => {}}
  fileTypes={['image']}
  allowMultiple={false}
  buttonText="Select Media"
  showPreview={true}
/>
```

### Enhanced Existing Components

#### EnhancedGalleryPictureCard

Updated gallery component that integrates with the media API:
- Loads existing media from API
- Uses MediaButton for file selection
- Automatic metadata updates
- Proper cleanup on deletion

### API Integration

#### Frontend API Service (`frontend/src/services/api.js`)

```javascript
import { mediaAPI } from '../services/api';

// Get all media
const media = await mediaAPI.getAll();

// Upload new file
const formData = new FormData();
formData.append('file', file);
formData.append('title', 'My Title');
const result = await mediaAPI.upload(formData);

// Get only images
const images = await mediaAPI.getImages();

// Filter by company
const companyMedia = await mediaAPI.getByCompany(companyId);

// Update metadata
await mediaAPI.update(mediaId, { title: 'New Title', alt_text: 'New alt text' });

// Delete media
await mediaAPI.delete(mediaId);
```

## Integration Guide

### Adding Media to Existing Components

1. **Import Required Components:**
```javascript
import MediaButton from './components/Media/MediaButton';
import { mediaAPI } from './services/api';
```

2. **Add State for Selected Media:**
```javascript
const [selectedMedia, setSelectedMedia] = useState(null);
```

3. **Add MediaButton to Your Component:**
```javascript
<MediaButton
  selectedMedia={selectedMedia}
  onMediaSelect={setSelectedMedia}
  onMediaRemove={() => setSelectedMedia(null)}
  fileTypes={['image']}
  buttonText="Choose Image"
/>
```

4. **Save Media Reference:**
```javascript
const handleSave = async () => {
  const data = {
    title: 'Content Title',
    image_path: selectedMedia?.file_url || '',
    // other fields...
  };
  await yourAPI.create(data);
};
```

### Updating ContentPlaceholder Example

The ContentPlaceholder component has been updated to demonstrate integration:

```javascript
// CardContent component now uses MediaButton for file types
case 'file':
  return (
    <>
      <div className="mb-4">
        <MediaButton
          selectedMedia={selectedMedia}
          onMediaSelect={setSelectedMedia}
          onMediaRemove={() => setSelectedMedia(null)}
          fileTypes={['image']}
          buttonText="Choose Image"
          showPreview={true}
        />
      </div>
      <CardActionFooter onSave={handleSave} onDelete={onDelete} saving={saving} />
    </>
  );
```

## Configuration

### File Upload Settings

Edit `backend/core/utils.py` to modify:

```python
# File size limits
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
MAX_IMAGE_SIZE = 5 * 1024 * 1024   # 5MB

# Thumbnail sizes
THUMBNAIL_SIZES = {
    'small': (150, 150),
    'medium': (300, 300),
    'large': (600, 600),
}

# Allowed file extensions
ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
# ... other extension lists
```

### Django Settings

Ensure these settings are in `backend/backend/settings.py`:

```python
# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# For development
if DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

## Testing

### Backend API Testing

```bash
# Test upload
curl -X POST http://127.0.0.1:8000/api/media/upload/ \
  -F "file=@test_image.jpg" \
  -F "title=Test Image"

# Test list
curl http://127.0.0.1:8000/api/media/

# Test images only
curl http://127.0.0.1:8000/api/media/images/
```

### Frontend Testing

The components can be tested by:
1. Adding them to existing pages
2. Testing file upload functionality
3. Verifying thumbnail generation
4. Testing search and filtering
5. Verifying proper cleanup on deletion

## Troubleshooting

### Common Issues

1. **Thumbnails not generating:**
   - Ensure Pillow is installed: `pip install Pillow`
   - Check file permissions on media directory
   - Verify image format is supported

2. **Upload fails:**
   - Check file size limits
   - Verify file type is allowed
   - Check Django media settings

3. **Files not serving:**
   - Ensure media URL is configured
   - Check static files serving in development
   - Verify file paths in database

4. **Frontend components not loading:**
   - Check import paths
   - Verify API base URL is correct
   - Check browser console for errors

### Performance Considerations

- Thumbnail generation happens synchronously during upload
- Consider implementing async thumbnail generation for large files
- Add image compression for better performance
- Implement lazy loading for media grids
- Consider CDN for production media serving

## Future Enhancements

Potential improvements to consider:

1. **Image Editing:**
   - Crop and resize functionality
   - Filters and effects
   - Image rotation

2. **Advanced Features:**
   - Bulk upload and operations
   - Media folders/categories
   - Metadata extraction from EXIF
   - Duplicate detection

3. **Performance:**
   - Async thumbnail generation
   - Progressive image loading
   - Client-side image optimization

4. **Integration:**
   - Cloud storage support (S3, CloudFlare)
   - CDN integration
   - Image optimization services