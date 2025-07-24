from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Department, Employee
from .serializers import DepartmentSerializer, EmployeeSerializer, EmployeeListSerializer

def index(request):
    return render(request, "index.html")


class DepartmentViewSet(viewsets.ModelViewSet):
    """ViewSet for managing departments"""
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

    @action(detail=True, methods=['get'])
    def employees(self, request, pk=None):
        """Get all employees in a specific department"""
        department = self.get_object()
        employees = department.employees.all()
        serializer = EmployeeListSerializer(employees, many=True)
        return Response(serializer.data)


class EmployeeViewSet(viewsets.ModelViewSet):
    """ViewSet for managing employees"""
    queryset = Employee.objects.select_related('department').all()
    
    def get_serializer_class(self):
        if self.action == 'list':
            return EmployeeListSerializer
        return EmployeeSerializer

    @action(detail=False, methods=['get'])
    def by_department(self, request):
        """Get employees grouped by department"""
        departments = Department.objects.prefetch_related('employees').all()
        result = []
        for dept in departments:
            employees = EmployeeListSerializer(dept.employees.all(), many=True).data
            result.append({
                'department': DepartmentSerializer(dept).data,
                'employees': employees
            })
        return Response(result)

    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get only active employees"""
        active_employees = self.queryset.filter(employment_status='ACTIVE')
        serializer = self.get_serializer(active_employees, many=True)
        return Response(serializer.data)
