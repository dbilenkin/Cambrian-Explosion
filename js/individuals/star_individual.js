StarIndividual = Class.create(SegmentedIndividual, {
	
	initialize : function($super, parDna1, parDna2) {
	
		//calling Creature constructor
		$super(parDna1, parDna2);
		
		this.numStarBodyGenes = 4;
		this.starBodyGeneStart = this.dnaLength;
		this.starBodyGeneEnd = this.starBodyGeneStart + this.numStarBodyGenes;
		
		this.starBodySizeMin = 10;
		this.starBodySizeMax = 20;
		
		this.starBodySize = 0;
		
		if (!parDna1 || parDna2) {
			
			//set segment width
			for (var i=this.starBodyGeneStart; i<this.starBodyGeneEnd; i++) {	
				if (parDna1 && parDna2) {
					var val = (Math.random() > .5) ? parDna1[i] : parDna2[i];
					if (Math.random() < s.mutateChance) {			
						val += Math.random() * 2 * s.mutateAmount * val - s.mutateAmount * val;	
						val = Math.max(this.starBodySizeMin/this.numStarBodyGenes, Math.min(this.starBodySizeMax/this.numStarBodyGenes, val));
					}	
					this.dna[i] = val;
				} else {
					this.dna[i] = Math.random() * (this.starBodySizeMax/this.numStarBodyGenes - 
							this.starBodySizeMin/this.numStarBodyGenes) + 
							this.starBodySizeMin/this.numStarBodyGenes;
				}
			}
		}
		
		for (var i=this.starBodyGeneStart; i<this.starBodyGeneEnd; i++) {
			this.starBodySize += this.dna[i];
		}
	}

});