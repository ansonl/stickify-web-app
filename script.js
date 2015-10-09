var lastValues = {};

var userLoggedIn = false;

function showProgressBar() {
    var progressCode = '<div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"><span class="sr-only">Getting Stickies</span></div></div>';
	$('.loadingDiv').html(progressCode);
	$('.loadingDiv').fadeTo(500, 1);
}

function hideProgressBar() {
    $('.loadingDiv').fadeTo(500, 0);
}

function disableInputs() {
	$('#formDiv').fadeTo(500, 0.8);
	$('input').prop('disabled', true);
}

function enableInputs() {
	$('#formDiv').fadeTo(500, 1);
	$('input').prop('disabled', false);
	$('.loadingDiv').html('')
}

function submitInput(event) {
    console.log('test')
    
    if (!userLoggedIn)
	    disableInputs();
	showProgressBar();

	var request = $.ajax({
	  method: "POST",
	  url: "https://stickify.herokuapp.com/getUser",
	  data: { user: $('#nickname').val(), passcode: $('#pin').val()}
	})
	request.done(function( msg ) {
		if (msg.substring(0,1) == "1") {

			var errorText = '<div class="errorSpan centerHorizSpan">Server provided error: <blockquote>' + msg.substring(2,msg.length) + '</blockquote></div>'

			$('#results').html(errorText);
			enableInputs();
			return;
		}

		var parsed;
		var outputList = '<div>'
		try {
			parsed = JSON.parse(msg)
		} catch (e) {
			var errorText = '<div class="errorSpan centerHorizSpan">Server provided error: <blockquote>' + msg.substring(2,msg.length) + '</blockquote></div>'

			outputList += errorText;

			$('#results').html(errorText);
		}

    for (var i = 0; i < parsed.length; i++) {
    	//golang iotuil.ReadFile issue with % characters
    	//if (i % 3 == 0) {
    	if (i - Math.floor(i / 3) * 3 == 0) {
    		if (i > 0) {
    			//outputList += '<div id="sideDivRight" class="col-sm-3"></div></div>';
    			outputList += '</div>';
    		}
    		//outputList += '<div class="container"><div id="sideDivLeft" class="col-sm-3"></div>';
    		outputList += '<div class="container-fluid">';
    	}

    	var colSize = 6;

    	if (i + 2 < parsed.length) {
    		colSize = 4;
    	} else {
    		//golang iotuil.ReadFile issue with % characters
    		//colSize = 6 / (parsed.length % 3);
    		colSize = 12 / ((parsed.length - Math.floor(parsed.length / 3) * 3) == 0) ? 4:(parsed.length - Math.floor(parsed.length / 3) * 3);

    	}

    	outputList += '<div class="col-sm-'  + colSize + '"><div id="noteDiv">' + '<ul>'

    	for (var j = 0; j < parsed[i].length; j++) {
    		if (parsed[i][j].length > 0)
    			outputList += '<li>' + parsed[i][j] + '</li>'
    	}

    	outputList += '</ul></div></div>'

    }

    //outputList += '<div id="sideDivRight" class="col-sm-3"></div></div>';
    outputList += '</div>';

    if (!userLoggedIn) {
        $('#formDiv').fadeOut(500, function () {
            hideProgressBar();
    	    $('#results').html(outputList);
        });
    } else {
        hideProgressBar();
        $('#results').html(outputList);
    }
    

    userLoggedIn = true;
    
    setTimeout(submitInput, 9000);

  });
	request.fail(function( jqXHR, textStatus ) {
	  $('#results').html('Request failed with reason ' + textStatus);
	  enableInputs();
	});

	return false
}
var something = submitInput
$(document).ready(function() {
	
	$('#results').html('');

	$('#userInfoForm').submit(something);
});

