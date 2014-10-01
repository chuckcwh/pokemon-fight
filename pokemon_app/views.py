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

def all_pokemon(request):
    pokemon_objects = Pokemon.objects.all()
    collection = []
    for pokemon in pokemon_objects:
        collection.append({
            'name': pokemon.name,
            'image': pokemon.image,
            'pokedex_id': pokemon.pokedex_id,
            'team': {
                'id': pokemon.team.id,
                'name': pokemon.team.name,
            }
        })
    return HttpResponse(
                json.dumps(collection),
                content_type='application.json'
           )

@csrf_exempt
def new_pokemon(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        time.sleep(int(data['delay'])*0.1)
        team = Team.objects.filter(name=data['team'])
        if len(team):
            team = team[0]
        else:
            team = Team.objects.create(name=data['team'])
        print(team)
        pokemon = Pokemon.objects.create(
            name=data['name'],
            image=data['image'],
            pokedex_id=data['pokedex_id'],
            team=team
        )
    response = serializers.serialize('json', [pokemon])
    return HttpResponse(response,
                        content_type='application/json')


def pokemon_data_dump(request):
    pokemon = Pokemon.objects.all()
    data = json.dumps('json', pokemon)
    return HttpResponse(data, content_type='application/json')