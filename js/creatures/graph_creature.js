GraphCreature = function(individual) {
	
	Creature.apply( this, arguments );
	
	this.dna = individual.dna;
	
	this.numWidthGenes = individual.numWidthGenes;
	this.lengthGeneStart = individual.lengthGeneStart;
	this.jointOffsetGeneStart = individual.jointOffsetGeneStart;
	this.jointSpeedGeneStart = individual.jointSpeedGeneStart;
	this.wormWidth = individual.wormWidth;
	
	this.speed = this.dna[this.jointSpeedGeneStart+i];
	
	var angle = (Math.PI * 2)/numSegments;
	var segmentLength = 500/numSegments;
	var segmentWidth = this.wormWidth;
	var apothem = segmentLength/(2 * Math.tan(Math.PI/numSegments));
	
	var colorMultiplier = 255/lengthMax;
	this.color = utilities.RGBtoHex((this.dna[this.lengthGeneStart] * colorMultiplier), (this.dna[this.lengthGeneStart+1] * colorMultiplier), (this.dna[this.jointOffsetGeneStart-1] * colorMultiplier));
	
	for (var i=0; i<numSegments; i++) {	
		
		var lengthVectorX = Math.cos(angle*i - Math.PI/2) * (segmentLength);
		var lengthVectorY = Math.sin(angle*i - Math.PI/2) * (segmentLength);
				
		var widthVectorX = Math.cos(angle*i - Math.PI) * (segmentWidth);
		var widthVectorY = Math.sin(angle*i - Math.PI) * (segmentWidth);
		
		var positionX = Math.cos(angle*i) * (apothem + segmentWidth/2) - lengthVectorX/2 + 300;
		var positionY = Math.sin(angle*i) * (apothem + segmentWidth/2) - lengthVectorY/2 + groundHeight - 100;
		
		
		
		this.segments[i] = utilities.createPoly(positionX, positionY, 
									[[0, 0], 
									[widthVectorX, widthVectorY], 
									[widthVectorX + lengthVectorX, widthVectorY + lengthVectorY], 
									[lengthVectorX, lengthVectorY]], false, this.color, -1);
									
		var jointX = positionX + lengthVectorX + widthVectorX/2;
		var jointY = positionY + lengthVectorY + widthVectorY/2;
		
		if (i > 0) {				
			this.joints[i] = utilities.createJoint(this.segments[i-1], this.segments[i], jointX, jointY);
		} 
		
		if (i == numSegments - 1) {
			jointX = positionX + widthVectorX/2;
			jointY = positionY + widthVectorY/2;
			
			this.joints[0] = utilities.createJoint(this.segments[i], this.segments[0], jointX, jointY);
		}
		

	}
	
	this.draw = function(context, renderType) {
		
		//this.drawTail(creature.segments[0].GetShapeList(), context);
		
		for (var i = 0; i < numSegments-1; i++) {	
			draw.drawSegment(this.segments[i].GetShapeList(), this.wormWidth, context, renderType);	
		}
		draw.drawSegment(this.segments[numSegments-1].GetShapeList(), this.wormWidth, context, renderType);
		
		for (var i = 0; i < numSegments-1; i++) {	
			//this.drawJoint([creature.segments[i].GetShapeList(), creature.segments[i+1].GetShapeList()], context);
		}
		
		//this.drawHead(creature.segments[numSegments-1].GetShapeList(), context);
		
	};
	
	this.body = this.segments[Math.floor(numSegments/2)];
	
	

};

RingCreature.prototype = new Creature();
