
app.controller("levelController", function($scope, $timeout, $interval) {
    var audioContext = null;
    var meter = null;
    $scope.sensitivity = 1;
    $scope.opacity = 1;
    $scope.level = 0;
    $scope.move = 0;

    function startup() {
	var el = document.getElementsByTagName("page")[0];
	// el.addEventListener("touchstart", handleStart, false);
	// el.addEventListener("touchend", handleEnd, false);
	// el.addEventListener("touchcancel", handleCancel, false);
	// el.addEventListener("touchleave", handleLeave, false);
	el.addEventListener("touchmove", handleMove, false);
    }

    function handleMove(evt) {
	evt.preventDefault();
	var touches = evt.changedTouches;
	
	for (var i=0; i<touches.length; i++) {
	    var idx = ongoingTouchIndexById(touches[i].identifier);

	    $scope.move = ongoingTouches[idx].pageY-touches[i].pageY;
	    ongoingTouches.splice(idx, 1, touches[i]);  // mettre à jour la liste des touchers
	}
    }

    document.onkeydown = function(e) {
	$scope.opacity = 1;
	switch (e.keyCode) {
        case 37:
	    $scope.sensitivity = 1;
            break;
        case 38:
            $scope.sensitivity += 1;	    
            break;
        case 40:
            $scope.sensitivity -= 1;
	    $scope.sensitivity = Math.max($scope.sensitivity, 1);
            break;
	}
	$timeout(function(){$scope.opacity = 0;}, 5000);
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
	var alpha = 0.3;
	$scope.level = $scope.level*alpha+(1-alpha)*meter.volume*$scope.sensitivity;
	$scope.logLevel = Math.max(0, 50+Math.ceil(20*Math.log10($scope.level)));
	$timeout(function(){update()}, 50);
    }
    
    $timeout(function(){$scope.opacity = 0;}, 5000);
   // update();
});
