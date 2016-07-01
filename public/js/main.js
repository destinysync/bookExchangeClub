function signInOrSignUp() {
    var str = $("form").serialize();
    var email = decodeURIComponent(str.match(/username=(.*)&.*/)[1]);
    var pw = decodeURIComponent(str.match(/&password=(.*)/)[1]);
    if (email !== '' && pw !== '') {
        $.post('/signInOrSignUp/', function(data, status) {

        })
    }
}

function runFuncAfterFinishingTyping(delay, selector, func) {
    var typingTimer;
    var doneTypingInterval = delay;
    var $input = selector;
    // example: selector = $("input[type='text']")

    $input.on('keyup', function() {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(doneTyping, doneTypingInterval);
    });

    $input.on('keydown', function() {
        clearTimeout(typingTimer);
    });

    function doneTyping() {
        func();
    }
}

$(document).ready(function() {

    function showSearchResult() {
        // var str = $(".searchInputBox").serialize();
        alert('str');


        // $('.searchInputBox').val("");
        // $.post('/addBooks/' + str, function(data, status) {
        //     $('.container').append(data);
        // });
    }

    function addBooks() {
        var str = $(".searchInputBox").serialize();
        str = decodeURIComponent(str.match(/addBookBox=(.*)/)[1]);
        $.post('/addBooks/' + str, function(data, status) {
            $('.container').append(data);
        });
        $('.searchInputBox').val("");
    }

    $.post('/changeLoginIcon', function(data, status) {
        $('.profileIconDiv').html(data);
    });

var myBookContainer = JSON.stringify(document.getElementById('myBookContainer'));

if (myBookContainer !== null) {
    $.post('/displayMyBooks', function (data, status) {
        $('#myBookContainer').append(data);
    })
}

    // runFuncAfterFinishingTyping(2000, $("input[type='text']"), showSearchResult);

    runFuncAfterFinishingTyping(2000, $(".addBookBox"), addBooks);

    // $('#signUpSubmit').click(function () {
    //     signInOrSignUp();
    // });

















    $(".container-fluid").on("click", ".going", function() {
        $.post('/iAmGoing/' + this.id, function(data, status) {
            $("#" + this.id).html(data + ' GOING');
        });
    });


});
