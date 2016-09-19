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
        if (data.type == 'message'){
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
                // show buttons
                $("#button_entry").show();
                $("#message_entry").hide();
            }
        }

        else if (data.type == 'reference') {
            // popup a reference was made
            child = '<li class="popuptext" id="refer_popup">this room was referred to '+data.referred_room+'</li>'
            $("#popup").append(child);
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
    $("#button_refer").click(function() {
        var message = {
            type: 'reference',
            reference: $("#refer_entry").val(),
        }
        chatsock.send(JSON.stringify(message));
        return false;
    });


    $("#chatform").on("submit", function(event) {
        var message = {
            type: 'message',
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