$(document).ready(function(){
var pokeResponse, pokemon = {};
var pokemonData = [];

    //Show user's team
    $.ajax({
        url: '/all_your_team/',
        type: "GET",
        dataType: "json",
        success: function(data) {
            for (i=0; i<data.length; i++) {
                team = data[i].name;
                teamId = data[i].id;
                console.log(teamId);
                $('#your_pokeTeam').append("<button class='teambutton' value='" + teamId + "'>" + team +"</button>");
            }
        }
    });

    //Show team's pokemons of user
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

    //Random choose one pokemon
    $('#pokeOne').on('click', function(){
        pokemonData = [];
        $('#sprites').html("<p><input id='teamname' type='text'>:Team Name</input></p>");
        var ranNumber = Math.floor(Math.random()*718 + 2);
        $.ajax({
            url: "http://pokeapi.co/api/v1/sprite/" + ranNumber + "/",
            type: "GET",
            dataType: "jsonp",
            success: function(data) {
                pokeResponse = data;
                name = data.pokemon.name;
                pokedex_id = data.id - 1;
                image = data.image;
                var spriteUrl = 'http://pokeapi.co/' + data.image;
                $('#sprites').append("<div class='pokebox'><img class='pokemon' src=" +
                    spriteUrl + "/><div class='name'>" + name + "</div><div class='id'>" +
                    pokedex_id + "</div></div>");
                pokemonData.push ({
                    pokedex_id: pokedex_id,
                    image: image,
                    name: name
                });
            }
        });

    });




    //Random choose 6 pokemon
    $('#pokeTeam').on('click', function(){
        pokemonData = [];
        $('#sprites').html("<p><input id='teamname' type='text'>:Team Name</input></p>");
        for (i=0;i<6;i++) {
            var ranNumber = Math.floor(Math.random()*718 + 2);
            $.ajax({
                url: "http://pokeapi.co/api/v1/sprite/" + ranNumber + "/",
                type: "GET",
                dataType: "jsonp",
                    success: function(data) {
                    pokeResponse = data;
                    team = "My_team";
                    name = data.pokemon.name;
                    pokedex_id = data.id - 1;
                    image = data.image;
                    var spriteUrl = 'http://pokeapi.co/' + data.image;
                    $('#sprites').append("<div class='pokebox'><img class='pokemon' src=" + spriteUrl
                        + "/><div class='name'>" + name + "</div><div class='id'>" + pokedex_id
                        + "</div></div>");
                    pokemonData.push ({
                        pokedex_id: pokedex_id,
                        image: image,
                        name: name
                    });
                }
            });
        }

    });


    //Shows my favorite team
    $('#pokemy').on('click', function() {
        $('#sprites').html("");
        for (i=0;i<6;i++) {
            myPokemon = [3, 16, 408, 606, 89, 107];
            $.ajax({
                url: "http://pokeapi.co/api/v1/sprite/" + myPokemon[i] + "/",
                type: "GET",
                dataType: "jsonp",
                success: function(data) {
                    pokeResponse = data;
                    pokemon.name = data.pokemon.name;
                    pokemon.id = data.id - 1;
                    pokemon.image = data.image;
                    var spriteUrl = 'http://pokeapi.co/' + data.image;
                    $('#sprites').append("<div class='pokebox'><img class='pokemon' src=" + spriteUrl + "/><div class='name'>" + pokemon.name + "</div><div class='id'>" + pokemon.id + "</div></div>");
                }
            });
        }
    });

    //save pokemon(s) and team to database
    $('#save').on('click', function() {
        var teamName = $("#teamname").val();
        for (i=0;i<pokemonData.length;i++) {
            pokemonData[i].team = teamName;
//            pokemonData[i].delay = i;
        }
        pokemo = JSON.stringify(pokemonData);
        $.ajax({
            url: '/new_pokemon/',
            type: 'POST',
            dataType: 'json',
            data: pokemo,
            success: function (response) {
                console.log("ajax success");
            },
            error: function (response) {
                console.log("ajax error")
            }
        });

    });

//    for
//    $('#deletebox').html("<option class='teamExisted' value=")

    $('#deletecheck').on('click', function() {
        var deleteTeam = $("#delectbox").val();
        console.log(deleteTeam);
    });

});


//
//
//$.ajax({
//    url: '/all_pokemon',
//    type: "GET",
//    success: function(data) {
//        console.log(data);
//    }
//});
//
//var pokemonData = {
//    pokedex_id: 25,
//    image: "/media/img/25.png",
//    name: "Pikachu",
//    team: {
//        name: "Random Team",
//        id: 1
//    }
//};
//
//pokemonData = JSON.stringify(pokemonData);
//
