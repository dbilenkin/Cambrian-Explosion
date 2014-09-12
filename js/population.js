Population = Class.create({

	initialize : function(popSize, world) {
		
		this.world = world;
		//position variables
		this.xChange = 0;
		this.yChange = 0;
		
		this.popSize = popSize;
		this.genCount = 0;
		this.individuals = [];
		this.previousIndividuals = [];
		this.previousIndividualsSize = 5;
		
		this.concurrentCreatures = s.concurrentCreatures;
		this.creatureGroup = 0;
		this.creatureGroupCount = 0;
		this.currentCreatures = [];
		this.creatureCount = 0;
		
		this.currentDistanceChange = 0;
		this.individualCount = 0;
		
		this.currentFittest = 0;
		this.goLeft = false;
	
		var original;
		if (s.seedDNA) {
			original = this.createIndividual(s.seedDNA);
		} else {
			original = this.createIndividual();
		}
		
		for (var i=0;i<this.popSize;i++) {
			if (s.useIdenticals) {				
				this.individuals.push(Object.clone(original));
			} else {
				this.individuals.push(this.createIndividual());
			}
		}
	},
	
	startGenerations : function() {
		
		this.individualCount = 0;
		
		this.creatureCount = c.popSize;
		this.creatureGroupCount = this.concurrentCreatures;
		this.creatureGroup = 0;
		
		this.createCurrentCreatures();
	
		//World.testCreature();
		
		
	},
	
	createCurrentCreatures : function() {
		var individuals = this.individuals;
		var startCreature = c.popSize - this.creatureCount;
		var endCreature = Math.min(individuals.length, this.popSize - this.creatureCount + this.concurrentCreatures);
		for (var i = startCreature; i < endCreature; i++) {
			this.currentCreatures[i] = Creature.createCreature(individuals[i], this.world);
			this.currentCreatures[i].startStep = c.steps;
		
		}
	
	},
	
	runGenerations : function() {
		var currentGen = this.genCount;
		var currentGroup = this.creatureGroup;
		var startCreature = Math.max(0, c.popSize - this.creatureCount - this.concurrentCreatures);
		var endCreature = Math.min(this.currentCreatures.length, this.popSize - this.creatureCount + this.concurrentCreatures);
		for (var i = startCreature; i < endCreature; i++) {
			if (currentGen != this.genCount || currentGroup != this.creatureGroup) break;
			this.individualCount = i;
			if (this.currentCreatures[i])
				this.runCreatureGenerations();
		}
	},
	
	runCreatureGenerations : function() {
		var currentCreatures = this.currentCreatures;
		var individualCount = this.individualCount;

		var checkpoint = c.minStepsPerCreature * s.lengthMax * 
			Math.pow(1.1,currentCreatures[individualCount].stepInterval)/500;
		if (currentCreatures[individualCount].checkpointDistanceChange() <  checkpoint || 
				currentCreatures[individualCount].startStep + c.maxStepsPerCreature < c.steps) {
			
			var currentFitness = 0;
			currentCreatures[individualCount].distanceTraveled = currentCreatures[individualCount].distanceChange();
			
			if (!currentCreatures[individualCount].flippedUpsideDown()) {
				if (this.goLeft) {
					currentFitness = currentCreatures[individualCount].distanceTraveled;	
				}
				
			} 
			
			this.individuals[individualCount].fitness  = currentFitness;
			v.logField.innerHTML += "<a href='#' onclick='v.showDNA(true,"+individualCount+");return false'>Creature " + individualCount + " fitness: " + 
				Math.floor(currentFitness) + "</a></br>";
	
			currentCreatures[individualCount].destroy(this.world.world);	
			currentCreatures[individualCount] = null;
			this.creatureCount--;
			this.creatureGroupCount--;
	
			if (this.creatureGroupCount == 0 || this.creatureCount == 0) {
				
				if (this.creatureCount == 0) {
					var fittest = Math.floor(this.getFittest().fitness);
					var average = Math.floor(this.getAverageFitness());
					
					v.graph.update(this.genCount,fittest, average);
					
					v.generationLogField.value += "\r\nGen. " + this.genCount + ": Fittest: " + fittest + ", Average: " + average;
					
					this.breed();
					this.individualCount = 0;
					
					this.updateLog();
					
					this.creatureCount = this.popSize;
					
					v.checkFinishGenerationText();
					
				} else {					
					this.creatureGroup++;				
				}
				
				if (v.drawStep == false) {
					this.concurrentCreatures = this.popSize;
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
	
	destroy : function() {
		this.individuals = null;
	},
	
	createIndividual : function(dna1, dna2) {
		if (s.creatureType == "star") {
			return new StarIndividual(dna1, dna2);
		} else if (s.creatureType == "quadruped"){
			return new QuadrupedIndividual(dna1, dna2);
		} else {
			return new SegmentedIndividual(dna1, dna2);
		}
	},
	
	updateLog : function() {
		
		v.logField.innerHTML = "Previous Generations' Fittest:</br>";
		for (var i=0, len = this.previousIndividuals.length; i < len; i++)
			v.logField.innerHTML += "<a href='#' onclick='v.showDNA(false,"+i+");return false'>Generation " + (this.genCount - this.previousIndividuals.length + i) + " fittest: " + 
			Math.floor(this.previousIndividuals[i].fitness) + "</a></br>";
			
		v.logField.innerHTML += "</br>Current Gen. " + this.genCount + ":</br>";
	},
	
	getAverageFitness : function() {
		var totalFitness = 0;
		var length = this.individuals.length;
		for(var i=0; i<length; i++) {
			totalFitness += this.individuals[i].fitness;
		}
		
		return totalFitness/length;
			
	},
	
	getFittest : function() {
		return this.individuals.sort(
			function(a, b) {
				return b.fitness - a.fitness;
			}
		)[0];
	},
	
	breed : function() {
		
		this.genCount++;

		this.individuals.sort(
			function(a, b) {
				return b.fitness - a.fitness;
			}
		);
		
		this.previousIndividuals.push(this.individuals[0]);
		
		if (this.previousIndividuals.length > this.previousIndividualsSize) {
			this.previousIndividuals.shift();
		}
		
		var offspring = [];
		
		if (s.selectionType == "elite") {

			var numBestParents = Math.floor(this.individuals.length * s.parentCutoff);
			var numChildren = Math.ceil(1 / s.parentCutoff);
			if (!s.killParents) {
				numChildren--;
			}
	
			for (var i=0;i<numBestParents;i++) {
				var dna = this.individuals[i].dna;
				for (var j=0;j<numChildren;j++) {
					var rndIndividual = i;
					while (rndIndividual == i)
						rndIndividual = (Math.random() * numBestParents)>>0;
	
					offspring.push(
						this.createIndividual(dna, this.individuals[rndIndividual].dna)
					);
				}
			}
			
			if (s.killParents) {
				this.individuals = offspring;
			} else {
				this.individuals.length = numBestParents;
				this.individuals = this.individuals.concat(offspring);
			}	
		} else if (s.selectionType == "roulette") {
			
			var sumFitness = 0;
			var worstFitness = this.individuals[this.individuals.length-1].fitness;
			for (var i=0, len = this.individuals.length; i < len;i++) {
				//normalize
				sumFitness+=(this.individuals[i].fitness - worstFitness);
			}
			
			for (var i=0, len = this.individuals.length;i<len;i++) {
				var parent1dna;
				var rndFitness1 = Math.random() * sumFitness;
				var rouletteFitness = 0;
				for (var j=this.individuals.length-1;j>=0;j--) {
					rouletteFitness += this.individuals[j].fitness - worstFitness;
					if (rouletteFitness > rndFitness1) {
						parent1dna = this.individuals[j].dna;
						break;
					}
					
				}
				
				var parent2dna;
				var rndFitness2 = Math.random() * sumFitness;
				rouletteFitness = 0;
				for (var k=this.individuals.length-1;k>=0;k--) {
					rouletteFitness += this.individuals[k].fitness - worstFitness;
					if (rouletteFitness > rndFitness2) {
						parent2dna = this.individuals[k].dna;
						break;
					}
					
				}
			
				offspring.push(this.createIndividual(parent1dna, parent2dna));
			}
			
			this.individuals = offspring;
		
		}

	}
});

