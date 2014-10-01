from django.contrib.auth.models import User
from django.db import models

# Create your models here.
class Team(models.Model):
    name = models.CharField(max_length=30)
    user = models.ForeignKey(User, related_name='teams')

    def __unicode__(self):
        return u"{}".format(self.name)


class Pokemon(models.Model):
    name = models.CharField(max_length=30)
    image = models.URLField()
    pokedex_id = models.PositiveIntegerField()  # this is the ID from the pokeapi
    team = models.ForeignKey(Team, related_name='pokemons')

    def __unicode__(self):
        return u"{}".format(self.name)