$(document).ready(function(){

//show the pokemon list
    $.ajax ({
        url: '/poke_lab_data/',
        type: "GET",
        dataType: "json",
        success:function(data) {
            userItem = 0;
            userAll = 0;
            for (i=0; i<data.length; i++) {
                name = data[i].name;
                image = data[i].image;
                pokedex_id = data[i].pokedex_id;
                color = data[i].color;
                if (color === "green"){
                    userItem ++;
                    userAll ++;
                } else {
                    userAll ++;
                }
                $('#Pokes').append("<div class='pokebox box_" + color + "'><img class='f_pokemon img_hover' src=" + image + "/><div class='name'>" + name + "</div><div class='id'>" +
                        pokedex_id + "</div></div>")
            }
            $('#yPoke').html(userItem);
            $('#aPoke').html(userAll);
        }
    });

// show the big pic
    $(document).on('mouseover', '.img_hover', function(){
        image =$(this).attr('src');
        fullUrl = "url('" + image + "')";
        $('#right_gif').css("background-image", fullUrl);
    });

    function rotateImage() {
           setInterval(autoimagerefresh, 3000);
       }

       var x = 0;
       function autoimagerefresh() {
           x++;
           var strImageUrl;
           var duration = "1"; //seconds
           var sponimage = new Array();
           sponimage[0] = "p1.gif";
           sponimage[1] = "p2.gif";
           sponimage[2] = "p3.gif";
           sponimage[3] = "p4.gif";
           sponimage[4] = "p5.gif";
           sponimage[5] = "p6.gif";

           if (x == sponimage.length)
               x = 0;
           $('sponsoredimg').src = "../../Content/Images/Sponsored/" + sponimage[x];
           $("sponsoredimglink").href = "";//this should be create array of links in above
       }

//        <li role="presentation"><a role="menuitem" tabindex="-1" href="#">Action</a></li>
//        <li role="presentation"><a role="menuitem" tabindex="-1" href="#">Another action</a></li>
//        <li role="presentation"><a role="menuitem" tabindex="-1" href="#">Something else here</a></li>
//        <li role="presentation" class="divider"></li>
//        <li role="presentation"><a role="menuitem" tabindex="-1" href="#">Separated link</a></li>



//    Delete function: Show user's team
    $('#dropdownMenu1').on('click', function() {
        $('.dropdown-menu').html("");
        $.ajax({
            url: '/team_for_delete/',
            type: "GET",
            dataType: "json",
            success: function(data) {
                for (i=0; i<data.length; i++) {
                    team = data[i].name;
                    $('.dropdown-menu').append('<li role="presentation"><a role="menuitem" tabindex="-1" class="poke_info">' + team + '</a></li>');
                }
            }
        });
    });



//    Delete function: Show team's pokemons of requested user
    $(document).on('click', '.poke_info', function(){
        var teamName = $(this).text();
        $('#delete_team').html("<br><button class='btn btn-danger del_team' val='" + teamName + "'>Kick the whole Team!</button>");
        var teamData = {team_name: teamName};
        $('#delete_poke').html("");
        $.ajax({
            url: '/pokemon_of_team/',
            type: "POST",
            dataType: "json",
            data: JSON.stringify(teamData),
            success: function(data) {
                $('#your_pokemons').html("");
                for (i=0; i<data.length; i++) {
                    name = data[i].name;
                    pokedex_id = data[i].pokedex_id;
                    image = data[i].image;
                    var spriteUrl = 'http://pokeapi.co/' + image;
                    $('#delete_poke').append("<div class='pokebox' val='" + teamName + "'><img class='f_pokemon delete' src=" + spriteUrl + "/><div class='name'>" + name + "</div></div>");
                }
                $('#delete_poke').append("<p style='color: #C0392B'>Or Select The One You Want To Delete</p>");
            }
        });
    });

//Delete function: display the delete check
    $(document).on('click', '.delete', function() {
        poke_del = $(this).next().text();
        team_del = $(this).parent().attr('val');
        $('#delete_poke_check').html("<button class='btn btn-danger delete_check' team_del='" + team_del + "' poke_del='" + poke_del + "'>Kick the pokemon!</button>");
    });

//Delete function: delete the select team
    $(document).on('click', '.del_team', function() {
        team_delcheck = $(this).attr('val');
        $.ajax({
            url: '/delete_team/',
            type: 'DELETE',
            dataType: "json",
            data: JSON.stringify(team_delcheck)
        });
        $('#delete_poke_check').append('<b>Remove success!</b>');
        window.location.href = "/pokemon_lab/";
    });


//Delete function: delete the select pokemon (with names of both pokemon and team!!!)
    $(document).on('click', '.delete_check', function() {
        poke_delcheck = $(this).attr('poke_del');
        team_delcheck = $(this).attr('team_del');
        del = [team_delcheck, poke_delcheck];
        $('#delete_poke_check').append('<b>Remove success!</b>');
        $.ajax ({
            url: '/delete_pokemon/',
            type: "DELETE",
            dataType: "json",
            data: JSON.stringify(del)
        });

        window.location.href = "/pokemon_lab/";

    })

});



