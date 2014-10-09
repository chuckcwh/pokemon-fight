from django.conf import settings
from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'pokemon.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^$', 'pokemon_app.views.home', name='home'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^profile/$', 'pokemon_app.views.profile', name='profile'),
    url(r'^faq/$', 'pokemon_app.views.faq', name='faq'),
    url(r'^register/$', 'pokemon_app.views.register', name='register'),
    url(r'^login/$', 'django.contrib.auth.views.login', name='login'),
    url(r'^logout/$', 'django.contrib.auth.views.logout', name='logout'),
    url(r'^password_reset/$', 'django.contrib.auth.views.password_reset', name='password_reset'),
    url(r'^password_reset/done/$', 'django.contrib.auth.views.password_reset_done', name='password_reset_done'),
    url(r'^reset/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        'django.contrib.auth.views.password_reset_confirm',
        name='password_reset_confirm'),
    url(r'^reset/done/$', 'django.contrib.auth.views.password_reset_complete', name='password_reset_complete'),

    url(r'^pokemon/$', 'pokemon_app.views.pokemon', name='pokemon'),
    url(r'^pokemon_new_game/$', 'pokemon_app.views.pokemon_new_game', name='pokemon_new_game'),
    url(r'^pokemon_load_game/$', 'pokemon_app.views.pokemon_load_game', name='pokemon_load_game'),
    url(r'^pokemon_battle/$', 'pokemon_app.views.pokemon_battle', name='pokemon_battle'),
    url(r'^pokemon_surprise/$', 'pokemon_app.views.pokemon_surprise', name='pokemon_surprise'),
    url(r'^pokemon_lab/$', 'pokemon_app.views.pokemon_lab', name='pokemon_lab'),

    # ajax call
    url(r'^poke_lab_data/$', 'pokemon_app.views.poke_lab_data', name='poke_lab_data'),
    url(r'^all_your_team/$', 'pokemon_app.views.all_your_team', name='all_your_team'),
    url(r'^pokemon_of_team/$', 'pokemon_app.views.pokemon_of_team', name='pokemon_of_team'),
    url(r'^new_pokemon/$', 'pokemon_app.views.new_pokemon', name='new_pokemon'),
    url(r'^delete_team/$', 'pokemon_app.views.delete_team', name='delete_team'),
    url(r'^delete_pokemon/$', 'pokemon_app.views.delete_pokemon', name='delete_pokemon'),
    url(r'^my_battle_pokemon/$', 'pokemon_app.views.my_battle_pokemon', name='my_battle_pokemon'),
    url(r'^beat_and_catch/$', 'pokemon_app.views.beat_and_catch', name='beat_and_catch'),
    url(r'^team_for_delete/$', 'pokemon_app.views.team_for_delete', name='team_for_delete'),
)

urlpatterns += patterns('',
    (r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.STATIC_ROOT}),
)