$(document).ready(function() {
var myblood = 100;
var enemyblood = 100;
var ene_name;
    //show the pokemon team
//    var teamId = store_number;
//    var teamIdData = {team_id: teamId};

    var teamName = localStorage.getItem("store_team");
    var teamNameData = {team_name: teamName};
    $.ajax({
        url: '/pokemon_of_team/',
        type: "POST",
        dataType: "json",
        data: JSON.stringify(teamNameData),
        success: function(data) {
            for (i=0; i<data.length; i++) {
                name = data[i].name;
                pokedex_id = data[i].pokedex_id;
                image = data[i].image;
                id = data[i].id;
                var spriteUrl = 'http://pokeapi.co/' + image;
                $('#battle_team').append("<div class='pokebox'><img class='f_pokemon' src=" + spriteUrl + "/><div class='name'>" + name + "</div><div class='pokedex_id'>" +
                    pokedex_id + "</div></div>");
            }
        }
    });


    //battle system - my pokemon
    $(document).on('click', '.pokebox', function(){
        $('#my_choice').append("<p><i>Are you sure?</i></p><button id='yes'>Yes</button>" +
            "<button id='no'>No</button>");
        pokeName = $(this).find('div.name').text();
        spriteUrl = $(this).find('img').attr('src');
        $('#my_pokemon').html("<div class='pokebox battle_mode'><img class='pokemon' src=" +
            spriteUrl + "/><div class='name'>" + pokeName + "</div></div>");
        $('#battle_team').hide();
        show_my_condition();
    });

    $(document).on('click', '#no', function(){
        $('#my_choice').html("please select a pokemon");
        $('#battle_team').show();
    });

    $(document).on('click', '#yes', function(){
        $('#my_choice').html("please select a pokemon");
        $('#my_choice').hide();


    });

    //battle system - enemy pokemon
    $('#enemy_choice').on('click', function() {
        show_enemy_condition();
        $('#discription').html("");
        $('#enemy_choice').hide();
        $('#my_choice').hide();
        $('#attack').show();
        pokemonData = [];
        $('#enemy_pokemon').html("");
        var ranNumber = Math.floor(Math.random()*718 + 2);
        $.ajax({
            url: "http://pokeapi.co/api/v1/sprite/" + ranNumber + "/",
            type: "GET",
            dataType: "jsonp",
            success: function(data) {
                pokeResponse = data;
                ene_name = data.pokemon.name;
                pokedex_id = data.id - 1;
                image = data.image;
                var spriteUrl = 'http://pokeapi.co/' + data.image;
                $('#enemy_pokemon').append("<div id='battle_mode' class='pokebox'><img class='pokemon' src=" +
                    spriteUrl + "/><div class='name'>" + ene_name + "</div></div>");
                pokemonData.push ({
                    pokedex_id: pokedex_id,
                    image: image,
                    name: name
                });
            }
        });
    });



    function show_my_condition() {
        $('#my_poke_energy').html('<p><b>My energy </b></p><p>' + myblood + '</p>');
    }

    function show_enemy_condition() {
        $('#enemy_poke_energy').html('<p><b>Enemy energy </b></p><p>' + enemyblood + '</p>');
    }

    var damage;
    var hit;
    var hit2 = "";

    function calculation() {
        var attack = Math.floor(Math.random() * 60 + 1); //attacker 1~60
        var defense = Math.floor(Math.random() * 30 + 1); //defender 1~30

        if (attack > defense) {
            damage = attack - defense;
            hit = "Attack! resulted in " + damage + " damage!";
            hit2 = "";
            if (damage > 30) {
                hit2 = " great hit!";
            }
        } else {
            damage = 0;
            hit = "Fails! defender evaded!";
            hit2 = "";
        }
    }




    $('#attack').on('click', function () {
        $('#condition_myP').html("");
        $('#discription').html("");
        calculation();
        $('#discription').append("<p><b>Your turn:</b> " + hit + hit2 + "</p>");
        $('#condition_enP').html("- " + damage);
        enemyblood -= damage;
        setTimeout("$('#battle_my_icon').show();", 200);
        setTimeout("$('#battle_my_icon').hide();", 1500);
        if (enemyblood <= 0) {
            var say = function () {
                $('#discription').append('<p><b>You win</b></p>');
            };
            setTimeout(say, 2000);
            enemyblood = 0;
            show_enemy_condition();
            battle_win();
        } else {
            show_enemy_condition();
            calculation();
            var say2 = function () {
                $('#discription').append('<p><b>Enemy turn:</b> ' + hit + hit2 + '</p>');
                $('#condition_enP').html("");
                $('#condition_myP').html("- " + damage);
                show_my_condition();
            };
            setTimeout(say2, 2000);
            setTimeout("$('#battle_enemy_icon').show();", 2000);
            setTimeout("$('#battle_enemy_icon').hide();", 3500);
            myblood -= damage;
            if (myblood <= 0) {
                var say3 = function () {
                    $('#discription').append('<p><b>Enemy win</b></p>');
                };
                setTimeout(say3, 4000);
                myblood = 0;
                battle_lose();
            }
        }
    });

    function battle_lose() {
        $('#attack').hide();
        $('#after_battle_lose').show();
    }

    function battle_win() {
        $('#attack').hide();
        $('#after_battle_win').show();
    }

    function after_clean() {
        myblood = 100;
        enemyblood = 100;
        $('#my_poke_energy').html("");
        $('#enemy_poke_energy').html("");
        $('#my_pokemon').html("");
        $('#condition_myP').html("");
        $('#condition_enP').html("");
        $('#enemy_pokemon').html("");
        $('#after_battle_lose').hide();
        $('#enemy_choice').show();
        $('#battle_team').show();
    }

    $('#after_battle_lose').on('click', function () {
        after_clean();
        $('#discription').html("<h3>Enemy runs away~~such a pity</h3>");

    });

    $('#catch_no').on('click', function () {
        after_clean();
        $('#discription').html("<h2>Enemy fleds~~</h2>" +
            "<b><p>Let's find another one.</p></b>");
        $('#after_battle_win').hide();
    });

    $('#catch_yes').on('click', function () {
        after_clean();
        $('#after_battle_win').hide();
        $('#discription').html("<h2>You just catched a new pokemon!</h2>");

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
            data: pokemo,
            success: function(data) {
                console.log("ajax success");
                $('#enemy_pokemon').append("<div id='battle_mode' class='pokebox'><img class='pokemon' src=" +
                    spriteUrl + "/><div class='name'>" + name + "</div></div>");
            }
        });
    });
});
