WormCreature = Class.create(Creature, {
	
	initialize : function($super, individual, w) {
		
		//calling Creature constructor
		$super(individual);
		
		var colorMultiplier = 255/s.lengthMax;
		this.color = utilities.RGBtoHex((this.dna[this.lengthGeneStart] * colorMultiplier), 
					(this.dna[this.lengthGeneStart+1] * colorMultiplier), 
					(this.dna[this.jointOffsetGeneStart-1] * colorMultiplier));
		
		this.speedMultiplier = 1;
		
		var angle = (Math.PI * 2)/s.numSegments;
		var segmentLength = 500/s.numSegments;
		var segmentWidth = this.wormWidth;
		var apothem = segmentLength/(2 * Math.tan(Math.PI/s.numSegments));
		
		var jointX0;
		var jointY0;
		
		
		this.segments[0] = w.createPoly(230, w.groundHeight - 100, 
											[[0, 0], 
											[0, this.wormWidth], 
											[this.dna[this.lengthGeneStart]/-1, this.wormWidth], 
											[this.dna[this.lengthGeneStart]/-1, 0]], false, this.color, -1, 0);
		
			
		for (var i=1; i<s.numSegments; i++) {	
	
			this.segments[i] = w.createPoly(
				this.segments[i-1].m_position.x + this.dna[this.lengthGeneStart+i-1]/2 + this.dna[this.lengthGeneStart+i], 
				w.groundHeight - 100, 
				[[0, 0], 
				[0, this.wormWidth], 
				[this.dna[this.lengthGeneStart+i]/-1, this.wormWidth], 
				[this.dna[this.lengthGeneStart+i]/-1, 0]],false, this.color, -1, 0);
										
			var x = this.segments[i].m_position.x - this.dna[this.lengthGeneStart+i]/2;
			var y = this.segments[i-1].GetCenterPosition().y;
			this.joints[i-1] = w.createJoint({
				part1 : this.segments[i-1], 
				part2 : this.segments[i], 
				x : x, 
				y : y, 
				enableMotor : true
			});
		}
		
		this.body = this.segments[Math.floor(s.numSegments/2)];
		this.originalX = this.body.m_position.x;
	},
	
	
	draw : function(v) {
		
		//draw.drawTail(this.segments[0].GetShapeList(), this.wormWidth, context, renderType);
		
		for (var i = 0; i < s.numSegments-1; i++) {	
			v.drawSegment(this.segments[i].GetShapeList(), this.wormWidth);	
		}
		v.drawSegment(this.segments[s.numSegments-1].GetShapeList(), this.wormWidth);
		
		for (var i = 0; i < s.numSegments-1; i++) {	
			//this.drawJoint([this.joints[i].GetShapeList(), this.joints[i+1].GetShapeList()], context);
		}
		
		v.drawHead(this.segments[s.numSegments-1].GetShapeList(), this.wormWidth);
		
	}
	
	
	
	

});