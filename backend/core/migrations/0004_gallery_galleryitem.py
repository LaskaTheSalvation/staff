# Generated manually for Gallery and GalleryItem models

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_media_alt_text_media_description_media_file_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Gallery',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='Default Gallery', max_length=255)),
                ('description', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('company', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='core.company')),
            ],
            options={
                'verbose_name_plural': 'Galleries',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='GalleryItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=255, null=True)),
                ('title', models.CharField(blank=True, max_length=255, null=True)),
                ('ordering', models.PositiveIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('gallery', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='core.gallery')),
                ('media', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='core.media')),
            ],
            options={
                'ordering': ['ordering', 'created_at'],
            },
        ),
    ]