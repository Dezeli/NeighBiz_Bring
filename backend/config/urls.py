from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/accounts/', include('accounts.urls')),
    path('api/v1/stores/', include('stores.urls')),
    path('api/v1/partnerships/', include('partnerships.urls')),
    path('api/v1/coupons/', include('coupons.urls')),
    path('api/v1/upload/', include('upload.urls')),
]
