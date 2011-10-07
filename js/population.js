Population = Class.create({

	initialize : function(popSize) {
		
		this.popSize =  popSize;
		this.genCount = 0;
		this.individuals = [];
		this.previousIndividuals = [];
		this.previousIndividualsSize = 5;
	
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
	
	
	
	destroy : function() {
		this.individuals = [];
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

