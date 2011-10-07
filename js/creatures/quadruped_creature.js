QuadrupedCreature = Class.create(Creature, {
	
	initialize : function($super, individual) {
	
		//calling Creature constructor
		$super(individual);
	
		var segmentWidth = this.wormWidth;
		this.jointLowerAngles = [];
	
		
		var colorMultiplier = 255/s.lengthMax;
		this.color = utilities.RGBtoHex((this.dna[this.lengthGeneStart] * colorMultiplier), 
				(this.dna[this.lengthGeneStart+1] * colorMultiplier), 
				(this.dna[this.jointOffsetGeneStart-1] * colorMultiplier));
		
		var bodyLength = this.dna[this.lengthGeneStart] * 3;
		var bodyHeight = segmentWidth * 2;
		
		var startX = 300;
		var startY = w.groundHeight - s.lengthMax * 3;
		
		this.body = w.createPoly(startX, startY,
				[[0,0],
				[0,bodyHeight],
				[bodyLength/-1, bodyHeight],
				[bodyLength/-1, 0]],false, this.color, -1, 1);
		
		var neckAngle = Math.PI / -4;
		
		var lengthVectorX = Math.cos(neckAngle) * segmentWidth * 1.5;
		var lengthVectorY = Math.sin(neckAngle) * segmentWidth * 1.5;
				
		var widthVectorX = Math.cos(neckAngle + Math.PI/2) * segmentWidth;
		var widthVectorY = Math.sin(neckAngle + Math.PI/2) * segmentWidth;
		
		var positionX = startX + lengthVectorX * .7 + widthVectorX/-2;
		var positionY = startY + lengthVectorY * .7 + widthVectorY/-2;
		
		
		
		this.neck = w.createPoly(positionX, positionY, 
									[[0, 0], 
									[widthVectorX, widthVectorY], 
									[widthVectorX - lengthVectorX, widthVectorY - lengthVectorY], 
									[lengthVectorX*-1, lengthVectorY*-1]], false, this.color, -1, 1);
											
		this.neckJoint = w.createJoint({
			part1 : this.neck, 
			part2 : this.body, 
			x : startX, 
			y : startY, 
			upperAngle : Math.PI/8, 
			lowerAngle : Math.PI/-8,
			enableMotor : false
		});
		
		this.head = w.createPoly(startX + lengthVectorX + segmentWidth/2, positionY - segmentWidth/2, 
				[[0, 0], 
				[0, segmentWidth], 
				[segmentWidth * -1, segmentWidth], 
				[segmentWidth * -1, 0]], false, this.color, -1, 1);
						
		this.headJoint = w.createJoint({
			part1 : this.head, 
			part2 : this.neck, 
			x : startX + lengthVectorX, 
			y : startY + lengthVectorY, 
			upperAngle : Math.PI/6, 
			lowerAngle : Math.PI/-6,
			enableMotor : false
		});
		
		this.tail = w.createPoly(startX - bodyLength, startY, 
				[[0, 0], 
				[0, segmentWidth/2], 
				[segmentWidth * -2, segmentWidth/2], 
				[segmentWidth * -2, 0]], false, this.color, -1, 1);
						
		this.tailJoint = w.createJoint({
			part1 : this.tail, 
			part2 : this.body, 
			x : startX - bodyLength, 
			y : startY + segmentWidth/4, 
			upperAngle : Math.PI/2, 
			lowerAngle : Math.PI/-2,
			enableMotor : false
		});
		
		
										
		this.bodyPosition = this.body.GetCenterPosition();
		
		//left and right legs
		for (var i=0; i<2; i++) {	
			
			var jointX = startX - bodyLength + segmentWidth/2;
			var jointY = startY + bodyHeight - segmentWidth/2;
			
			var positionX = jointX + segmentWidth/2;
			var positionY = jointY - segmentWidth/2;		
			
			////////rear legs and joints////////////
			var rearThighLength = this.dna[this.lengthGeneStart];
			
			//rear thigh
			this.createSegmentAndJoint(i*6, positionX, positionY, rearThighLength, segmentWidth, 
					jointX, jointY, Math.PI/-2, Math.PI/2);
			
			var rearCalfLength = this.dna[this.lengthGeneStart+1];
			
			//rear calf
			this.createSegmentAndJoint(i*6+1, positionX, positionY + rearThighLength, rearCalfLength, segmentWidth, 
					jointX, jointY + rearThighLength - segmentWidth/2, Math.PI/-1, 0, this.segments[i*6]);
			

			var rearFootLength = this.dna[this.lengthGeneStart+2];
			
			//rear foot
			this.createSegmentAndJoint(i*6+2, positionX, positionY + rearThighLength + rearCalfLength, rearFootLength, segmentWidth, 
					jointX, jointY + rearThighLength + rearCalfLength - segmentWidth/2, 0, Math.PI, this.segments[i*6+1]);
			
			
			////////front legs and joints////////////
			var frontThighLength = this.dna[this.lengthGeneStart+3];
			
			//front thigh
			this.createSegmentAndJoint(i*6+3, positionX + bodyLength - segmentWidth, positionY, frontThighLength, segmentWidth, 
					jointX + bodyLength - segmentWidth, jointY, Math.PI/-2, Math.PI/2);
						
			var frontCalfLength = this.dna[this.lengthGeneStart+4];
			
			//front calf
			this.createSegmentAndJoint(i*6+4, positionX + bodyLength - segmentWidth, positionY + frontThighLength, frontCalfLength, segmentWidth, 
					jointX + bodyLength - segmentWidth, jointY + frontThighLength - segmentWidth/2, 0, Math.PI, this.segments[i*6+3]);
			
			var frontFootLength = this.dna[this.lengthGeneStart+5];
			
			//front foot
			this.createSegmentAndJoint(i*6+5, positionX + bodyLength - segmentWidth, positionY + frontThighLength + frontCalfLength, frontFootLength, segmentWidth, 
					jointX + bodyLength - segmentWidth, jointY + frontThighLength + frontCalfLength - segmentWidth/2, Math.PI/-1, 0, this.segments[i*6+4]);

		}
		
		this.originalX = this.bodyPosition.x;

	},
	
	createSegmentAndJoint : function(i, positionX, positionY, length, width, jointX, jointY, lowerAngle, upperAngle, segment) {
		if (!segment) segment = this.body;
		this.segments[i] = w.createPoly(positionX, positionY + length, 
									[[0, 0], 
									[width/-1, 0], 
									[width/-1, length/-1], 
									[0, length/-1]], false, this.color, -1, 1);
		
		this.joints[i] = w.createJoint({
			part1 : this.segments[i], 
			part2 : segment, 
			x : jointX, 
			y : jointY, 
			upperAngle : null, 
			lowerAngle : null,
			enableMotor : true
		});
		
		this.jointLowerAngles[i] = lowerAngle;
	},
	
	draw : function(context, renderType) {
		
		v.drawSegment(this.tail.GetShapeList(), this.wormWidth/2, context, renderType);

		for (var i = 0; i < 6; i++) {	
			v.drawSegment(this.segments[i].GetShapeList(), this.wormWidth, context, renderType);	
		}
		
		v.drawSegment(this.body.GetShapeList(), 0, context, renderType);
		v.drawSegment(this.neck.GetShapeList(), this.wormWidth, context, renderType);
		v.drawSegment(this.head.GetShapeList(), this.wormWidth, context, renderType);
		
		for (var i = 6; i < s.numSegments; i++) {	
			v.drawSegment(this.segments[i].GetShapeList(), this.wormWidth, context, renderType);	
		}
		
		for (var i = 0; i < s.numSegments-1; i++) {	
			//this.drawJoint([creature.segments[i].GetShapeList(), creature.segments[i+1].GetShapeList()], context);
		}
		
		//this.drawHead(creature.segments[numSegments-1].GetShapeList(), context);
		
	},
	
	destroy : function($super, world) {
		
		$super(world);
		
		world.DestroyBody(this.body);
		world.DestroyBody(this.neck);
		world.DestroyBody(this.head);
		world.DestroyBody(this.tail);
	
	},
	
	changeSpeed : function() {		
		
		for (var i=0; i<this.joints.length; i++) {
			
			var offset = this.dna[this.jointOffsetGeneStart+i];
			var rotation = this.dna[this.jointRotationGeneStart+i];
			var speed = this.wormSpeed;
			this.speedMultiplier = 100/speed;
			
			var motorSpeed = Math.sin((c.steps - (this.startStep + offset * speed))/speed + this.jointLowerAngles[i]) * rotation * this.speedMultiplier;
			
			//if (c.steps > this.startStep + offset * speed) {
				this.joints[i].SetMotorSpeed(motorSpeed);
			//}
		}
		
		if (this.body.m_position.x > this.originalX - c.xChange) {
			c.xChange = this.originalX - this.body.m_position.x;
			c.currentFittest = this;
		}
	},
	
	flippedUpsideDown : function() {
		var headPosition = this.head.m_position.y;
		if (headPosition > w.groundHeight - 10) {
			return true;
		} else {
			return false;
		}
	}

});

//class methods

QuadrupedCreature.setupSettings = function() {
	s.numSegments = 8;
	//$("wormRingStarSettings").style.display = "none";
	//$("starSettings").style.display = "none";
	
};
