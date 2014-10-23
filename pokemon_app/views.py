import json
from operator import itemgetter
from django.contrib.auth.decorators import login_required
from django.core import serializers
from django.core.mail import EmailMultiAlternatives
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from pokemon import settings
from pokemon_app.forms import EmailUserCreationForm
from pokemon_app.models import Pokemon, Team

# Create your views here.
def home(request):
    return render(request, 'home.html')


@login_required
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


def poke_lab_data(request):
    pokeCheck = []
    userPokesUS = []
    pokemons = Pokemon.objects.filter(team__user=request.user)
    for pokemon in pokemons:
        if not pokemon.name in pokeCheck:
            pokeCheck.append(pokemon.name)
            userPokesUS.append({
                'name': pokemon.name,
                'image': 'http://pokeapi.co/' + pokemon.image,
                'pokedex_id': pokemon.pokedex_id,
                'color': "green",
            })
    pokeall = Pokemon.objects.all().order_by('pokedex_id')
    for poke in pokeall:
        if not poke.name in pokeCheck:
            pokeCheck.append(poke.name)
            userPokesUS.append({
                'name': poke.name,
                'image': 'http://pokeapi.co/' + poke.image,
                'pokedex_id': poke.pokedex_id,
                'color': "yellow",
            })
    userPokes = sorted(userPokesUS, key=itemgetter('pokedex_id'))
    return HttpResponse(
                json.dumps(userPokes),
                content_type='application.json'
    )


def faq(request):
    return render(request, 'faq.html')

@login_required
def profile(request):
    return render(request, 'profile.html')


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


def user_team_pokemon(request):
    collection = []
    team_objects = Team.objects.filter(user = request.user)

    return HttpResponse(
        json.dumps(collection),
        content_type='application.json'
    )


def all_your_team(request):
    team_objects = Team.objects.filter(user = request.user)
    collection = []
    for team in team_objects:
        collection_team = []
        pokemon_objects = Pokemon.objects.filter(team=team)
        for pokemon in pokemon_objects:
            collection_team.append({
                'name': pokemon.name,
                'image': pokemon.image,
                'pokedex_id': pokemon.pokedex_id,
            })
        collection.append({
            'name': team.name,
            'id': team.id,
            'pokemons': collection_team,
        })
    return HttpResponse(
                json.dumps(collection),
                content_type='application.json'
    )


@csrf_exempt
def pokemon_of_team(request):
    data = json.loads(request.body)
    team = Team.objects.get(name=data['team_name'])
    team_id = team.id
    pokemon_objects = Pokemon.objects.filter(team=team_id)
    collection = []
    for pokemon in pokemon_objects:
        collection.append({
            'id': pokemon.id,
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


@csrf_exempt
def beat_and_catch(request):
    pokemonadd = None
    if request.method == 'POST':
        data = json.loads(request.body)
        team = Team.objects.get(name=data['team'])
        teamMemberCount = Pokemon.objects.filter(team=team).count()
        if teamMemberCount < 6:
            pokemon = Pokemon.objects.create(
                name=data['name'],
                image=data['image'],
                pokedex_id=data['pokedex_id'],
                team=team
            )
            pokemonadd = serializers.serialize('json', [pokemon])
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
    choose = None
    if request.method == 'POST':
        data = json.loads(request.body)
        pokemon = Pokemon.objects.get(name=data)
        my_choose = {
            'id': pokemon.id,
            'name': pokemon.name,
            'image': pokemon.image,
            'pokedex_id': pokemon.pokedex_id,
        }
        choose = my_choose

    return HttpResponse(
                json.dumps(choose),
                content_type='application.json'
    )


def team_for_delete(request):
    team_objects = Team.objects.filter(user = request.user)
    collection = []
    for team in team_objects:
        collection.append({
            'name': team.name,
        })
    return HttpResponse(
                json.dumps(collection),
                content_type='application.json'
    )


@csrf_exempt
def delete_pokemon(request):
    if request.method == 'DELETE':
        data = json.loads(request.body)
        team = Team.objects.get(name=data[0])
        Pokemon.objects.get(name=data[1], team=team).delete()

        return HttpResponse(status=200)

@csrf_exempt
def delete_team(request):
    if request.method == 'DELETE':
        data = json.loads(request.body)
        Team.objects.get(name=data).delete()

        return HttpResponse(status=200)
