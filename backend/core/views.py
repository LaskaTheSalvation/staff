from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import (
    BannerContent, ServiceContent, ServiceTable, 
    AboutUsContent, AboutUsPicture, JourneyContent, Page
)
from .serializers import (
    BannerContentSerializer, ServiceContentSerializer, ServiceTableSerializer,
    AboutUsContentSerializer, AboutUsPictureSerializer, JourneyContentSerializer,
    PageSerializer, ServiceContentCreateSerializer, AboutUsContentCreateSerializer
)


def index(request):
    return render(request, "index.html")


class BannerContentViewSet(viewsets.ModelViewSet):
    """ViewSet for banner content management"""
    queryset = BannerContent.objects.all()
    serializer_class = BannerContentSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def public(self, request):
        """Public endpoint to get banner content for frontend display"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class ServiceContentViewSet(viewsets.ModelViewSet):
    """ViewSet for service content management"""
    queryset = ServiceContent.objects.all()
    serializer_class = ServiceContentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ServiceContentCreateSerializer
        return ServiceContentSerializer
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def public(self, request):
        """Public endpoint to get service content for frontend display"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class ServiceTableViewSet(viewsets.ModelViewSet):
    """ViewSet for service table rows"""
    queryset = ServiceTable.objects.all()
    serializer_class = ServiceTableSerializer
    permission_classes = [IsAuthenticated]


class AboutUsContentViewSet(viewsets.ModelViewSet):
    """ViewSet for about us content management"""
    queryset = AboutUsContent.objects.all()
    serializer_class = AboutUsContentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return AboutUsContentCreateSerializer
        return AboutUsContentSerializer
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def public(self, request):
        """Public endpoint to get about us content for frontend display"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class AboutUsPictureViewSet(viewsets.ModelViewSet):
    """ViewSet for about us picture rows"""
    queryset = AboutUsPicture.objects.all()
    serializer_class = AboutUsPictureSerializer
    permission_classes = [IsAuthenticated]


class JourneyContentViewSet(viewsets.ModelViewSet):
    """ViewSet for our journey content management"""
    queryset = JourneyContent.objects.all()
    serializer_class = JourneyContentSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def public(self, request):
        """Public endpoint to get journey content for frontend display"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class PageViewSet(viewsets.ModelViewSet):
    """ViewSet for page management"""
    queryset = Page.objects.filter(status='published')
    serializer_class = PageSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def public(self, request):
        """Public endpoint to get published pages for frontend display"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def by_name(self, request):
        """Get page by name - public endpoint"""
        page_name = request.query_params.get('name')
        if not page_name:
            return Response({'error': 'Page name is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            page = Page.objects.get(name=page_name, status='published')
            serializer = self.get_serializer(page)
            return Response(serializer.data)
        except Page.DoesNotExist:
            return Response({'error': 'Page not found'}, status=status.HTTP_404_NOT_FOUND)
