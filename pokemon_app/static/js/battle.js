$(document).ready(function() {
    var myblood = 100;
    var enemyblood = 100;
    var myattack;
    var enemyattack;


    //battle system - my pokemon
    $('#my_choice').on('click', function() {
        console.log("hell ya");
        $.ajax({
            url: '/my_battle_pokemon/',
            type: "GET",
            dataType: "json",
            success: function(data) {
                console.log("yaaaa");
                name = data.name;
                pokedex_id = data.pokedex_id;
                image = data.image;
                var spriteUrl = 'http://pokeapi.co/' + image;
                $('#my_pokemon').html("<div class='pokebox'><img class='pokemon' src=" + spriteUrl + "/><div class='name'>" + name + "</div></div>");
            }
        });
    });

    //battle system - enemy pokemon
    $('#enemy_choice').on('click', function() {
        pokemonData = [];
        $('#enemy_pokemon').html("");
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
                $('#enemy_pokemon').append("<div class='pokebox'><img class='pokemon' src=" +
                    spriteUrl + "/><div class='name'>" + name + "</div></div>");
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


    $('#enemy_pokemon').on('click', function () {
        show_my_condition();
        show_enemy_condition();
        $('#enemy_pokemon').hide();
        $('#attack').show();
    });


    $('#attack').on('click', function () {
        $('#condition_myP').html("");
        $('#discription').html("");
        calculation();
        $('#discription').append("<p><b>Your turn:</b> " + hit + hit2 + "</p>");
        $('#condition_enP').html("- " + damage);
        enemyblood -= damage;
        setTimeout("$('#ani_pic').show();", 500);
        setTimeout("$('#ani_pic').hide();", 3000);
        if (enemyblood <= 0) {
            var say = function () {
                $('#discription').append('<p><b>You win</b></p>');
            };
            setTimeout(say, 2000);
            enemyblood = 0;
            show_enemy_condition();
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
            myblood -= damage;
            if (myblood <= 0) {
                var say3 = function () {
                    $('#discription').append('<p><b>Enemy win</b></p>');
                };
                setTimeout(say3, 4000);
                myblood = 0;
            }
        }
    })
});
