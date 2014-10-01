DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'pokemon',
    }
}

EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = 'chuckcwh@gmail.com'
EMAIL_HOST_PASSWORD = '5tgb6YHN'
EMAIL_PORT = 587
DEFAULT_FROM_EMAIL = 'chuckcwh@gmail.com'