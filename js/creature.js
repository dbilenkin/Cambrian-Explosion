Creature = Class.create({
	
	numWidthGenes : 4,
	lengthGeneStart : 0,
	jointOffsetGeneStart : 0,
	jointRotationGeneStart : 0,

	initialize : function(individual) {
		this.fitness = 0;
		this.segments = new Array();
		this.joints = new Array();
		this.speedMultiplier = 1;
		this.distanceTraveled = 0;
		this.stepInterval = 0;
		this.startStep = 0;
		this.originalX = 0;
		this.dna = individual.dna;
		
		this.numWidthGenes = individual.numWidthGenes;
		this.lengthGeneStart = individual.lengthGeneStart;
		this.jointOffsetGeneStart = individual.jointOffsetGeneStart;
		this.jointRotationGeneStart = individual.jointRotationGeneStart;
		
		this.wormSpeed = individual.wormSpeed;	
		this.wormWidth = individual.wormWidth;
	},

	changeSpeed : function(p) {		
		
		for (var i=0; i<this.joints.length; i++) {
			
			var offset = this.dna[this.jointOffsetGeneStart+i];
			var rotation = this.dna[this.jointRotationGeneStart+i];

			//var rotation = 30 / speed;
			//var rotation = jointRotation / Math.sqrt(numSegments);
			var speed = this.wormSpeed;
			this.speedMultiplier = 100/speed;
			
			this.joints[i].SetMotorSpeed(Math.sin((c.steps - this.startStep)/speed + offset) * rotation * this.speedMultiplier);
		}
		
		if (this.body.m_position.x > this.originalX - p.xChange) {
			p.xChange = this.originalX - this.body.m_position.x;
			p.currentFittest = this;
		}
	},
	
	distanceChange : function() {
		return this.body.m_position.x - this.originalX;
	},
	
	checkpointDistanceChange : function() {
		return this.body.m_position.x - this.originalX - this.distanceTraveled;
	},
	
	destroy : function(world) {
		world.DestroyBody(this.segments[0]);
		for (var i=1; i<s.numSegments; i++) {	
			world.DestroyBody(this.segments[i]);
			world.DestroyJoint(this.joints[i-1]);
		}
	
	},
	
	flippedUpsideDown : function() {
		return false;
	}

});

//class methods
Creature.createCreature = function(individual, w) {
	
	if (s.creatureType == "worm") {
		return new WormCreature(individual, w);
	} else if (s.creatureType == "ring") {
		return new RingCreature(individual, w);
	} else if (s.creatureType == "star") {
		return new StarCreature(individual, w);
	} else if (s.creatureType == "quadruped") {
		return new QuadrupedCreature(individual, w);
	}

};





