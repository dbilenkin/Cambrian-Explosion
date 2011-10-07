World = {

	ygravity : 1000,
	friction : 0,
	groundHeight : 348,

	create : function() {
		var worldAABB = new b2AABB();
		worldAABB.minVertex.Set(-1000, -100);
		worldAABB.maxVertex.Set(10000, 900);
		var gravity = new b2Vec2(0, this.ygravity);
		var doSleep = true;
		this.world = new b2World(worldAABB, gravity, doSleep);
		//ceiling
		this.createBox(4500, -1000, 5500, 10);
		
		//ground
		//utilities.createBox(-5000, this.groundHeight+100, 10000, 100);
		this.createGround();

		//walls
		this.createBox(-1000, 0, 10, 1000);
		this.createBox(10000, 0, 10, 1000);
		
	},
	
	createGround : function(world) {
		var lastHeight = this.groundHeight;
		for (var i = -500; i <= 10000; i+=500) {
			var difficulty = Math.sqrt(i) * 2;
			//var rise = Math.random() * difficulty - difficulty/2;
			var rise = 0;
			this.createPoly(i, lastHeight, 
										[[0, 0 + rise], 
										[0, 80 + rise], 
										[-500, 80], 
										[-500, 0]], true, null, 1, this.friction);
			
			lastHeight += rise;
	
		}
	},
	
	createPoly : function(x, y, points, fixed, color, groupIndex, friction) {
		var polySd = new b2PolyDef();
		if (!fixed) polySd.density = 1000;
		polySd.vertexCount = points.length;
		for (var i = 0; i < points.length; i++) {
			polySd.vertices[i].Set(points[i][0], points[i][1]);
		}
		if (friction) polySd.friction = friction;
		polySd.groupIndex = groupIndex;
		if (color)
			polySd.userData = color;
		var polyBd = new b2BodyDef();
		polyBd.linearDamping = 0;
		polyBd.angularDamping = 0;
		polyBd.AddShape(polySd);
		polyBd.position.Set(x,y);
		
		return this.world.CreateBody(polyBd);
	},
	
	createCircle : function(x, y, rad, fixed, color, groupIndex, friction) {
		var circleSd = new b2CircleDef();
		if (!fixed) circleSd.density = 500;
		circleSd.radius = rad;
		
		if (friction) 
			circleSd.friction = friction;
		if (color)
			circleSd.userData = color;
		if (groupIndex)
			circleSd.groupIndex = groupIndex;
		
		var circleBd = new b2BodyDef();
		circleBd.AddShape(circleSd);
		circleBd.position.Set(x,y);
		
		return this.world.CreateBody(circleBd);
	},
	
	createBox : function(x, y, width, height, fixed) {
		if (typeof(fixed) == 'undefined') fixed = true;
		var boxSd = new b2BoxDef();
		if (!fixed) boxSd.density = 1.0;
		boxSd.extents.Set(width, height);
		var boxBd = new b2BodyDef();
		boxBd.AddShape(boxSd);
		boxBd.position.Set(x,y);
		return this.world.CreateBody(boxBd);
	},
	
	

	
	createJoint : function(j) {
		
		var axel = new b2RevoluteJointDef();
		axel.anchorPoint.Set(j.x, j.y);
		axel.body1 = j.part1;
		axel.body2 = j.part2;
		
		
		j.enableMotor = (typeof j.enableMotor == 'undefined') ? true : j.enableMotor;
		
		if (j.enableMotor) {
			axel.enableMotor = j.enableMotor;
			axel.motorSpeed = 0;
			axel.motorTorque = 5000000000000.0;
		}
		
		j.upperAngle = (typeof j.upperAngle == 'undefined') ? false : j.upperAngle;
		j.lowerAngle = (typeof j.lowerAngle == 'undefined') ? false : j.lowerAngle;	
		
		if (j.upperAngle || j.lowerAngle) {
			axel.upperAngle = j.upperAngle;
			axel.lowerAngle = j.lowerAngle;
			axel.enableLimit = true;
		}
		
		
		return this.world.CreateJoint(axel);
	}

};

//shortcut for World
w = World;
