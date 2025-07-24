from django.core.management.base import BaseCommand
from core.models import BannerContent, ServiceContent, ServiceTable, AboutUsContent, AboutUsPicture, JourneyContent, Page


class Command(BaseCommand):
    help = 'Create sample data for the API'

    def handle(self, *args, **options):
        # Create Banner Content
        BannerContent.objects.get_or_create(
            type='title',
            defaults={
                'title': 'Welcome to Our Staff Management System',
                'order': 1
            }
        )
        
        BannerContent.objects.get_or_create(
            type='text',
            defaults={
                'text': 'Manage your staff efficiently with our comprehensive management system.',
                'order': 2
            }
        )
        
        BannerContent.objects.get_or_create(
            type='button_link',
            defaults={
                'button_text': 'Get Started',
                'button_url': '/staff/home',
                'order': 3
            }
        )
        
        # Create Service Content
        service_title = ServiceContent.objects.get_or_create(
            type='title',
            defaults={
                'title': 'Our Services',
                'order': 1
            }
        )[0]
        
        service_content = ServiceContent.objects.get_or_create(
            type='content',
            defaults={
                'title': 'Staff Management',
                'content': 'Complete staff management solution for your organization.',
                'order': 2
            }
        )[0]
        
        service_table = ServiceContent.objects.get_or_create(
            type='table',
            defaults={
                'title': 'Service Features',
                'order': 3
            }
        )[0]
        
        # Create Service Table rows
        ServiceTable.objects.get_or_create(
            service_content=service_table,
            nama='attendance',
            defaults={
                'title': 'Attendance Management',
                'text': 'Track employee attendance efficiently',
                'order': 1
            }
        )
        
        ServiceTable.objects.get_or_create(
            service_content=service_table,
            nama='payroll',
            defaults={
                'title': 'Payroll System',
                'text': 'Automated payroll calculation and management',
                'order': 2
            }
        )
        
        # Create About Us Content
        AboutUsContent.objects.get_or_create(
            type='title',
            defaults={
                'title': 'About Our Company',
                'order': 1
            }
        )
        
        AboutUsContent.objects.get_or_create(
            type='description',
            defaults={
                'title': 'Our Mission',
                'description': 'We provide innovative staff management solutions to help organizations grow.',
                'order': 2
            }
        )
        
        aboutus_picture = AboutUsContent.objects.get_or_create(
            type='picture',
            defaults={
                'title': 'Our Team',
                'order': 3
            }
        )[0]
        
        # Create About Us Picture rows
        AboutUsPicture.objects.get_or_create(
            aboutus_content=aboutus_picture,
            title='Team Photo 1',
            defaults={
                'content': 'Our dedicated development team',
                'order': 1
            }
        )
        
        # Create Journey Content
        JourneyContent.objects.get_or_create(
            title='Company Founded',
            defaults={
                'description': 'Started our journey to revolutionize staff management',
                'order': 1
            }
        )
        
        # Create Pages
        Page.objects.get_or_create(
            name='contact',
            defaults={
                'title': 'Contact Us',
                'content': 'Get in touch with our team for any inquiries.',
                'meta_description': 'Contact us for staff management solutions'
            }
        )
        
        Page.objects.get_or_create(
            name='media',
            defaults={
                'title': 'Media Center',
                'content': 'Latest news and updates from our company.',
                'meta_description': 'Media and news updates'
            }
        )
        
        Page.objects.get_or_create(
            name='service',
            defaults={
                'title': 'Our Services',
                'content': 'Comprehensive staff management services.',
                'meta_description': 'Staff management services and solutions'
            }
        )
        
        self.stdout.write(
            self.style.SUCCESS('Successfully created sample data')
        )