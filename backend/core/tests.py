from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Company, Gallery, GalleryItem, Media, TeamMember


class GalleryAPITestCase(APITestCase):
    """Test cases for Gallery API endpoints"""
    
    def setUp(self):
        """Set up test data"""
        self.company = Company.objects.create(
            name="Test Company",
            description="Test company for gallery testing"
        )
        
        self.gallery = Gallery.objects.create(
            name="Test Gallery",
            description="Test gallery description",
            company=self.company
        )
        
        # Create a test media item
        self.media = Media.objects.create(
            title="Test Image",
            file_type="image",
            file_name="test.jpg",
            company=self.company
        )
    
    def test_create_gallery(self):
        """Test creating a new gallery"""
        url = reverse('gallery-list')
        data = {
            'name': 'New Gallery',
            'description': 'A new test gallery',
            'company': self.company.id
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Gallery.objects.count(), 2)
        self.assertEqual(response.data['name'], 'New Gallery')
    
    def test_list_galleries(self):
        """Test listing galleries"""
        url = reverse('gallery-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Handle paginated response if it exists
        data = response.data.get('results', response.data) if isinstance(response.data, dict) else response.data
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['name'], 'Test Gallery')
    
    def test_filter_galleries_by_company(self):
        """Test filtering galleries by company"""
        # Create another company and gallery
        other_company = Company.objects.create(name="Other Company")
        Gallery.objects.create(
            name="Other Gallery",
            company=other_company
        )
        
        url = reverse('gallery-list')
        response = self.client.get(url, {'company_id': self.company.id})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Handle paginated response if it exists
        data = response.data.get('results', response.data) if isinstance(response.data, dict) else response.data
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['company'], self.company.id)
    
    def test_get_gallery_detail(self):
        """Test retrieving gallery detail"""
        url = reverse('gallery-detail', kwargs={'pk': self.gallery.id})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Gallery')
        self.assertEqual(response.data['items_count'], 0)
    
    def test_update_gallery(self):
        """Test updating a gallery"""
        url = reverse('gallery-detail', kwargs={'pk': self.gallery.id})
        data = {
            'name': 'Updated Gallery Name',
            'description': 'Updated description'
        }
        
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Updated Gallery Name')
    
    def test_delete_gallery(self):
        """Test deleting a gallery"""
        url = reverse('gallery-detail', kwargs={'pk': self.gallery.id})
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Gallery.objects.count(), 0)
    
    def test_add_gallery_item(self):
        """Test adding an item to a gallery"""
        url = reverse('gallery-items', kwargs={'pk': self.gallery.id})
        data = {
            'media': self.media.id,
            'name': 'Test Gallery Item',
            'title': 'Test Item Title',
            'ordering': 1
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(GalleryItem.objects.count(), 1)
        self.assertEqual(response.data['name'], 'Test Gallery Item')
    
    def test_list_gallery_items(self):
        """Test listing gallery items"""
        # Create a gallery item
        gallery_item = GalleryItem.objects.create(
            gallery=self.gallery,
            media=self.media,
            name='Test Item',
            title='Test Title',
            ordering=1
        )
        
        url = reverse('gallery-items', kwargs={'pk': self.gallery.id})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Test Item')
    
    def test_update_gallery_item(self):
        """Test updating a gallery item"""
        gallery_item = GalleryItem.objects.create(
            gallery=self.gallery,
            media=self.media,
            name='Original Name',
            title='Original Title',
            ordering=1
        )
        
        url = reverse('gallery-item-detail', kwargs={
            'pk': self.gallery.id,
            'item_id': gallery_item.id
        })
        data = {
            'name': 'Updated Name',
            'title': 'Updated Title'
        }
        
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Updated Name')
    
    def test_delete_gallery_item(self):
        """Test deleting a gallery item"""
        gallery_item = GalleryItem.objects.create(
            gallery=self.gallery,
            media=self.media,
            name='Test Item',
            ordering=1
        )
        
        url = reverse('gallery-item-detail', kwargs={
            'pk': self.gallery.id,
            'item_id': gallery_item.id
        })
        
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(GalleryItem.objects.count(), 0)


class TeamMemberAPITestCase(APITestCase):
    """Test cases for TeamMember API (used for directors/commissioners)"""
    
    def setUp(self):
        """Set up test data"""
        self.company = Company.objects.create(
            name="Test Company",
            description="Test company for team member testing"
        )
    
    def test_create_director(self):
        """Test creating a director/commissioner"""
        url = reverse('teammember-list')
        data = {
            'name': 'John Director',
            'position': 'Chief Executive Officer',
            'bio': 'Experienced leader with 20+ years in the industry',
            'is_management': True,
            'company': self.company.id,
            'display_order': 1
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(TeamMember.objects.count(), 1)
        self.assertEqual(response.data['name'], 'John Director')
        self.assertTrue(response.data['is_management'])
    
    def test_list_management_members(self):
        """Test filtering team members for management only"""
        # Create management and regular team members
        TeamMember.objects.create(
            name='Director Smith',
            position='Director',
            is_management=True,
            company=self.company
        )
        TeamMember.objects.create(
            name='Regular Employee',
            position='Developer',
            is_management=False,
            company=self.company
        )
        
        url = reverse('teammember-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Handle paginated response if it exists
        data = response.data.get('results', response.data) if isinstance(response.data, dict) else response.data
        self.assertEqual(len(data), 2)
        
        # In the actual frontend, we'd filter for is_management=True
        management_members = [member for member in data if member['is_management']]
        self.assertEqual(len(management_members), 1)
        self.assertEqual(management_members[0]['name'], 'Director Smith')
    
    def test_update_director(self):
        """Test updating a director's information"""
        director = TeamMember.objects.create(
            name='Original Name',
            position='Director',
            bio='Original bio',
            is_management=True,
            company=self.company
        )
        
        url = reverse('teammember-detail', kwargs={'pk': director.id})
        data = {
            'name': 'Updated Director Name',
            'bio': 'Updated director biography'
        }
        
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Updated Director Name')
        self.assertEqual(response.data['bio'], 'Updated director biography')


class ModelTestCase(TestCase):
    """Test cases for model functionality"""
    
    def setUp(self):
        self.company = Company.objects.create(name="Test Company")
    
    def test_gallery_string_representation(self):
        """Test Gallery model string representation"""
        gallery = Gallery.objects.create(
            name="Test Gallery",
            company=self.company
        )
        self.assertEqual(str(gallery), "Test Gallery - Test Company")
    
    def test_gallery_item_string_representation(self):
        """Test GalleryItem model string representation"""
        gallery = Gallery.objects.create(name="Test Gallery", company=self.company)
        media = Media.objects.create(title="Test Image", file_type="image")
        
        gallery_item = GalleryItem.objects.create(
            gallery=gallery,
            media=media,
            name="Test Item",
            title="Test Title"
        )
        self.assertEqual(str(gallery_item), "Test Gallery - Test Title")
    
    def test_team_member_string_representation(self):
        """Test TeamMember model string representation"""
        team_member = TeamMember.objects.create(
            name="John Doe",
            position="Director",
            company=self.company
        )
        self.assertEqual(str(team_member), "John Doe - Director")
