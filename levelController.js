
app.controller("levelController", function($scope, $timeout, $interval) {
    var audioContext = null;
    var meter = null;
    var sensitivity = 1;
    document.onkeydown = function(e) {
	switch (e.keyCode) {
        case 37:
	    sensitivity = 1;
            break;
        case 38:
            sensitivity += 1;	    
            break;
        case 40:
            sensitivity -= 1;
	    sensitivity = Math.max(sensitivity, 1);
            break;
	}
    };
    
    
    // monkeypatch Web Audio
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    
    // grab an audio context
    audioContext = new AudioContext();

    // Attempt to get audio input
    try {
        // monkeypatch getUserMedia
        navigator.getUserMedia = 
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia;

        // ask for an audio input
        navigator.getUserMedia(
            {
		"audio": {
                    "mandatory": {
			"googEchoCancellation": "false",
			"googAutoGainControl": "false",
			"googNoiseSuppression": "false",
			"googHighpassFilter": "false"
                    },
                    "optional": []
		},
            }, gotStream, didntGetStream);
    } catch (e) {
        alert('getUserMedia threw exception :' + e);
    }
    
    function didntGetStream() {
	alert('Stream generation failed.');
    }
    
    var mediaStreamSource = null;
    function gotStream(stream) {
	// Create an AudioNode from the stream.
	mediaStreamSource = audioContext.createMediaStreamSource(stream);

	// Create a new volume meter and connect it.
	meter = createAudioMeter(audioContext);
	mediaStreamSource.connect(meter);
	
	// kick off the visual updating
	update();
    }
    
    
    var update = function(){
	$scope.level = meter.volume*sensitivity;
	$scope.logLevel = Math.max(0, 50+Math.ceil(20*Math.log10($scope.level)));
	$timeout(function(){update()}, 50);
    }
    
   // update();
});
