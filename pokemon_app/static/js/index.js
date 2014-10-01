
$(document).ready(function(){
var pokeResponse, pokemon = {};
var pokemonData = [];

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
