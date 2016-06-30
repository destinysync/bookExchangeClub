function signInOrSignUp() {
    var str = $("form").serialize();
    var email = decodeURIComponent(str.match(/username=(.*)&.*/)[1]);
    var pw = decodeURIComponent(str.match(/&password=(.*)/)[1]);
    if (email !== '' && pw !== '') {
        $.post('/signInOrSignUp/', function (data, status) {

        })
    }
}

function runFuncAfterFinishingTyping(delay, selector, func) {
    var typingTimer;
    var doneTypingInterval = delay;
    var $input = selector;
    // example: selector = $("input[type='text']")

    $input.on('keyup', function () {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(doneTyping, doneTypingInterval);
    });

    $input.on('keydown', function () {
        clearTimeout(typingTimer);
    });

    function doneTyping() {
        func();
    }
}

$(document).ready(function () {

    $('.signIconDiv').hover(function () {
        $('#Password').val("");
        $('#Email').val("");
    });

    function showSearchResult() {
        var str = $(".searchInputBox").serialize();
        var bbc = $('.searchInputBox').val();
        alert(str);
        // $('.searchInputBox').value("");
        $('.searchInputBox').val("");
        // str = str.match(/searchValue=(.*)/)[1];
        // str = str.split('+').join(' ');

        // $.post('/searchResult/' + str, function (data, status) {
        //     $('.searchResult').html(data);
        // });

        $.post('/addBooks/' + str, function (data, status) {

        });
    }
    
    function addBooks(){
        var str = $(".searchInputBox").serialize();
        str = decodeURIComponent(str.match(/addBookBox=(.*)&.*/)[1]);
        alert('addbook');
        $.post('/addBooks/' + str, function (data, status) {
            
        });
        
    }

    $.post('/changeLoginIcon', function (data, status) {
        $('.profileIconDiv').html(data);
    });
    
    runFuncAfterFinishingTyping(2000, $("input[type='text']"), showSearchResult);
    
    // runFuncAfterFinishingTyping(2000, $("input[type='text']"), addBooks);

    // $('#signUpSubmit').click(function () {
    //     signInOrSignUp();
    // });


    $(".container-fluid").on("click", ".going", function () {
        $.post('/iAmGoing/' + this.id, function (data, status) {
            $("#" + this.id).html(data + ' GOING');
        });
    });


});

