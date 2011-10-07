Graph = function(w, h) {

		this.fittestData = [];
		this.maxFittest = 0;
		this.averageData = [];
		this.minAverage = 0;
		this.xCategories = [];
		
		this.graphGeneration = 0;
		
		myChart = new Highcharts.Chart({
				
				chart: {
					defaultSeriesType: 'spline',
					renderTo: 'graph',
					defaultSeriesType: 'line',
					marginRight: 130,
					marginBottom: 40,
					height: h,
					width: w
				},
				title: {
					text: 'Generation Fitness Over Time',
					x: -20 //center
				},
				subtitle: {
					text: 'sweet, sweet fitness',
					x: -20
				},
				xAxis: {
					title: {
						text: 'Generations'
					}
				},
				yAxis: {
					title: {
						text: 'Fitness'
					},
					plotLines: [{
						value: 0,
						width: 1,
						color: '#808080'
					}]
				},
				tooltip: {
					formatter: function() {
			                return '<b>'+ this.series.name +'</b><br/>'+
							this.x +': '+ this.y;
					}
				},
				legend: {
					layout: 'vertical',
					align: 'right',
					verticalAlign: 'top',
					x: -10,
					y: 100,
					borderWidth: 0
				},
				series: [{
					id: 'fittest',
					name: 'Fittest'
				}, {
					id: 'average',
					name: 'Average'
				}]
			});
			
		this.update = function(genCount,fittest, average) {
			
			this.fittestData.push(fittest);
			this.averageData.push(average);
			
			var currentGraphGen = utilities.getGraphGeneration(genCount);
			var magnitude = Math.pow(10, this.graphGeneration);
			
			if (currentGraphGen > 0) {
				this.graphGeneration = currentGraphGen;				
				magnitude = Math.pow(10, this.graphGeneration);
				
				var slimFittestData = [];
				var slimAverageData = [];
				
				var fitAverage = 0;
				var averageAverage = 0;
				
				for (var i = 0, len = this.fittestData.length; i < len; i++) {
				
					fitAverage += this.fittestData[i];
					averageAverage += this.averageData[i];
					
					if (i % magnitude == 0) {					
						slimFittestData.push([i,fitAverage/magnitude]);
						slimAverageData.push([i,averageAverage/magnitude]);
						
						fitAverage = 0;
						averageAverage = 0;
					}
				}
				
				myChart.get('fittest').setData(slimFittestData);
				myChart.get('average').setData(slimAverageData, true);
				
			} else if (genCount % magnitude == 0) {
				
				var fitAverage = 0;
				var averageAverage = 0;
				
				for (var i = genCount - magnitude + 1; i < genCount; i++) {
				
					fitAverage += this.fittestData[i];
					averageAverage += this.averageData[i];
				}
				
				fitAverage += fittest;
				averageAverage += average;
				
				myChart.get('fittest').addPoint([genCount, fitAverage/magnitude]);
				myChart.get('average').addPoint([genCount, averageAverage/magnitude], true);
			} 
		};
		
		this.showLatest = function(number) {
			
			var latestFittestData = [];
			var latestAverageData = [];
			
			var len = this.fittestData.length;
			var start = this.fittestData.length - number;
			
			for (var i = start; i < len; i++) {
				latestFittestData.push(this.fittestData[i]);
				latestAverageData.push(this.averageData[i]);
			}
				
			myChart.get('fittest').setData(latestFittestData);
			myChart.get('average').setData(latestAverageData, true);
		
		};

};