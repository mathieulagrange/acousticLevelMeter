function createAnalyserMeter(audioContext,bufferSize,averaging) {
     
    var analyser = audioContext.createAnalyser();
    analyser.fftSize = bufferSize || 2048*4;
    analyser.averaging = averaging || 0.95;
    analyser.volume = 0;

    analyser.shutdown =
	function(){
	    this.disconnect();
	};
    
    analyser.getVolume = 
	function(){
	    var bufferLength = analyser.fftSize;
	    var buffer = new Float32Array(bufferLength);
	    var sum = 0;
	    var x;
	    
	    analyser.getFloatTimeDomainData(buffer);
	    // Do a root-mean-square on the samples: sum up the squares...
	    for (var i=0; i<bufferLength; i++) {
    		x = buffer[i];
    		sum += x * x;
	    }
	    // ... then take the square root of the sum.
	    var rms =  Math.sqrt(sum / bufferLength);
	    // Now smooth this out with the averaging factor applied
	    // to the previous sample - take the max here because we
	    // want "fast attack, slow release."
	    this.volume = Math.max(rms, this.volume*this.averaging);
	};
	return analyser;
}
