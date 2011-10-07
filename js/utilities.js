Timer = { 
	_data: {},
	
	start: function(key) {
		Timer._data[key] = new Date();
	},
	
	stop: function(key) { 
		var time = Timer._data[key]; 
		if (time) {
			Timer._data[key] = new Date() - time; 
		}
	},
	
	getTime: function(key) {
		return Timer._data[key];
	} 
};

utilities = {

	getGraphGeneration : function(number) {	
		if(number == 30 || number == 300 || number == 3000 || number == 30000 || number == 300000 || number == 3000000) {
			return Math.round(Math.log(number/3)/Math.log(10));
		} else {
			return -1;
		}
	},

	testPercentages : function(percent) {
		var n = 100;
		var factor = 1/(1-percent*percent);
		for (var j = 0; j < 100; j++) {
			if (j % 2 == 0) {
				n = (1 + percent) * factor * n;
			} else {
				n -= percent * n;
			}
		}

		
		return n;
	},
	
	testRndPercentages : function(percent) {
		
		var m =0;
		var factor = 1/(1-percent*percent);
		for (var i = 0; i < 10000; i++) {
			var n = 100;
			for (var j = 0; j < 100; j++) {
				var rnd = Math.random();
				n += rnd * 2 * n * percent - n * percent;
			}
			m += n;
		}

		
		return m/10000;
	},
	

	RGBtoHex : function(R,G,B) {
		return '#'+this.toHex(R)+this.toHex(G)+this.toHex(B);
	},
	
	toHex : function (N) {
		 if (N==null) return "00";
		 N=parseInt(N); 
		 if (N==0 || isNaN(N)) return "00";
		 
		 N=Math.max(0,N); 
		 N=Math.min(N,255); 
		 N=Math.round(N);
		 
		 return "0123456789ABCDEF".charAt((N-N%16)/16)
			  + "0123456789ABCDEF".charAt(N%16);
	},
	
	getPrettyTime : function(milliseconds) {
		
		var hours = Math.floor(milliseconds/(60*60*1000));
		var minutes = Math.floor((milliseconds - hours*60*60*1000)/(60*1000));
		var seconds =  Math.floor((milliseconds - hours*60*60*1000 - minutes*60*1000)/1000);
		if (seconds < 10) seconds = "0" + seconds;
		if (minutes < 10) minutes = "0" + minutes;
		
		return hours + ":" + minutes + ":" + seconds;
	
	},
	
	getFourierSeriesResult : function(x, coefficients) {
		var result = 0;
		for (var i=0; i<20; i++) {
			result += coefficients[i] * Math.sin((i+1) * x);
		}
	
		return result;
	}
	
	

};