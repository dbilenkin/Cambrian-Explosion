SegmentedIndividual = Class.create(Individual, {
	
	numWidthGenes : 4,
	numWormSpeedGenes : 4,
	
	initialize : function($super, parDna1, parDna2) {
		
		//calling Creature constructor
		$super(parDna1, parDna2);
	
		this.wormWidth = 0;
		this.wormSpeed = 0;
		
		this.lengthGeneStart = this.numWidthGenes;
		this.jointOffsetGeneStart = this.lengthGeneStart + s.numSegments;
		this.jointRotationGeneStart = this.jointOffsetGeneStart + s.numSegments;
		this.wormSpeedGeneStart = this.jointRotationGeneStart + s.numSegments;
		this.dnaLength = this.wormSpeedGeneStart + this.numWormSpeedGenes;	
		
		//speed up performance by making local variables
		var lengthGeneStart = this.lengthGeneStart;
		var jointOffsetGeneStart = this.jointOffsetGeneStart;
		var jointRotationGeneStart = this.jointRotationGeneStart;
		var wormSpeedGeneStart = this.wormSpeedGeneStart;
		var dnaLength = this.dnaLength;	
		
		var numWidthGenes = this.numWidthGenes;
		var numWormSpeedGenes = this.numWormSpeedGenes;
	
		var mutateChance = s.mutateChance;
		var mutateAmount = s.mutateAmount;
		
		var maxStepsPerCreature = s.maxStepsPerCreature;
		var minStepsPerCreature = s.minStepsPerCreature;

		var minJointRotation = s.minJointRotation;
		var maxJointRotation = s.maxJointRotation;

		var minWormSpeed = s.minWormSpeed;
		var maxWormSpeed = s.maxWormSpeed;

		var widthMin = s.widthMin;
		var widthMax = s.widthMax;
		var lengthMin = s.lengthMin;
		var lengthMax = s.lengthMax;

		var numSegments = s.numSegments;
	
		//Seed with one dna
		if (parDna1 && !parDna2) {
			this.dna = parDna1;
		} else {
			
			//set segment width
			for (var i=0; i<numWidthGenes; i++) {	
				if (parDna1 && parDna2) {
					var val = (Math.random() > .5) ? parDna1[i] : parDna2[i];
					if (Math.random() < mutateChance) {			
						val += Math.random() * 2 * mutateAmount * val - mutateAmount * val;	
						val = Math.max(widthMin/numWidthGenes, Math.min(widthMax/numWidthGenes, val));
					}	
					this.dna[i] = val;
				} else {
					this.dna[i] = Math.random() * (widthMax/numWidthGenes - widthMin/numWidthGenes) + widthMin/numWidthGenes;
				}
			}
			
			//set segment length
			for (var i=lengthGeneStart; i<jointOffsetGeneStart; i++) {	
				if (parDna1 && parDna2) {
					var val = (Math.random() > .5) ? parDna1[i] : parDna2[i];
					if (Math.random() < mutateChance) {			
						val += Math.random() * 2 * mutateAmount * val - mutateAmount * val;	
						val = Math.max(lengthMin, Math.min(lengthMax, val));
					}		
					this.dna[i] = val;
				} else {
					this.dna[i] = Math.random() * (lengthMax - lengthMin) + lengthMin;
				}
			}
			
		
			//set joint offset
			for (var i=jointOffsetGeneStart; i < jointRotationGeneStart; i++) {	
				if (parDna1 && parDna2) {
					var val = (Math.random() > .5) ? parDna1[i] : parDna2[i];
					if (Math.random() < mutateChance) {			
						val += Math.random() * Math.PI * 4 * mutateAmount - Math.PI * 2 * mutateAmount;	
					}		
					this.dna[i] = val;
				} else {
					this.dna[i] = Math.random() * Math.PI * 2;
				}
			}
		
			
			//set joint rotation
			for (var i=jointRotationGeneStart; i<dnaLength; i++) {	
				if (parDna1 && parDna2) {
					var val = (Math.random() > .5) ? parDna1[i] : parDna2[i];
					if (Math.random() < mutateChance) {			
						val += Math.random() * 2 * mutateAmount - mutateAmount;
						val = Math.max(minJointRotation, Math.min(maxJointRotation, val));
					}		
					this.dna[i] = val;
				} else {
					this.dna[i] = Math.random() * (maxJointRotation - minJointRotation) + minJointRotation;
				}
			}
			
			//set worm speed
			for (var i=wormSpeedGeneStart; i<dnaLength; i++) {	
				if (parDna1 && parDna2) {
					var val = (Math.random() > .5) ? parDna1[i] : parDna2[i];
					if (Math.random() < mutateChance) {			
						val += Math.random() * 2 * mutateAmount - mutateAmount;
						val = Math.max(minWormSpeed, Math.min(maxWormSpeed, val));
					}		
					this.dna[i] = val;
				} else {
					this.dna[i] = Math.random() * (maxWormSpeed/numWormSpeedGenes - minWormSpeed/numWormSpeedGenes) + minWormSpeed/numWormSpeedGenes;
				}
			}
		}
		
		//set worm width
		this.wormWidth = this.dna[0]+this.dna[1]+this.dna[2]+this.dna[3];
		
		for (var i = wormSpeedGeneStart, len = dnaLength; i < len; i ++)
			this.wormSpeed += this.dna[i];
	}
});