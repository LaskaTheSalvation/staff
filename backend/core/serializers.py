from rest_framework import serializers
from .models import (
    BannerContent, ServiceContent, ServiceTable, 
    AboutUsContent, AboutUsPicture, JourneyContent, Page
)


class BannerContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = BannerContent
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


class ServiceTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceTable
        fields = ['id', 'nama', 'title', 'text', 'order']


class ServiceContentSerializer(serializers.ModelSerializer):
    table_rows = ServiceTableSerializer(many=True, read_only=True)
    
    class Meta:
        model = ServiceContent
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


class AboutUsPictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutUsPicture
        fields = ['id', 'title', 'content', 'image', 'order']


class AboutUsContentSerializer(serializers.ModelSerializer):
    picture_rows = AboutUsPictureSerializer(many=True, read_only=True)
    
    class Meta:
        model = AboutUsContent
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


class JourneyContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = JourneyContent
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


# Serializers for creating nested objects
class ServiceContentCreateSerializer(serializers.ModelSerializer):
    table_rows = ServiceTableSerializer(many=True, required=False)
    
    class Meta:
        model = ServiceContent
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')
    
    def create(self, validated_data):
        table_rows_data = validated_data.pop('table_rows', [])
        service_content = ServiceContent.objects.create(**validated_data)
        
        for row_data in table_rows_data:
            ServiceTable.objects.create(service_content=service_content, **row_data)
        
        return service_content


class AboutUsContentCreateSerializer(serializers.ModelSerializer):
    picture_rows = AboutUsPictureSerializer(many=True, required=False)
    
    class Meta:
        model = AboutUsContent
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')
    
    def create(self, validated_data):
        picture_rows_data = validated_data.pop('picture_rows', [])
        aboutus_content = AboutUsContent.objects.create(**validated_data)
        
        for row_data in picture_rows_data:
            AboutUsPicture.objects.create(aboutus_content=aboutus_content, **row_data)
        
        return aboutus_content