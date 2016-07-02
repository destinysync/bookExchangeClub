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
    
    if (window.location.pathname == '/profile') {
        
        $.post('/getApprovedRequestCouint', function(data, status) {
            $('.badge').html(data);
        });
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
        $.post('/displayMyBooks', function(data, status) {
            $('#myBookContainer').append(data);
        })
    }

    var allBookContainer = JSON.stringify(document.getElementById('allBookContainer'))

    if (allBookContainer !== null) {
        $.get('/displayAllBooks', function(data, status) {
            $('#allBookContainer').append(data);
        })
    }

    // runFuncAfterFinishingTyping(2000, $("input[type='text']"), showSearchResult);

    runFuncAfterFinishingTyping(500, $(".addBookBox"), addBooks);

    // $('#signUpSubmit').click(function () {
    //     signInOrSignUp();
    // });


    $('#profileNav .profileTab').click(function() {

        var id = $(this).attr('id');

        if (id == 'requestsToMe') {
             $('#myBookContainer').html("");
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
            $.post('/requestsToMe', function(data, status) {
                $('#myBookContainer').html(data);
            });
        }
        else if (id == 'requestsToOthers') {
            var contentDivs = "<div class='col-lg-6' id='unapprovedRequests'><div class='row'><div class='col-lg-12'>Unapproved Requests</div></div></div><div class='col-lg-6' id='approvedRequests'><div class='row'><div class='col-lg-12'>Approved Requests</div></div></div>"
             $('#myBookContainer').html(contentDivs);
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
             $.post('/requestsToOthers', function(data, status) {
               
              $('#unapprovedRequests').append(data.unapproved);
              $('#approvedRequests').append(data.approved);
            });
        }
        else if (id == 'books') {
            $('#myBookContainer').html('');
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
            $.post('/displayMyBooks', function(data, status) {
                $('#myBookContainer').html(data);
            })
        }
        else if (id == 'profile') {
             $('#myBookContainer').html("");
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
            $.get('/getProfile', function(data, status) {
                $('#myBookContainer').html(data);
            })
        }
    })


$("body").on("click", "#passwordRestButton", function() {
     var input = $('#passwordResetForm').serialize();
     $.post('/changePassword/' + input, function(data, status) {
         
     })
 });
 
 
$("body").on("click", ".deleteButton", function() {
        var id = $(this).closest('.bookDiv').attr('id');

        var className = $(this).closest('.bookDiv').attr('class');
        className = className.match(/col-lg-2 bookDiv (.*)/)[1];
        
        var imgLink = $(this).closest('.bookContainerBG').siblings('.bookCover').attr('src');


        if (window.location.pathname == '/profile') {
            $(this).closest('.bookDiv').remove();
            $.post('/delMyBookFromDB/' + id, function(data, status) {});
        }
        else if (window.location.pathname == '/') {
            $.post('/isAuthenticated', function(data, status) {
                if (data.auth == 'true') {
                    $('#' + id).remove();
                    var url = '/sendTradeRequest/imgLink=' + imgLink + '&' + "bookID=" + id + "&" + "bookOwnerID=" + className;
                    $.post(url , function(data, status) {
                        
                    });
                }
                else {

                }
            });
        }
    });


$("body").on("click", ".deleteRequestToMeButton", function() {
    $(this).closest('.bookDiv').remove();
    var bookID = $(this).closest('.bookDiv').attr('id');
    $.post('/deleteRequestToMe/' + bookID, function(data, status) {
        
    })
    
});


$("body").on("click", ".delRequestsToOthersButton", function() {
    
     
    
    var bookID = $(this).closest('.bookDiv').attr('id');
    
    var className = $(this).closest('.bookDiv').attr('class');
        className = className.match(/col-lg-4 bookDiv (.*)/)[1];
 
        $(this).closest('.bookDiv').remove();

    $.post('/delRequestsToOthers/' + bookID + "&" + className , function(data, status) {
        
    })
    
});





$("body").on("click", ".approveRequestToMeButton", function() {
    
    var bookID = $(this).closest('.bookDiv').attr('id');
    
    // var className = $(this).closest('.bookDiv').attr('class');
    //     className = className.match(/col-lg-2 bookDiv (.*)/)[1];
 
    $(this).closest('.bookDiv').remove();

    $.post('/approveRequestToMe/' + bookID, function(data, status) {
        
    });
});








});
