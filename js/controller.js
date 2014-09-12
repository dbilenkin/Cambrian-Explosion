Controller = {

	//time and step variables
	timer : null,
	startTime : 0,
	totalTime : 0,
	paused : false,
	steps : 0,
	stepInterval : 10,
	stepsPerSecond : 60,
	stepCounter : 0,
	stepTimer : 0,	
	speed : 100,
	maxStepsPerCreature : 1000,
	minStepsPerCreature : 200,
	stepDrawFrequency : 1,
	started  : false,
	populations : [],
	worlds : [],
	split : false,
	
	start : function() {
		
		//Initializes user settings
		Settings.initialize();
		
		//World.create();
		var world = new World({gravity : 1000, canvasString : "canvas"});
		this.worlds.push(world);
		
		
		
		this.started = true;

		this.stepTimer = (new Date()).getTime();
		
		if (this.timer) clearTimeout(this.timer);
		
		
		
		world.populations[0].startGenerations();
		
		this.startTime = (new Date()).getTime();
		this.step();
		//world.view.logResults();

	},
	
	setBackground : function(background) {
		for (var i = 0; i < this.worlds.length; i++) {
			this.worlds[i].view.setBackground(background);
		}
			
	},
	
	splitPopulation : function() {
		c.split = true;
		
		var world = new World({gravity : 1000, canvasString : "canvas2"});
		this.worlds.push(world);
		
		$('canvas').height = 190;
		$('canvas2').style.display = 'block';
		
		this.worlds[0].view.splitAdjustment = -348/2;
		this.worlds[1].view.splitAdjustment = -348/2;
		//this.worlds[0].groundHeight = 348/2;
		world.populations[0].startGenerations();
		
	},
		
	testCreature : function() {
		numSegments = 8;
		var dna1 = [.5, .9, -.4, .1, -.34, -.6, .8, -.2, .5, .5, .9, -.4, .1, -.34, -.6, .8, -.2, .5, .1, -.2];
		var dna2 = dna1;
		var individual = new Individual(dna1, dna2)
		currentCreature = new Creature(individual);
		currentCreatureStartStep = this.steps;
		body = currentCreature.body;
		currentDistanceTraveled = 0;
	
	},
	
	
	
	
	
	pause : function() {
		if (!this.paused) {
			this.paused = true;
			clearTimeout(this.timer);
			clearTimeout(this.logTimer);
		}
	},
	
	slower : function() {
		this.play();
		this.speed = 80;
	},
	
	play : function() {
		this.speed = 92;
		this.stepDrawFrequency = 1;
		this.drawStep = true;
		
		if (!this.started) {
			this.start();
		} 
		
		if (this.paused) {
			this.paused = false;	
			this.step();
			v.logResults();		
		} 
		
		if (!v.drawStep) {
			v.setBackground(v.renderType);
		}
	},
	
	faster : function() {
		this.play();
		this.speed = 100;
		this.stepDrawFrequency = 3;
		
	},
	
	fastest : function() {
		if (this.drawStep) {
			this.play();
			v.setBackground("none");
			this.speed = 100;
		}
	},
	
	
	
	reset : function() {
		this.started = false;
		this.population.destroy();
		v.generationLogField.value = "";
		v.logField.innerHTML = "";
		this.play();
	
	},
		
		
	step : function() {
		
		var currentCreatures = c.currentCreatures;
		
		c.totalTime = (new Date()).getTime() - c.startTime;
		
		
		c.steps++;
		var stepping = false;
		var timeStep = 1.0/60;
		var iteration = 10;

		
		
		var numWorlds = c.worlds.length;
		
		var stepTimeout = 100 - c.speed;
		
		//var stepDrawFrequency = Math.ceil(60/c.stepsPerSecond);

		for (var i = 0; i < numWorlds; i++) {
			//For now there is just one population per world
			var population = c.worlds[i].populations[0];
			for (var j = 0, len = population.currentCreatures.length; j<len; j++) {
				if(population.currentCreatures[j])
					population.currentCreatures[j].changeSpeed(population);
			}

			c.worlds[i].world.Step(timeStep, iteration);
			
			if (c.steps % c.stepDrawFrequency == 0) {
				if (v.drawStep) {
					
					c.worlds[i].view.drawWorld(population.currentCreatures);

				} else {
					stepTimeout = 0;
				}
			}
			
			if (c.steps % c.minStepsPerCreature == 0) {
				c.worlds[i].populations[0].runGenerations();
				//setTimeout(function() {c.worlds[0].populations[0].runGenerations();}, 0);
			}
		}
		
		c.stepCounter++;
		if (c.stepCounter == c.stepInterval) {
			c.timeElapsed = (new Date()).getTime() - c.stepTimer;
			c.stepsPerSecond = c.stepCounter/(c.timeElapsed/1000);
			c.stepCounter = 0;
			c.stepTimer = (new Date()).getTime();

		}		
		
		
		
		c.timer = setTimeout(c.step, stepTimeout);
	}
		
		
};

//shortcut
c = Controller;
