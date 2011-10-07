StarCreature = Class.create(Creature, {
	
	initialize : function($super, individual) {
	
		//calling Creature constructor
		$super(individual);
	
		var angle = (Math.PI * 2)/s.numSegments;
	
		var segmentWidth = this.wormWidth;
	
		
		var colorMultiplier = 255/s.lengthMax;
		this.color = utilities.RGBtoHex((this.dna[this.lengthGeneStart] * colorMultiplier), 
				(this.dna[this.lengthGeneStart+1] * colorMultiplier), 
				(this.dna[this.jointOffsetGeneStart-1] * colorMultiplier));
		
		this.bodySize = individual.starBodySize + segmentWidth/2;
		//this.bodySize = segmentWidth/4 * s.numSegments;
		//this.bodySize = 10;
		
		this.body = w.createCircle(300, w.groundHeight - 100, this.bodySize, false, this.color, -1, 1);
										
		this.bodyPosition = this.body.GetCenterPosition();
										
		for (var i=0; i<s.numSegments; i++) {	
			
			var startX = Math.cos(angle*i) * this.bodySize;
			var startY = Math.sin(angle*i) * this.bodySize;
			
			var lengthVectorX = Math.cos(angle*i) * (this.dna[this.lengthGeneStart+i]);
			var lengthVectorY = Math.sin(angle*i) * (this.dna[this.lengthGeneStart+i]);
					
			var widthVectorX = Math.cos(angle*i + Math.PI/2) * (segmentWidth);
			var widthVectorY = Math.sin(angle*i + Math.PI/2) * (segmentWidth);
			
			var positionX = startX + lengthVectorX + widthVectorX/-2 + this.bodyPosition.x;
			var positionY = startY + lengthVectorY + widthVectorY/-2 + this.bodyPosition.y;
			
			
			
			this.segments[i] = w.createPoly(positionX, positionY, 
										[[0, 0], 
										[widthVectorX, widthVectorY], 
										[widthVectorX - lengthVectorX, widthVectorY - lengthVectorY], 
										[lengthVectorX*-1, lengthVectorY*-1]], false, this.color, -1, 1);
												
			this.joints[i] = w.createJoint({
				part1 : this.segments[i], 
				part2 : this.body, 
				x : startX + this.bodyPosition.x, 
				y : startY + this.bodyPosition.y, 
				enableMotor : true
			});
			
	
		}
		this.originalX = this.bodyPosition.x;

	},
	
	draw : function(context, renderType) {
		
		v.drawCircle(this.body.GetShapeList(), context, renderType);
		
		for (var i = 0; i < s.numSegments-1; i++) {	
			v.drawSegment(this.segments[i].GetShapeList(), this.wormWidth, context, renderType);	
		}
		v.drawSegment(this.segments[s.numSegments-1].GetShapeList(), this.wormWidth, context, renderType);
		
		for (var i = 0; i < s.numSegments-1; i++) {	
			//this.drawJoint([creature.segments[i].GetShapeList(), creature.segments[i+1].GetShapeList()], context);
		}
		
		//this.drawHead(creature.segments[numSegments-1].GetShapeList(), context);
		
	},
	
	destroy : function($super, world) {
		
		$super(world);
		
		world.DestroyBody(this.body);
	
	}

	
	

});
