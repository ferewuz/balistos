/*global context_url, document, jQuery, Highcharts, console, alert */
/*jslint indent: 4, maxlen: 80 */

(function ($) {
    "use strict";


    $("#hide-player").click(function(){
        $(this).hide();
        $(".player").hide();
        player.destroy();
        $("#show-player").fadeIn();
    });
    $("#show-player").click(function(){
        $(this).hide();
        restorePlayer();
        $(".player").fadeIn();
        $("#hide-player").fadeIn();
    });
    $("#search-playlist").keyup(function(){
        $.ajax({
            type: "GET",
            url: "/search_playlists",
            dataType:"json",
            data:{
                "query":$(this).val()
            }
        }).done(function(data){
            if(data.length<1){
                $("#response-playlist").html('No results for this query...');
                $("#response-playlist").show();
            }
            else{
                $("#response-playlist").html("");
                $.each(data, function( index, value ) {
                    $("#response-playlist").append('<li><a href="/playlist/'+
                        value.uri+'">'+value.title+'</a></li>');
                });
                $("#response-playlist").show();
            }
        });
    });

    $("form#login-form").on("submit",function(event){
        event.preventDefault();
        if($(this).find("input[name='login-username']").val().length<5 ||
         $(this).find("input[name='login-password']").val().length<5){
            $("#login-message")
                .text("Your username or password is too short.")
                .fadeIn();
            setTimeout(function(){$("#login-message").fadeOut(1000);},2000);
        }
        else{
            $.ajax({
                type: "POST",
                url: "/login",
                dataType:"json",
                data:{
                    "login-username": $(this)
                        .find("input[name='login-username']").val(),
                    "login-password": hex_sha256($(this)
                        .find("input[name='login-password']").val())
                },
            }).done(function(response){
                if(response.error){
                    $("#login-message").text(response.error).show();
                    $("#login-form").find("input").val("");
                    setTimeout(function(){
                        $("#login-message").fadeOut(1000);
                    },2000);
                }
                else{
                    $("#username-string").text(response.success);
                    $(".not-logged-in").hide();
                    $("#hidden-search").hide();
                    $("#search").fadeIn(1000);
                    $(".logged-in").fadeIn(1000);
                }
            });
        }
        $("#login-form").find("input[type='password']").val("");
    });

    $("form#register-form").on("submit",function(event){
        event.preventDefault();
        if($(this).find("input[name='register-username']").val().length<5 ||
          $(this).find("input[name='register-password']").val().length<5){
            $("#register-message")
                .text("Your username or password is too short.")
                .show();
            setTimeout(function(){
                $("#register-message").fadeOut(1000);
            },2000);
        }
        else if(!validateEmail($(this).find("input[name='register-email']")
            .val())){
            $("#register-message")
                .text("You have entered invalid email adress.")
                .show();
            setTimeout(function(){
                $("#register-message").fadeOut(1000);
            },2000);
        }
        else{
            if($(this).find("input[name='register-password']").val()==
            $(this).find("input[name='register-repeat']").val()){
                $(this).find("input[name='register-repeat']").val("");
                $.ajax({
                    type: "POST",
                    url: "/register",
                    dataType:"json",
                    data:{
                        "register-username": $(this)
                            .find("input[name='register-username']").val(),
                        "register-password":
            hex_sha256($(this).find("input[name='register-password']").val()),
                        "register-email": $(this).
                            find("input[name='register-email']").val(),
                    },
                }).done(function(response){
                    if(response.error){
                        $("#login-message").text(response.error).show();
                        $("#login-form").find("input").val("");
                        setTimeout(function(){
                            $("#login-message").fadeOut(1000);
                        },2000);
                    }
                    else{
                        $("#username-string").text(response.success);
                        $(".not-logged-in").hide();
                        $("#hidden-search").hide();
                        $("#search").fadeIn(1000);
                        $(".logged-in").fadeIn(1000);
                    }
                });
            }
            else{
                $("#register-message")
                    .text("Your passwords don't match.")
                    .show();
                setTimeout(function(){
                    $("#register-message").fadeOut(1000);
                },2000);
            }
        }
        $("#register-form").find("input[type='password']").val("");
    });

    $("#chat-form").submit(function(){
        $.ajax({
            type: "POST",
            url: "/chat_message",
            dataType:"json",
            data: $(this).serialize(),
        }).done(function(response){});
        $(this).find("input").val("");
        return false;

    });


    function validateEmail(email){
        return /^.+@.+\..+$/.test(email);
    }
}(jQuery));
