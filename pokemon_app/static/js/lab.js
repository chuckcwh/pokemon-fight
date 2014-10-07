$(document).ready(function(){

//    Show user's team
    $.ajax({
        url: '/all_your_team/',
        type: "GET",
        dataType: "json",
        success: function(data) {
            for (i=0; i<data.length; i++) {
                team = data[i].name;
                teamId = data[i].id;
                $('#your_pokeTeam').append("<button class='teambutton btn btn-success' value='" + teamId + "'>" + team +"</button>");
            }
        }
    });



//    Show team's pokemons of requested user
    $(document).on('click', '.teambutton', function(){
        var teamId = $(this).val();
        var teamIdData = {team_id: teamId};
        $.ajax({
            url: '/pokemon_of_team/',
            type: "POST",
            dataType: "json",
            data: JSON.stringify(teamIdData),
            success: function(data) {
                $('#your_pokemons').html("");
                for (i=0; i<data.length; i++) {
                    name = data[i].name;
                    pokedex_id = data[i].pokedex_id;
                    image = data[i].image;
                    var spriteUrl = 'http://pokeapi.co/' + image;
                    $('#your_pokemons').append("<div class='pokebox'><img class='f_pokemon' src=" + spriteUrl + "/><div class='name'>" + name + "</div><div class='id'>" +
                        pokedex_id + "</div></div>");
                }
            }
        });
    });
});

