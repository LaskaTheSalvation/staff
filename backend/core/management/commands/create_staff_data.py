from django.core.management.base import BaseCommand
from core.models import Company, User, TeamMember, UserLog
import hashlib


class Command(BaseCommand):
    help = 'Create sample staff data for testing'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample staff data...')
        
        # Create a sample company
        company, created = Company.objects.get_or_create(
            name="PT. BUMI KARTANEGARA",
            defaults={
                'description': 'A construction and engineering company',
                'address': 'Jakarta, Indonesia',
                'email': 'info@bumikartanegara.com',
                'phone': '+62-21-1234567'
            }
        )
        
        if created:
            self.stdout.write(
                self.style.SUCCESS(f'Company created: {company.name}')
            )
        else:
            self.stdout.write(f'Company already exists: {company.name}')
        
        # Create sample staff users
        staff_data = [
            {
                'username': 'ahmad_staff',
                'email': 'ahmad@bumikartanegara.com',
                'first_name': 'Ahmad',
                'last_name': 'Sutanto',
                'position': 'Construction Manager'
            },
            {
                'username': 'siti_staff',
                'email': 'siti@bumikartanegara.com',
                'first_name': 'Siti',
                'last_name': 'Rahayu',
                'position': 'Quality Control Engineer'
            },
            {
                'username': 'budi_staff',
                'email': 'budi@bumikartanegara.com',
                'first_name': 'Budi',
                'last_name': 'Santoso',
                'position': 'Safety Officer'
            }
        ]
        
        for staff_info in staff_data:
            # Create hash of password (simple hash for demo)
            password_hash = hashlib.sha256(f"staff123_{staff_info['username']}".encode()).hexdigest()
            
            user, created = User.objects.get_or_create(
                username=staff_info['username'],
                defaults={
                    'email': staff_info['email'],
                    'first_name': staff_info['first_name'],
                    'last_name': staff_info['last_name'],
                    'password_hash': password_hash,
                    'company': company,
                    'role': 'staff',
                    'is_active': True
                }
            )
            
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Staff user created: {user.username}')
                )
            else:
                self.stdout.write(f'Staff user already exists: {user.username}')
            
            # Create corresponding team member
            team_member, created = TeamMember.objects.get_or_create(
                name=f"{staff_info['first_name']} {staff_info['last_name']}",
                company=company,
                defaults={
                    'position': staff_info['position'],
                    'bio': f'Berpengalaman sebagai {staff_info["position"].lower()} dengan keahlian dalam proyek konstruksi dan engineering.',
                    'email': staff_info['email'],
                    'display_order': len(TeamMember.objects.all()) + 1
                }
            )
            
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Team member created: {team_member.name}')
                )
            else:
                self.stdout.write(f'Team member already exists: {team_member.name}')
        
        self.stdout.write(
            self.style.SUCCESS('Sample staff data creation completed!')
        )