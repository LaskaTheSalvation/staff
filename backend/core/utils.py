"""
Utility functions for media handling
"""
import os
import mimetypes
from PIL import Image
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from io import BytesIO


# Allowed file types and sizes
ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
ALLOWED_DOCUMENT_EXTENSIONS = ['.pdf', '.doc', '.docx', '.txt', '.rtf']
ALLOWED_VIDEO_EXTENSIONS = ['.mp4', '.avi', '.mov', '.wmv', '.webm']
ALLOWED_AUDIO_EXTENSIONS = ['.mp3', '.wav', '.ogg', '.m4a']

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
MAX_IMAGE_SIZE = 5 * 1024 * 1024   # 5MB for images

THUMBNAIL_SIZES = {
    'small': (150, 150),
    'medium': (300, 300),
    'large': (600, 600),
}


def get_file_type_from_extension(filename):
    """Determine file type based on extension"""
    ext = os.path.splitext(filename)[1].lower()
    
    if ext in ALLOWED_IMAGE_EXTENSIONS:
        return 'image'
    elif ext in ALLOWED_DOCUMENT_EXTENSIONS:
        return 'document'
    elif ext in ALLOWED_VIDEO_EXTENSIONS:
        return 'video'
    elif ext in ALLOWED_AUDIO_EXTENSIONS:
        return 'audio'
    else:
        return 'document'  # Default fallback


def validate_file_upload(uploaded_file):
    """Validate uploaded file"""
    errors = []
    
    # Check file size
    if uploaded_file.size > MAX_FILE_SIZE:
        errors.append(f"File size too large. Maximum allowed: {MAX_FILE_SIZE // (1024*1024)}MB")
    
    # Check file extension
    filename = uploaded_file.name
    ext = os.path.splitext(filename)[1].lower()
    all_allowed = (ALLOWED_IMAGE_EXTENSIONS + ALLOWED_DOCUMENT_EXTENSIONS + 
                   ALLOWED_VIDEO_EXTENSIONS + ALLOWED_AUDIO_EXTENSIONS)
    
    if ext not in all_allowed:
        errors.append(f"File type not allowed. Allowed types: {', '.join(all_allowed)}")
    
    # Additional check for images
    file_type = get_file_type_from_extension(filename)
    if file_type == 'image' and uploaded_file.size > MAX_IMAGE_SIZE:
        errors.append(f"Image size too large. Maximum allowed: {MAX_IMAGE_SIZE // (1024*1024)}MB")
    
    return errors


def get_image_dimensions(image_file):
    """Get image dimensions"""
    try:
        with Image.open(image_file) as img:
            return img.size  # (width, height)
    except Exception:
        return None, None


def create_thumbnail(image_file, size_key='medium'):
    """Create thumbnail for an image"""
    if size_key not in THUMBNAIL_SIZES:
        raise ValueError(f"Invalid size key: {size_key}")
    
    size = THUMBNAIL_SIZES[size_key]
    
    try:
        # Open the image
        with Image.open(image_file) as img:
            # Convert to RGB if necessary (for PNG with transparency)
            if img.mode in ('RGBA', 'LA', 'P'):
                # Create a white background
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Create thumbnail
            img.thumbnail(size, Image.Resampling.LANCZOS)
            
            # Save to BytesIO
            thumb_io = BytesIO()
            img.save(thumb_io, format='JPEG', quality=85, optimize=True)
            thumb_io.seek(0)
            
            return ContentFile(thumb_io.read())
    
    except Exception as e:
        print(f"Error creating thumbnail: {e}")
        return None


def process_media_file(media_instance, uploaded_file):
    """Process uploaded media file and create thumbnails if it's an image"""
    
    # Set basic file information
    media_instance.file_name = uploaded_file.name
    media_instance.file_size = uploaded_file.size
    media_instance.mime_type = mimetypes.guess_type(uploaded_file.name)[0]
    media_instance.file_type = get_file_type_from_extension(uploaded_file.name)
    
    # Set title if not provided
    if not media_instance.title:
        media_instance.title = os.path.splitext(uploaded_file.name)[0]
    
    # Process images
    if media_instance.file_type == 'image':
        # Get image dimensions
        width, height = get_image_dimensions(uploaded_file)
        if width and height:
            media_instance.width = width
            media_instance.height = height
        
        # Create thumbnails
        uploaded_file.seek(0)  # Reset file pointer
        
        for size_key in THUMBNAIL_SIZES.keys():
            thumbnail_content = create_thumbnail(uploaded_file, size_key)
            if thumbnail_content:
                thumbnail_filename = f"{size_key}_{uploaded_file.name}"
                thumbnail_field = getattr(media_instance, f'thumbnail_{size_key}')
                thumbnail_field.save(thumbnail_filename, thumbnail_content, save=False)
        
        uploaded_file.seek(0)  # Reset file pointer again
    
    return media_instance


def get_media_url(media_instance, thumbnail_size=None):
    """Get URL for media file or thumbnail"""
    if thumbnail_size and media_instance.is_image():
        return media_instance.get_thumbnail_url(thumbnail_size)
    return media_instance.get_file_url()


def delete_media_files(media_instance):
    """Delete all files associated with a media instance"""
    files_to_delete = []
    
    # Main file
    if media_instance.file and default_storage.exists(media_instance.file.name):
        files_to_delete.append(media_instance.file.name)
    
    # Thumbnails
    for size in THUMBNAIL_SIZES.keys():
        thumbnail_field = getattr(media_instance, f'thumbnail_{size}')
        if thumbnail_field and default_storage.exists(thumbnail_field.name):
            files_to_delete.append(thumbnail_field.name)
    
    # Delete files
    for file_path in files_to_delete:
        try:
            default_storage.delete(file_path)
        except Exception as e:
            print(f"Error deleting file {file_path}: {e}")