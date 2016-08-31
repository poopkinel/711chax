$(function() {
    // When we're using HTTPS, use WSS too.
    var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
    var chatsock = new ReconnectingWebSocket(ws_scheme + '://' + window.location.host + "/chat" + window.location.pathname);
    var messageRequirements = '';
    var otherSpoke = false;

    // Local Functions (static)

    // check I asked a question
    function checkMessageValidity(message) {
        if (message.indexOf(messageRequirements) >= 0){
            return true;
        }
        else {
            return false;
        }
    }

    function switchTalkMode(currentTalkingStick) {
        if (currentTalkingStick == false) {
            $("#button_entry").hide();
            $("#message_entry").show();
            messageRequirements = '';
            $("#message").val('').focus();
        }
        else {
            $("#button_entry").show();
            $("#message_entry").hide();
//            $("#message").val('').focus();
            talkingStick = false;
        }
    }

    // Handling Button Events

    $("#button_ok").click(switchTalkMode(otherSpoke));
    $("#button_question").click(switchTalkMode(otherSpoke));


    chatsock.onmessage = function(message) {
        var data = JSON.parse(message.data);
        var chat = $("#chat")
        var ele = $('<tr></tr>')

        ele.append(
            $("<td class=\"quiet\"></td>").text(data.timestamp)
        )
        ele.append(
            $("<td></td>").text(data.handle)
        )
        ele.append(
            $("<td></td>").text(data.message)
        )

        chat.append(ele)

//        if (data.handle != $("#handle").val()){
//            $("#message").val('got answer').focus();
//        }
//            otherSpoke = true;
//        }
//        else {
//            otherSpoke = false;
//            $("#handle").val('no answer yet').focus();
//        }

    };


    $("#chatform").on("submit", function(event) {
        var message = {
            handle: $('#handle').val(),
            message: $('#message').val(),
        }

        if (checkMessageValidity(message.message) == true){
            chatsock.send(JSON.stringify(message));
        }
        else {
            $("#chat").append(
                $("<tr><td></td></tr>").text("Please use a question.")
            )
        }

        $("#message").val('').focus();
        return false;
    });
});