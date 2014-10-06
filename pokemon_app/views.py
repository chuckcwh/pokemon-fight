import json
from django.contrib.auth.decorators import login_required
from django.core import serializers
from django.core.mail import EmailMultiAlternatives
from django.http import HttpResponse
from django.shortcuts import render, render_to_response, redirect

# Create your views here.
from django.views.decorators.csrf import csrf_exempt
import time
from pokemon import settings
from pokemon_app.forms import EmailUserCreationForm
from pokemon_app.models import Pokemon, Team

def home(request):
    return render(request, 'home.html')

def pokemon(request):
    return render(request, 'pokemon.html')

@login_required
def pokemon_new_game(request):
    return render(request, 'pokemon_new_game.html')

@login_required
def pokemon_load_game(request):
    return render(request, 'pokemon_load_game.html')

@login_required
def pokemon_battle(request):
    return render(request, 'pokemon_battle.html')

@login_required
def pokemon_lab(request):
    return render(request, 'pokemon_lab.html')

def faq(request):
    return render(request, 'faq.html')

@login_required
def profile(request):
    return render(request, 'profile.html', {})

def register(request):
    if request.method == 'POST':
        form = EmailUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            text_content = 'Thank you for signing up for our website at {}, {} {}'.format(user.date_joined, user.first_name, user.last_name)
            html_content = '<h2>Thanks {} {} for signing up at {}!</h2> <div>I hope you enjoy using our site</div>'.format(user.first_name, user.last_name, user.date_joined)
            msg = EmailMultiAlternatives("Welcome!", text_content, settings.DEFAULT_FROM_EMAIL, [user.email])
            msg.attach_alternative(html_content, "text/html")
            msg.send()
            return redirect("profile")
    else:
        form = EmailUserCreationForm()

    return render(request, "registration/register.html", {
        'form': form,
    })

def all_your_team(request):
    team_objects = Team.objects.filter(user = request.user)
    collection = []
    for team in team_objects:
        collection.append({
            'name': team.name,
            'id': team.id
        })

    return HttpResponse(
                json.dumps(collection),
                content_type='application.json'
    )

@csrf_exempt
def pokemon_of_team(request):
    data = json.loads(request.body)
    pokemon_objects = Pokemon.objects.filter(team=data['team_id'])
    collection = []
    for pokemon in pokemon_objects:
        collection.append({
            'name': pokemon.name,
            'image': pokemon.image,
            'pokedex_id': pokemon.pokedex_id,
        })
    return HttpResponse(
                json.dumps(collection),
                content_type='application.json'
    )

@csrf_exempt
def new_pokemon(request):
    pokemonadd = []
    if request.method == 'POST':
        data = json.loads(request.body)
        # time.sleep(int(data['delay'])*0.1)
        for i in data:
            team = Team.objects.filter(name=i['team'])
            if len(team):
                team = team[0]
            else:
                team = Team.objects.create(name=i['team'], user = request.user)
            pokemon = Pokemon.objects.create(
                name=i['name'],
                image=i['image'],
                pokedex_id=i['pokedex_id'],
                team=team
            )
            pokemonEach = serializers.serialize('json', [pokemon])
            pokemonadd.append(pokemonEach)
    response = pokemonadd
    return HttpResponse(response,
                        content_type='application/json')

def remove_team(request, team_name):
    item = Team.objects.get(name=team_name)
    item.delete()
    # return HttpResponse(response,
    #                     content_type='application/json')
    # return redirect("home")

def my_battle_pokemon(request):
    pokemon = Pokemon.objects.get(id=28)
    my_choose = {
        'name': pokemon.name,
        'image': pokemon.image,
        'pokedex_id': pokemon.pokedex_id,
    }
    return HttpResponse(
                json.dumps(my_choose),
                content_type='application.json'
    )

# def enemy_pokemon(request):
#     pokemon = Pokemon.objects.get(id=28)
#     my_choose = {
#         'name': pokemon.name,
#         'image': pokemon.image,
#         'pokedex_id': pokemon.pokedex_id,
#     }
#     return HttpResponse(
#                 json.dumps(my_choose),
#                 content_type='application.json'
#     )


def pokemon_data_dump(request):
    pokemon = Pokemon.objects.all()
    data = json.dumps('json', pokemon)
    return HttpResponse(data, content_type='application/json')