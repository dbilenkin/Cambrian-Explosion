View = Class.create({

	ctx : null,
	yZoomAdjustment : 0,
	xZoomAdjustment : 0,
	wheelValue : 0,
	zoom: 1,
	
	splitAdjustment : 0,
	
	canvasWidth : 700,
	canvasHeight : 400,
	canvasTop : 0,
	canvasLeft : 0,
	

	xBackgroundOffset : 0,
	yBackgroundOffset : 0,
	
	//data, log and graph settings
	logTimer : 0,
	drawStep : true,
	graph: '',
	
	logField : '',
	generationLogField : '',
	mainInfo : '',
	currentFitnessInfo : '',
	
	renderType: 'wire',
	canvasElem: null,
	
	population : null,
		
	initialize : function(canvasString, population) {

		this.population = population;
		this.graph = new Graph(624, 366);
		this.canvasElem = $(canvasString);
		this.ctx = this.canvasElem.getContext('2d');	
		

		this.canvasWidth = parseInt(this.canvasElem.width);
		this.canvasHeight = parseInt(this.canvasElem.height);
		this.canvasTop = parseInt(this.canvasElem.style.top);
		this.canvasLeft = parseInt(this.canvasElem.style.left);
		
		this.logField = $("log");
		this.generationLogField = $("generationlog");
		this.mainInfo = $("mainInfo");
		this.currentFitnessInfo = $("currentFitnessInfo");
		
		Event.observe("canvas", "mousewheel", Settings.changeZoom1, false);
		Event.observe("canvas", "DOMMouseScroll", Settings.changeZoom1, false); // Firefox
		
		Event.observe("canvas2", "mousewheel", Settings.changeZoom2, false);
		Event.observe("canvas2", "DOMMouseScroll", Settings.changeZoom2, false); // Firefox
		
		this.butterfly1 = new Image();
		this.butterfly2 = new Image();
		this.butterfly3 = new Image();
	   
	    this.butterfly1.src = 'images/butterfly1.png';
	    this.butterfly2.src = 'images/butterfly2.png';
	    this.butterfly3.src = 'images/butterfly3.png';
	    
	    this.butterfly1Size = Math.random() * 50 + 50;
	    this.butterfly1X = Math.random() * 20 + 100;
	    this.butterfly1Y = Math.random() * 100 + 150;
	    
	    this.butterfly2Size = Math.random() * 50 + 50;
	    this.butterfly2X = Math.random() * 20 + 300;
	    this.butterfly2Y = Math.random() * 100 + 150;
	    
	    this.butterfly3Size = Math.random() * 50 + 50;
	    this.butterfly3X = Math.random() * 20 + 600;
	    this.butterfly3Y = Math.random() * 100 + 150;
	    
	    this.renderType = s.renderType;
	    this.setBackground(s.backgroundChoice);
	},
	
	
	
	setBackground : function(choice) {

		if (choice == "none") {
			this.drawStep = false;
			this.canvasElem.style.display = 'none';
			
		} else {
			if (this.drawStep == false) {
				finishingGenerationText.innerHTML = "Finishing generation before drawing...";
				this.drawStep = true;
			}			
			if (choice == "wire") {
				this.canvasElem.style.backgroundImage = "none";
				this.canvasElem.style.backgroundColor = "#002200";
			} else {
				this.canvasElem.style.backgroundColor = "#000000";
				this.canvasElem.style.background = "-webkit-gradient(linear, left top, left bottom, color-stop(0%,#000000),color-stop(86%,#00BFFF),color-stop(87%,#006600),color-stop(100%,#000000))";
				this.canvasElem.style.background = "-moz-linear-gradient(center bottom,#000000 0%,#006600 13%,#00BFFF 14%,#000000 100%)";
				this.canvasElem.style.backgroundRepeat = "repeat-x";
			}
			this.renderType = choice;
		}
		
	},
	
	checkFinishGenerationText : function() {
		
		if (this.drawStep == true) {
			finishingGenerationText.innerHTML = "";
			this.canvasElem.style.display = 'block';
			
		} 
	},
	
	showDNA : function(current, i) {
		var dialog = jQuery( "#individualdnaDialog" );
		dialog.empty();
		
		var individualToShow;
		if (current) {
			individualToShow = c.population.individuals[i];
		} else {
			individualToShow = c.population.previousIndividuals[i];
		}
		
		for (var j = 0, len = individualToShow.dna.length-1; j < len; j++)
			dialog.append(individualToShow.dna[j] + ",");
		dialog.append(individualToShow.dna[j]);
		jQuery( "#individualdnaDialog" ).dialog({ modal: true });
	},
		
	logResults : function() {
		
		var p = c.w.population;
		var genCount = p.genCount;
		
		var generationTime = 0;
		if (genCount > 0) generationTime = c.totalTime/genCount;
		
		var info = "steps: " + c.steps;
		info += "</br>steps/sec: " + Math.floor(c.stepsPerSecond);
		info += "</br>time: " + utilities.getPrettyTime(c.totalTime);
		info += "</br>time/gen: " + utilities.getPrettyTime(generationTime);
		
		
		v.mainInfo.innerHTML = info;
		v.currentFitnessInfo.innerHTML = "current fitness: " + Math.floor(p.xChange) * -1;
		
		v.logTimer = setTimeout(v.logResults, 100);
	
	},
	
	drawWorld : function(currentCreatures) {
		var w = this.population.world;
		var xOffset = this.xBackgroundOffset + this.population.xChange/this.zoom + this.xZoomAdjustment;
		var yOffset = this.yBackgroundOffset + (this.population.yChange - this.splitAdjustment)/this.zoom + this.yZoomAdjustment;
		
		this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		
		
		var butterfly1Size = this.butterfly1Size;
		var butterfly2Size = this.butterfly2Size;
		var butterfly3Size = this.butterfly3Size;
		
		if (this.renderType == "wire") {
			for (var j = w.world.m_jointList; j; j = j.m_next) {
			
				//this.drawJoint(j, this.ctx);
			}
			for (var b = w.world.m_bodyList; b; b = b.m_next) {
				for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
					this.drawShape(s, this.ctx);
				}
			}
		} else {
			
			for (var i = -5; i < 20; i++) {
				if ((700*i + this.population.xChange)/this.zoom > -700 && (100 + 700*i + this.population.xChange)/this.zoom < 700) {
					
			      this.ctx.drawImage(this.butterfly1,(this.butterfly1X + 700*i + this.population.xChange)/this.zoom + this.xZoomAdjustment,
			    		  (this.butterfly1Y + this.population.yChange)/this.zoom + this.yZoomAdjustment, 
			    		  butterfly1Size/this.zoom, butterfly1Size/this.zoom);
			      
			      this.ctx.drawImage(this.butterfly2,(this.butterfly2X + 700*i + this.population.xChange)/this.zoom + this.xZoomAdjustment,
			    		  (this.butterfly2Y + this.population.yChange)/this.zoom + this.yZoomAdjustment, 
			    		  butterfly2Size/this.zoom, butterfly2Size/this.zoom);
			      
			      this.ctx.drawImage(this.butterfly3,(this.butterfly3X + 700*i + this.population.xChange)/this.zoom + this.xZoomAdjustment,
			    		  (this.butterfly3Y + this.population.yChange)/this.zoom + this.yZoomAdjustment, 
			    		  butterfly3Size/this.zoom, butterfly3Size/this.zoom);
				}
		    };
			
			this.canvasElem.style.backgroundPosition = xOffset + " " + yOffset;
			var backgroundSize = 100/this.zoom;
			this.canvasElem.style.backgroundSize = backgroundSize + '%';
			this.canvasElem.style.MozBackgroundSize = backgroundSize + '%';
		
		}
		
		for (var i = 0, len = currentCreatures.length; i<len; i++)
			if(currentCreatures[i])
				currentCreatures[i].draw(this);
		
	},
	
	drawCircle :  function(shape, context, renderType) {
		
		var xChange = this.population.xChange;
		var yChange = this.population.yChange;
		var zoom = this.zoom;
		var xZoomAdjustment = this.xZoomAdjustment;
		var yZoomAdjustment = this.yZoomAdjustment;
		
		var circle = shape;
		var pos = circle.m_position;
		var ax = circle.m_R.col1;
		
		//pos.x += xChange;

		var r = circle.m_radius;
		var segments = 20.0;
		var theta = 0.0;
		var dtheta = 2.0 * Math.PI / segments;
		// draw circle
		context.beginPath();
		context.moveTo((pos.x + r + xChange)/zoom + xZoomAdjustment, (pos.y + yChange)/zoom + yZoomAdjustment);
		for (var i = 0; i < segments; i++) {
			var d = new b2Vec2(r * Math.cos(theta), r * Math.sin(theta));
			var v = b2Math.AddVV(pos, d);
			context.lineTo((v.x + xChange)/zoom + xZoomAdjustment, (v.y + yChange)/zoom + yZoomAdjustment);
			theta += dtheta;
		}
		context.lineTo((pos.x + r + xChange)/zoom + xZoomAdjustment, (pos.y + yChange)/zoom + yZoomAdjustment);
		
		if (renderType == "wire") {
			context.fillStyle = shape.m_userData;
		} else {
			var circleGradient = context.createRadialGradient((pos.x + r/2 + xChange)/zoom + xZoomAdjustment,(pos.y - r/2 + yChange)/zoom + yZoomAdjustment,0
					,(pos.x + xChange)/zoom + xZoomAdjustment,(pos.y + yChange)/zoom + yZoomAdjustment,r/zoom);
			circleGradient.addColorStop(1, "#330000");
			circleGradient.addColorStop(0, shape.m_userData);
			
			context.fillStyle = circleGradient;
		}
		context.fill();
		
	},
	
	drawSegment : function(shape, width) {
		
		var context = this.ctx;
		var renderType = this.renderType;
		var xChange = this.population.xChange;
		var yChange = this.population.yChange;
		var zoom = this.zoom;
		var xZoomAdjustment = this.xZoomAdjustment;
		var yZoomAdjustment = this.yZoomAdjustment;
		
		var vx = [];
		var vy = [];
		
		var poly = shape;
		var pos = poly.m_position;
		
		for (var i = 0; i < poly.m_vertexCount; i++) {
			var v = b2Math.AddVV(pos, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
			vx[i] = (v.x + xChange)/zoom + xZoomAdjustment;
			vy[i] = (v.y + yChange)/zoom + yZoomAdjustment;
		}
		
		//context.save();
		
		if (renderType == "wire") {
		
			context.beginPath();
			
			context.moveTo(vx[0], vy[0]);
			for (var i = 0; i < 4; i++) {
				context.lineTo(vx[i], vy[i]);
			}
			context.lineTo(vx[0], vy[0]);
			
			context.closePath();
			
			context.strokeStyle = shape.m_userData;
			context.stroke();
			
			context.fillStyle = shape.m_userData;
			context.lineWidth = 1.0;
			context.globalAlpha = 0.7;
			context.fill();
			
			
		
		
		} else {
			/*
			//draw shadow first
			this.setupShadow(shape, width, context);
			context.beginPath();
			
			context.moveTo(vx[0], vy[0]);
			for (var i = 0; i < 4; i++) {
				context.lineTo(vx[i], vy[i]);
			}
			context.lineTo(vx[0], vy[0]);
			
			//context.arc((vx[0] + vx[1])/2,(vy[0] + vy[1])/2,shape.m_vertices[1].y,0,Math.PI * 2, false);
			context.arc((vx[3] + vx[2])/2,(vy[3] + vy[2])/2,width/2,0,Math.PI * 2, false);
			
			context.fill();
			
			context.restore(); */
			context.globalAlpha = 1.0;
			//now draw segment on top of shadow
			var gradient = context.createLinearGradient(vx[0], vy[0], vx[1], vy[1]);
	
			gradient.addColorStop(1, "#330000");
			gradient.addColorStop(0, shape.m_userData);
			//context.strokeStyle = shape.m_userData;
			context.fillStyle = gradient;
			
			context.beginPath();
			
			context.moveTo(vx[0], vy[0]);
			for (var i = 0; i < 4; i++) {
				context.lineTo(vx[i], vy[i]);
			}
			context.lineTo(vx[0], vy[0]);
			
	
			context.arc((vx[0] + vx[1])/2,(vy[0] + vy[1])/2,width/2/zoom,0,Math.PI * 2, false);
			context.arc((vx[3] + vx[2])/2,(vy[3] + vy[2])/2,width/2/zoom,0,Math.PI * 2, false);
			
			context.closePath();
			
			context.fill();
		}
	
	},
	
	drawHead : function(head, width) {
		var context = this.ctx;
		var renderType = this.renderType;
		
		if (renderType != "wire") {
			var xChange = this.population.xChange;
			var yChange = this.population.yChange;
			var zoom = this.zoom;
			var xZoomAdjustment = this.xZoomAdjustment;
			var yZoomAdjustment = this.yZoomAdjustment;
			
			var pos = head.m_position;
			
			var v0 = b2Math.AddVV(pos, b2Math.b2MulMV(head.m_R, head.m_vertices[0]));
			var v1 = b2Math.AddVV(pos, b2Math.b2MulMV(head.m_R, head.m_vertices[1]));
			
			var vx0 = (v0.x + xChange)/zoom + xZoomAdjustment;
			var vx1 = (v1.x + xChange)/zoom + xZoomAdjustment;
			var vy0 = (v0.y + yChange)/zoom + yZoomAdjustment;
			var vy1 = (v1.y + yChange)/zoom + yZoomAdjustment;
			
			//context.save();
			
			/*
			//draw shadow first
			this.setupShadow(head, width, context);
			context.beginPath();
			
			context.arc((vx0 + vx1)/2,(vy0 + vy1)/2,head.m_vertices[1].y,-Math.PI,Math.PI, false);
			
			context.closePath();
			context.fill();
			
			context.restore();*/
			
			//now draw segment on top of shadow
			var jointGradient = context.createRadialGradient(vx0,vy0,0,vx0,vy0,head.m_vertices[1].y*2/zoom);
			jointGradient.addColorStop(1, "#330000");
			jointGradient.addColorStop(0, head.m_userData);
			context.fillStyle = jointGradient;
			
			context.beginPath();
			context.arc((vx0 + vx1)/2,(vy0 + vy1)/2,head.m_vertices[1].y * 1.2/zoom,-Math.PI,Math.PI, false);
			
			context.closePath();
			context.fill();
			
			//context.moveTo();
		}
		
	
	},
	
	drawShape : function(shape, context) {
		
		var xChange = this.population.xChange;
		var yChange = this.population.yChange;
		var zoom = this.zoom;
		var xZoomAdjustment = this.xZoomAdjustment;
		var yZoomAdjustment = this.yZoomAdjustment;
		
		if (!shape.m_userData) {
			var vx = [];
			var vy = [];
			
			var poly = shape;
			var pos = poly.m_position;
			
			context.beginPath();
			
			for (var i = 0; i < poly.m_vertexCount; i++) {
				var v = b2Math.AddVV(pos, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
				vx[i] = v.x + xChange;
				vy[i] = v.y + yChange;
			}
			
			context.moveTo(vx[0]/zoom + xZoomAdjustment, vy[0]/zoom + yZoomAdjustment);
			for (var i = 0; i < 4; i++) {
				context.lineTo(vx[i]/zoom + xZoomAdjustment, vy[i]/zoom + yZoomAdjustment);
			}
			context.lineTo(vx[0]/zoom + xZoomAdjustment, vy[0]/zoom + yZoomAdjustment);
			context.closePath();
	
			context.strokeStyle = "#ffffff";
		
			context.stroke(); 
		}
		
	},
	
	drawJoint : function(joint, context) {
		var b1 = joint.m_body1;
		var b2 = joint.m_body2;
		var x1 = b1.m_position;
		var x2 = b2.m_position;
		var p1 = joint.GetAnchor1();
		var p2 = joint.GetAnchor2();
		context.strokeStyle = '#00eeee';
		context.beginPath();
		switch (joint.m_type) {
		case b2Joint.e_distanceJoint:
			context.moveTo(p1.x, p1.y);
			context.lineTo(p2.x, p2.y);
			break;
	
		case b2Joint.e_pulleyJoint:
			// TODO
			break;
	
		default:
			if (b1 == w.world.m_groundBody) {
				context.moveTo(p1.x, p1.y);
				context.lineTo(x2.x, x2.y);
			}
			else if (b2 == w.world.m_groundBody) {
				context.moveTo(p1.x, p1.y);
				context.lineTo(x1.x, x1.y);
			}
			else {
				context.moveTo(x1.x, x1.y);
				context.lineTo(p1.x, p1.y);
				context.lineTo(x2.x, x2.y);
				context.lineTo(p2.x, p2.y);
			}
			break;
		}
		
		context.closePath();
		context.stroke();
	}
		
});



