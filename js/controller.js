Controller = {
	
	//position variables
	xChange : 0,
	yChange : 0,

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
	
	start : function() {
		
		//Initializes user settings
		Settings.initialize();
		View.initialize();
		World.create();
		
		this.started = true;
		this.concurrentCreatures = s.concurrentCreatures;
		this.creatureGroup = 0;
		this.creatureGroupCount = 0;
		this.currentCreatures = [];
		this.creatureCount = 0;
		
		this.currentDistanceChange = 0;
		this.individualCount = 0;
		
		this.currentFittest = 0;
	
		this.stepTimer = (new Date()).getTime();
		
		if (this.timer) clearTimeout(this.timer);
		
		
		this.population = new Population(this.popSize);
		
		this.startGenerations();

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
	
	startGenerations : function() {
		
		this.individualCount = 0;
		
		this.creatureCount = this.popSize;
		this.creatureGroupCount = this.concurrentCreatures;
		this.creatureGroup = 0;
		
		this.createCurrentCreatures();
	
		//World.testCreature();
		this.startTime = (new Date()).getTime();
		this.step();
		v.logResults();
		
	},
	
	createCurrentCreatures : function() {
		var individuals = this.population.individuals;
		var startCreature = this.population.popSize - this.creatureCount;
		var endCreature = Math.min(individuals.length, this.popSize - this.creatureCount + this.concurrentCreatures);
		for (var i = startCreature; i < endCreature; i++) {
			this.currentCreatures[i] = Creature.createCreature(individuals[i]);
			this.currentCreatures[i].startStep = this.steps;
		
		}
	
	},
	
	runGenerations : function() {
		var currentGen = c.population.genCount;
		var currentGroup = c.creatureGroup;
		var startCreature = Math.max(0, c.popSize - c.creatureCount - c.concurrentCreatures);
		var endCreature = Math.min(c.currentCreatures.length, c.population.popSize - c.creatureCount + c.concurrentCreatures);
		for (var i = startCreature; i < endCreature; i++) {
			if (currentGen != c.population.genCount || currentGroup != c.creatureGroup) break;
			c.individualCount = i;
			if (c.currentCreatures[i])
				c.runCreatureGenerations();
		}
	},
	
	runCreatureGenerations : function() {
		var currentCreatures = this.currentCreatures;
		var individualCount = this.individualCount;

		var checkpoint = this.minStepsPerCreature * s.lengthMax * 
			Math.pow(1.1,currentCreatures[individualCount].stepInterval)/500;
		if (currentCreatures[individualCount].checkpointDistanceChange() <  checkpoint || 
				currentCreatures[individualCount].startStep + this.maxStepsPerCreature < this.steps) {
			
			var currentFitness = 0;
			currentCreatures[individualCount].distanceTraveled = currentCreatures[individualCount].distanceChange();
			
			if (!currentCreatures[individualCount].flippedUpsideDown()) {
				currentFitness = currentCreatures[individualCount].distanceTraveled;	
			} 
			
			c.population.individuals[individualCount].fitness  = currentFitness;
			v.logField.innerHTML += "<a href='#' onclick='v.showDNA(true,"+individualCount+");return false'>Creature " + individualCount + " fitness: " + 
				Math.floor(currentFitness) + "</a></br>";
	
			currentCreatures[individualCount].destroy(w.world);	
			currentCreatures[individualCount] = null;
			this.creatureCount--;
			this.creatureGroupCount--;
	
			if (this.creatureGroupCount == 0 || this.creatureCount == 0) {
				
				if (this.creatureCount == 0) {
					var fittest = Math.floor(this.population.getFittest().fitness);
					var average = Math.floor(this.population.getAverageFitness());
					
					v.graph.update(this.population.genCount,fittest, average);
					
					v.generationLogField.value += "\r\nGen. " + this.population.genCount + ": Fittest: " + fittest + ", Average: " + average;
					
					this.population.breed();
					this.individualCount = 0;
					
					this.population.updateLog();
					
					this.creatureCount = this.population.popSize;
					
					v.checkFinishGenerationText();
					
				} else {					
					this.creatureGroup++;				
				}
				
				if (v.drawStep == false) {
					this.concurrentCreatures = this.population.popSize;
				} else {
					this.concurrentCreatures = s.concurrentCreatures;
				}
				

				this.createCurrentCreatures();
				this.xChange = 0;
				this.creatureGroupCount = this.concurrentCreatures;
			}
			
		} else {
			currentCreatures[individualCount].stepInterval++;
			currentCreatures[individualCount].distanceTraveled = currentCreatures[individualCount].distanceChange();
		}

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

		for (var i = 0, len = currentCreatures.length; i<len; i++)
			if(currentCreatures[i])
				currentCreatures[i].changeSpeed();
		

		
		w.world.Step(timeStep, iteration);
		
		
		var stepTimeout = 100 - c.speed;
		
		//var stepDrawFrequency = Math.ceil(60/c.stepsPerSecond);
		
		if (c.steps % c.stepDrawFrequency == 0) {
			if (v.drawStep) {
				
				v.drawWorld(currentCreatures);

			} else {
				stepTimeout = 0;
			}
		}
		
		c.stepCounter++;
		if (c.stepCounter == c.stepInterval) {
			c.timeElapsed = (new Date()).getTime() - c.stepTimer;
			c.stepsPerSecond = c.stepCounter/(c.timeElapsed/1000);
			c.stepCounter = 0;
			c.stepTimer = (new Date()).getTime();

		}		
		
		if (c.steps % c.minStepsPerCreature == 0) {
			setTimeout(c.runGenerations, 0);
		}
		
		c.timer = setTimeout(c.step, stepTimeout);
	}
		
		
};

//shortcut
c = Controller;
