RingCreature = Class.create(Creature, {
	
	initialize : function($super, individual) {
	
		//calling Creature constructor
		$super(individual);
		
		var angle = (Math.PI * 2)/s.numSegments;
		var segmentLength = 500/s.numSegments;
		var segmentWidth = this.wormWidth;
		var apothem = segmentLength/(2 * Math.tan(Math.PI/s.numSegments));
		
		var colorMultiplier = 255/s.lengthMax;
		this.color = utilities.RGBtoHex((this.dna[this.lengthGeneStart] * colorMultiplier), 
				(this.dna[this.lengthGeneStart+1] * colorMultiplier), 
				(this.dna[this.jointOffsetGeneStart-1] * colorMultiplier));
		
		for (var i=0; i<s.numSegments; i++) {	
			
			var lengthVectorX = Math.cos(angle*i - Math.PI/2) * (segmentLength);
			var lengthVectorY = Math.sin(angle*i - Math.PI/2) * (segmentLength);
					
			var widthVectorX = Math.cos(angle*i - Math.PI) * (segmentWidth);
			var widthVectorY = Math.sin(angle*i - Math.PI) * (segmentWidth);
			
			var positionX = Math.cos(angle*i) * (apothem + segmentWidth/2) - lengthVectorX/2 + 300;
			var positionY = Math.sin(angle*i) * (apothem + segmentWidth/2) - lengthVectorY/2 + w.groundHeight - 100;
			
			
			
			this.segments[i] = w.createPoly(positionX, positionY, 
										[[0, 0], 
										[widthVectorX, widthVectorY], 
										[widthVectorX + lengthVectorX, widthVectorY + lengthVectorY], 
										[lengthVectorX, lengthVectorY]], false, this.color, -1, 1);
										
			var jointX = positionX + lengthVectorX + widthVectorX/2;
			var jointY = positionY + lengthVectorY + widthVectorY/2;
			
			if (i > 0) {				
				this.joints[i] = w.createJoint({
					part1 : this.segments[i-1], 
					part2 : this.segments[i], 
					x : jointX, 
					y : jointY, 
					enableMotor : true
				});
			} 
			
			if (i == s.numSegments - 1) {
				jointX = positionX + widthVectorX/2;
				jointY = positionY + widthVectorY/2;
				
				this.joints[0] = w.createJoint({
					part1 : this.segments[i], 
					part2 : this.segments[0], 
					x : jointX, 
					y : jointY, 
					enableMotor : true
				});
			}
			
	
		}
		
		this.body = this.segments[Math.floor(s.numSegments/2)];
		this.originalX = this.body.m_position.x;
	},
	
	draw : function(context, renderType) {
		
		//this.drawTail(creature.segments[0].GetShapeList(), context);
		
		for (var i = 0; i < s.numSegments-1; i++) {	
			v.drawSegment(this.segments[i].GetShapeList(), this.wormWidth, context, renderType);	
		}
		v.drawSegment(this.segments[s.numSegments-1].GetShapeList(), this.wormWidth, context, renderType);
		
		for (var i = 0; i < s.numSegments-1; i++) {	
			//this.drawJoint([creature.segments[i].GetShapeList(), creature.segments[i+1].GetShapeList()], context);
		}
		
		//this.drawHead(creature.segments[numSegments-1].GetShapeList(), context);
		
	}
	
	

});

