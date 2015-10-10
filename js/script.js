var lastValues = {};

var userLoggedIn = false;

var updateTimeout;
var countdownTimeout;

function showContentProgressBar() {
    $('#contentProgressBar').removeClass('progress-bar-danger');
	$('#contentLoadingDiv').fadeTo(500, 1);
	$('#contentProgressBar').html('Updating Stickies');
}

function hideContentProgressBar() {
	$('#contentLoadingDiv').fadeTo(500, 0);
}

function showFormProgressBar() {
	$('#formLoadingDiv').fadeTo(500, 1);
	$('#formProgessBar').html('Getting Stickies');
}

function hideFormProgressBar() {
	$('#formLoadingDiv').fadeTo(500, 0);
}

function disableInputs() {
	$('#submit').focus();
	$('#formDiv').fadeTo(500, 0.8);
	$('input').prop('disabled', true);
}

function enableInputs() {
	$('#formDiv').fadeTo(500, 1);
	$('input').prop('disabled', false);
	$('.loadingDiv').html('')
}

function updateNotes() {
    
    if (userLoggedIn) {
        showContentProgressBar();
    }
    
	var request = $.ajax({
		method: "POST",
		url: "https://stickify.herokuapp.com/getUser",
		data: {
			user: $('#nickname').val(),
			passcode: $('#pin').val()
		}
	})
	request.done(function(msg) {
		if (msg.substring(0, 1) == "1") {

			var errorText = '<div class="errorSpan centerHorizSpan">Server provided error: <blockquote>' + msg.substring(2, msg.length) + '</blockquote></div>'

			$('#results').html(errorText);
			enableInputs();
			return;
		}

		var parsed;
		var outputList = '<div>'
		try {
			parsed = JSON.parse(msg)
		} catch (e) {
			var errorText = '<div class="errorSpan centerHorizSpan">Server provided error: <blockquote>' + msg.substring(2, msg.length) + '</blockquote></div>'

			outputList += errorText;

			$('#results').html(errorText);
		}

		for (var i = 0; i < parsed.length; i++) {
			//golang iotuil.ReadFile issue with % characters
			//if (i % 3 == 0) {
			if (i - Math.floor(i / 3) * 3 === 0) {
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
				colSize = 12 / ((parsed.length - Math.floor(parsed.length / 3) * 3) === 0) ? 4 : (parsed.length - Math.floor(parsed.length / 3) * 3);

			}

			outputList += '<div class="col-md-' + colSize + '"><div id="noteDiv">' + '<ul>'

			for (var j = 0; j < parsed[i].length; j++) {
				if (parsed[i][j].length > 0)
					outputList += '<li>' + parsed[i][j] + '</li>'
			}

			outputList += '</ul></div></div>'

		}

		//outputList += '<div id="sideDivRight" class="col-sm-3"></div></div>';
		outputList += '</div>';

        //update UI based on user logged in status
		if (!userLoggedIn) {
			$('#formDiv').fadeOut(500, function() {
				$('#results').html(outputList);
			});
			userLoggedIn = true;
		} else {
			hideContentProgressBar();
			$('#errorDiv').slideUp(200);
			$('#errorDiv').html('');
			$('#results').html(outputList);
			
		}
        clearTimeout(updateTimeout);
		updateTimeout = setTimeout(updateNotes, 9000);

	});
	request.fail(function(jqXHR, textStatus) {
	    if (!userLoggedIn) {
	        enableInputs();
	    }
		else {
		    var retryPeriod = 10;
		    $('#contentProgressBar').addClass('progress-bar-danger');
		    $('#contentProgressBar').html('Retrying in <span id="retryCountdown">60</span>s');
		    clearTimeout(countdownTimeout);
			countdown($('#retryCountdown'), retryPeriod, 1000);
		    
		    
		    $('#errorDiv').html('<div><p class="errorTitle">Stickify backend unreachable</p><p>We\'ll be right back.</p>Browser provided message<blockquote>' + textStatus + '</blockquote></div><button type="button" class="btn btn-primary" id="retryButton" onclick="updateNotes();">Retry Now</button>');
		    $('#errorDiv').slideDown(500);
		}
		
	    clearTimeout(updateTimeout);
		updateTimeout = setTimeout(function () {
		    $('#contentProgressBar').addClass('progress-bar-warning');
		    $('#contentProgressBar').html('Retrying');
		    updateNotes();
		}, retryPeriod * 1000);
		
	});
}

function countdown(element, number, period) {
	element.html(number);
	if (number > 0)
		countdownTimeout = setTimeout(function(){countdown(element, number - 1, period);}, period);
}

function submitInput(event) {
	if (!userLoggedIn)
		disableInputs();
	showFormProgressBar();

    updateNotes();

	return false
}
var something = submitInput
$(document).ready(function() {
    $('.loadingDiv').css('opacity', 0);

	$('#results').html('');

	$('#userInfoForm').submit(something);
	
	loadRemoteBackgroundImage();
});

function loadRemoteBackgroundImage() {
	//http://stackoverflow.com/questions/20035615/using-raw-image-data-from-ajax-request-for-data-uri
	var xmlHTTP = new XMLHttpRequest();
    xmlHTTP.open('GET','https://unsplash.it/1920/1080?random',true);
    xmlHTTP.responseType = 'arraybuffer';
    xmlHTTP.onload = function(e)
    {
        var arr = new Uint8Array(this.response);
        var raw = '';
        var i,j,subArray,chunk = 5000;
        for (i=0,j=arr.length; i<j; i+=chunk) {
           subArray = arr.subarray(i,i+chunk);
           raw += String.fromCharCode.apply(null, subArray);
        }
        var b64=btoa(raw);
        var dataURL="data:image/jpeg;base64,"+b64;
        
	    $('#imageBufferDiv').css("background-image", "url('" + dataURL + "')");
	    console.log('set');
        $('#imageBufferDiv').fadeTo(1000, 1);
    };
    xmlHTTP.send();
}