$(document).ready(function(){
var pokeResponse, pokemon = {};
var pokemonData = [];

    $( ".home_pic" ).hover(function() {
        $( this ).fadeTo("slow", 1);
        }, function() {
        $( this ).fadeTo( "slow" , 0.2);
        }
    );

    //New or Load game
    $('#load_game').on('click', function (){
        window.location.href = "/pokemon_load_game/";
    });

    $('#new_game').on('click', function () {
        window.location.href = "/pokemon_new_game/";
    });


    //choose 1 pokemon in new game
    $( "#dialog" ).mouseenter(function() {
        $( this ).fadeTo("slow", 1);
    });

    $('#dialog').on('click', function () {
        $('#dialog2').show();
        $('#dialog_oak').show();
        setTimeout("$('#dialog2').hide();", 2500);
        setTimeout("$('#dialog').hide();", 2500);
        setTimeout(chooseOneAni, 3000);
    });

    function chooseOneAni() {
        $('#team').show();
        $('#throw').show();
        $('#throw_text').show();
        setTimeout("$('#throw').hide();", 2500);
        setTimeout("$('#throw_text').hide();", 2500);
        setTimeout(chooseOne, 2700);
        setTimeout("$('#save').show();", 2700);

    }

    function chooseOne() {
        pokemonData = [];
        $('#sprites').html("<p><input id='teamname' type='text' placeholder='Team Name'></input></p>");
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
    }

    $(document).on('click', '.battle_start', function(){
        window.location.href = "/pokemon_battle/";
    });

    //show all teams with their pokemons
    $.ajax({
        url: '/all_your_team/',
        type: "GET",
        dataType: "json",
        success: function(data) {
            $('#team_show').append("<table><tbody class='row_show'>" +
                "</tbody></table>");
            for (i=0; i<data.length; i++) {
                teamName = data[i].name;
                teamId = data[i].id;
                $('.row_show').append("<tr>" +
                    "<td><button class='teambutton btn btn-success' value='" + teamName + "'>" + teamName +"</button></td>" +
                    "<td id='team" + i + "'></td>" +
                    "</tr>"
                );
                for (x=0; x<data[i].pokemons.length; x++) {
                    pokeName = data[i].pokemons[x].name;
                    pokeImage = data[i].pokemons[x].image;
                    pokeDex_id = data[i].pokemons[x].pokedex_id;
                    var spriteUrl = 'http://pokeapi.co/' + pokeImage;
                    var teamTD = "#team" + i;
                    $(teamTD).append("<div class='pokebox'><img class='f_pokemon' src=" + spriteUrl + "/><div class='name'>" + pokeName + "</div><div class='id'>" +
                        pokeDex_id + "</div></div>");
                }
            }
        }
    });


    //Show team's pokemons of requested user
    $(document).on('click', '.teambutton', function(){
        $('#go_battle').html("<button class='battle_start btn btn-warning'>Let\'s battle!</button>");
        var teamName = $(this).val();
        localStorage.setItem("store_team", teamName);
    });


    //Show user's team
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





    //Random choose one pokemon
    $('#pokeOne').on('click', function() {
        $('#sprites').html("");
        $('#team').show();
        $('#throw').show();
        setTimeout("$('#throw').hide();", 2800);
        setTimeout(pickOne, 3000);
    });

    var pickOne = function (){
        pokemonData = [];
        $('#sprites').html("<p><input id='teamname' type='text' placeholder='Team Name'></input></p>");
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
    };




    //Random choose 6 pokemon
    $('#pokeTeam').on('click', function(){
        $('#sprites').html("");
        $('#team').show();
        $('#throw').show();
        setTimeout("$('#throw').hide();", 2800);
        setTimeout(pickTeam, 3000);
    });

    var pickTeam = function (){
        pokemonData = [];
        $('#sprites').html("<p><input id='teamname' type='text' placeholder='Team Name'></input></p>");
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
    };


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

    //save new team (with one pokemon) to database
    $('#save_new_team').on('click', function() {
        $('#save_new_team').hide();
        $('.start_battle').show();
        var teamName = $("#teamname").val();
        localStorage.setItem("store_team", teamName);
        for (i=0;i<pokemonData.length;i++) {
            pokemonData[i].team = teamName;
//            pokemonData[i].delay = i;
        }
//        $('#team').hide();
        pokemo = JSON.stringify(pokemonData);
        $.ajax({
            url: '/new_pokemon/',
            type: 'POST',
            dataType: 'json',
            data: pokemo
        });
    });
//    var addButton = function() {
//        $('#your_pokeTeam').append("<button class='teambutton' value='" + teamId + "'>" + teamName +"</button>");
//    };

//    for
//    $('#deletebox').html("<option class='teamExisted' value=")

//    $('#deletecheck').on('click', function() {
//        var deleteTeam = $("#delectbox").val();
//        console.log(deleteTeam);
//    });


});
