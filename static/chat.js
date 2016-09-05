$(function() {
    // When we're using HTTPS, use WSS too.
    var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
    var chatsock = new ReconnectingWebSocket(ws_scheme + '://' + window.location.host + "/chat" + window.location.pathname);
//    var refsock = new ReconnectingWebSocket(ws_scheme + '://' + window.location.host + "/refer" + window.location.pathname);

    var messageRequirements = '';

    // Local Functions (static)

    function checkMessageValidity(message) {
        if (message.indexOf(messageRequirements) >= 0){
            return true;
        }
        else {
            return false;
        }
    }

    // When a new message is sent to the server
    chatsock.onmessage = function(message) {
        var data = JSON.parse(message.data);
//        $("#handle").val(Object.keys(data)).focus(); // DEBUG
        if (Object.keys(data) == ['timestamp', 'message', 'handle']){

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

            if (data.handle != $("#handle").val()){
                $("#message").val('got answer').focus(); // DEBUG
                // show buttons
                $("#button_entry").show();
                $("#message_entry").hide();
            }
        }

        // TODO - REQUIRES DEBUGGING
        if (Object.keys(data) == ['reference']) {
            // popup a reference was made
            $("#refer_popup").val('this room was referred to ' + data.reference)
            $("#refer_popup").show()
            setTimeout(function (){
                $("#refer_popup").hide()
            } ,5000);
        }
    };

    // Handling Button Events
    $("#button_ok").click(function() {
        $("#button_entry").hide();
        $("#message_entry").show();
        messageRequirements = '';
        $("#message").val('').focus();
    });

    $("#button_question").click(function() {
        $("#button_entry").hide();
        $("#message_entry").show();
        messageRequirements = '?';
        $("#message").val('').focus();
    });


    // Sending chat messages and references through the WebSocket
    $("#referform").on("submit", function(event) {
        var message = {
            reference: $("#referred_room").val(),
        }
        chatsock.send(JSON.stringify(message));
        return false;
    });


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