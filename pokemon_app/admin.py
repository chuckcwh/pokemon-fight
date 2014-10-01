from django.contrib import admin

# Register your models here.
from pokemon_app.models import Team, Pokemon

admin.site.register(Team)
admin.site.register(Pokemon)
