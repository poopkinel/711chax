$(function() {
    // When we're using HTTPS, use WSS too.
    var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
    var chatsock = new ReconnectingWebSocket(ws_scheme + '://' + window.location.host + "/chat" + window.location.pathname);

//    button handling function:
//    $("#chatform").on("load", function(event)) {
//        var chat = $("#chat")
//        var ele = $('<button type="button" id="go">ok</button><button type="button" id="go">?</button>')
//    }
    function checkMessageValidity(message) {
        if (message.indexOf("?") >= 0){
            return true;
        }
        else {
            return false;
        }
    }

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