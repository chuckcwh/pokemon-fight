$(document).ready(function() {
var myblood = 100;
var enemyblood = 100;
var enemy_pokemonData;
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
        $('#my_choice').show();
        $('#my_choice').html("<p><i>Are you sure?</i></p><button class='btn btn-success' id='yes'>Yes</button>" +
            "<button class='btn btn-success' id='no'>No</button>");
        pokeName = $(this).find('div.name').text();
        spriteUrl = $(this).find('img').attr('src');
        $('#my_pokemon').html("<div class='pokebox'><img class='pokemon' id='my_battle_mode' src=" +
            spriteUrl + "/></div>");
        $('#battle_team').hide();
        show_my_condition();
    });

    $(document).on('click', '#no', function(){
        $('#my_choice').html("please select again <span class='glyphicon glyphicon-circle-arrow-right'></span>");
        $('#battle_team').show();
    });

    $(document).on('click', '#yes', function(){
        $('#my_choice').html("please select again <span class='glyphicon glyphicon-circle-arrow-right'></span>");
        $('#my_choice').hide();
        if ($('#enemy_choice').is(":visible") != true){
            $('#attack').show();
            $('#all').hide();
        }
    });

    //battle system - enemy pokemon
    $('#enemy_choice').on('click', function() {
        show_enemy_condition();
        $('#discription').html("");
        $('#enemy_choice').hide();
        if ($('#my_choice').is(":visible") != true){
            if ($('#battle_team').is(":visible") != true) {
                $('#attack').show();
                $('#all').hide();
            }
        }

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
                var spriteUrl = 'http://pokeapi.co/' + image;
                $('#enemy_pokemon').append("<div class='pokebox'><img id='enemy_battle_mode' class='pokemon' src=" +
                    spriteUrl + "/><div class='name'>" + name + "</div></div>");
                enemy_pokemonData= {
                    pokedex_id: pokedex_id,
                    image: image,
                    name: name,
                    team: teamName
                };
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
        setTimeout("$('#battle_my_icon').show();", 100);
        setTimeout("$('#battle_my_icon').hide();", 750);
        if (enemyblood <= 0) {
            var say = function () {
                $('#discription').append('<p><b>You win</b></p>');
            };
            setTimeout(say, 1000);
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
            setTimeout(say2, 1000);
            setTimeout("$('#battle_enemy_icon').show();", 1000);
            setTimeout("$('#battle_enemy_icon').hide();", 1750);
            myblood -= damage;
            if (myblood <= 0) {
                var say3 = function () {
                    $('#discription').append('<p><b>Enemy win</b></p>');
                };
                setTimeout(say3, 2000);
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
        $('#all').show();
    }

    $('#after_battle_lose').on('click', function () {
        after_clean();
        $('#discription').html("<h3>Enemy runs away~~such a pity</h3><p>Try again?</p>");

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
        pokemo = JSON.stringify(enemy_pokemonData);
        var spriteUrl = 'http://pokeapi.co/' + enemy_pokemonData['image'];
        teamMember = $('#battle_team div').length / 3;
        if (teamMember < 6) {
            $('#discription').html("<h2>You just catched a new pokemon!</h2>");
            $('#battle_team').append("<div class='pokebox'><img class='f_pokemon' src=" + spriteUrl + "/><div class='name'>" + enemy_pokemonData['name'] + "</div><div class='pokedex_id'>" +
                    enemy_pokemonData['pokedex_id'] + "</div></div>");
        } else {
            $('#discription').html("<h2>Team member is full!</h2><p>You can't catch it...</p><p>Please arrange your team</p>");
        }

        $.ajax({
            url: '/beat_and_catch/',
            type: 'POST',
            dataType: 'json',
            data: pokemo
        });
    });
});
