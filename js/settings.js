//Decided to have the user adjusted settings in the global scope for convenience.
/*
var speed = 90;
var zoom = 1;
var ygravity;
var friction;
var popSize;
var numSegments;
var widthMin;
var widthMax;
var lengthMin;
var lengthMax;

var renderType = 'abby';
var creatureType = 'worm';

var mutateChance;
var mutateAmount;
var killParents = false;
var parentCutoff;
var useIdenticals = false;
var seed;
var seedDNA = [];

var moveRight = true;

var concurrentCreatures = 1;
*/

Settings = {
	//default settings
		
	//genetic
	selectionType : 'elite',
	mutateChance : .05,
	mutateAmount : .25,
	killParents : true,
	parentCutoff : .25,
	useIdenticals : false,
	seed : '',
	seedDNA : null,
	moveRight : true,
	
	//creature
	creatureType : 'worm',
	
	numSegments : 9,
	
	
	rotationFactor : 180,	
	//jointRotation = setting/rotationFactor
	minJointRotation : 0/180,
	maxJointRotation : 120/180,

	speedFactor : 70,
	//wormSpeed = speedFactor/setting
	minWormSpeed : 70/8,
	maxWormSpeed : 70/3,

	widthMin : 1,
	widthMax : 15,
	lengthMin : 10,
	lengthMax : 20,

	//view
	concurrentCreatures : 1,
	renderType : 'wire',
	backgroundChoice : 'wire',
	
	initialize : function() {
		
		//initialize initial settings
		c.popSize = parseInt($("popsize").value);
		
		this.killParents = $("killparents").checked;
		this.useIdenticals = $("useidenticals").checked;
				
		this.parentCutoff = parseFloat($("parentcutoff").value);
		this.parentCutoff = Math.max(0.1, Math.min(0.5, this.parentCutoff));
		
		this.moveRight = true;
		
		this.mutateChance = parseFloat($("mutatechance").value);
		this.mutateAmount = parseFloat($("mutateamount").value);
		this.mutateChance = Math.min(1,Math.max(0,this.mutateChance));
		this.mutateAmount = Math.min(1,Math.max(0,this.mutateAmount));
		
		this.seed = $("seed").value;
		if (!this.seed.blank()) {
			this.seedDNA = this.seed.split(",");
			
			for (var i = 0, len = this.seedDNA.length; i < len; i++ ) {
				this.seedDNA[i] = parseFloat(this.seedDNA[i]);
			}
		}
		
		
		
		
		
	},
	
	//Settings changed by event listeners
	setCreatureType : function(choice) {
		this.creatureType = choice;
		if (choice == "quadruped") {
			QuadrupedCreature.setupSettings();
			this.numSegments = 12;
		}
	},
	
	setSelectionType : function(choice) {
		this.selectionType = choice.value;
	},

	changeJointRotation : function(jointRotationValues) {
		this.minJointRotation = parseFloat(jointRotationValues[0]/this.rotationFactor);
		this.maxJointRotation = parseFloat(jointRotationValues[1]/this.rotationFactor);
	},

	changeWormSpeed : function(wormSpeedValues) {
		this.minWormSpeed = parseInt(this.speedFactor/wormSpeedValues[0]);
		this.maxWormSpeed = parseInt(this.speedFactor/wormSpeedValues[1]);
	},

	changeCreatureWidth : function(creatureWidthValues) {
		this.widthMin = parseInt(creatureWidthValues[0]);
		this.widthMax = parseInt(creatureWidthValues[1]);
	},

	changeSegmentLength : function(segmentLengthValues) {
		this.lengthMin = parseInt(segmentLengthValues[0]);
		this.lengthMax = parseInt(segmentLengthValues[1]);
	},
	
	changeCreatureSteps : function(creatureStepValues) {
		c.minStepsPerCreature = parseInt(creatureStepValues[0]);
		c.maxStepsPerCreature = parseInt(creatureStepValues[1]);
	},

	changeSpeed : function(speedValue) {
		var _speedValue = parseInt(speedValue);
		if (_speedValue <=5) {
			c.speed = 50 + _speedValue * 10;
		} else {
			c.speed = 100;
			c.stepDrawFrequency = (_speedValue - 5) * 5;
			
		}
		
	},
	
	changeZoom1 : function(e) {
		Settings.changeZoom(e, c.worlds[0]);
	},
	
	changeZoom2 : function(e) {
		Settings.changeZoom(e, c.worlds[1]);
	},
	
	changeZoom : function(e, w) {
		var v = w.view;
		v.wheelValue += Event.wheel(e);
		v.zoom = Math.min(10, Math.max(.5, 1 - v.wheelValue/10));
		v.yZoomAdjustment = w.groundHeight + v.splitAdjustment - 
			(w.groundHeight)/v.zoom;
		v.xZoomAdjustment = 230 - 230/v.zoom;
	}

	
};

//shortcut for Settings
s = Settings;




jQuery(document).ready(function() {
	
	jQuery('.down-list').width(jQuery('.dropdown-menu').width()-2);
	 
	jQuery('.dropdown-menu').hover(
      function () {
    	  jQuery('.menu-first', this).addClass('slide-down');
    	  jQuery('.down-list', this).slideDown(100);
      },
      function () {
        obj = this;
        jQuery('.down-list', this).slideUp(100, function(){ jQuery('.menu-first', obj).removeClass('slide-down'); });
      }
    );
	
	jQuery("#CreatureChoice").change(
		function() {
			Settings.setCreatureType(jQuery("#CreatureChoice").val());
		});
	
	jQuery("#RenderChoice").change(
		function() {
			View.setBackground(jQuery("#RenderChoice").val());
		});


	jQuery( "#settingsAccordion" ).accordion();
	
    jQuery("#speedSlider").slider({
    	value:5,
		min: 1,
		max: 10,

		slide: function(event, ui) {
			jQuery( "#speedText" ).val( ui.value );
			Settings.changeSpeed(ui.value);
		}		
	});
    
    jQuery("#numSegmentsSlider").slider({
    	value:9,
		min: 2,
		max: 20,

		slide: function(event, ui) {
			jQuery( "#numSegmentsText" ).val( ui.value );
			Settings.numSegments = parseInt(ui.value);
		}		
	});
    
    
    
    jQuery("#creatureStepsSlider").slider({
    	values: [100,500],
    	step: 10,
		min: 0,
		max: 2000,
		range: true,

		slide: function(event, ui) {
			jQuery( "#creatureStepsText" ).val( ui.values[0] + " - " + ui.values[1]);
			Settings.changeCreatureSteps(ui.values);
		}		
	});
	
	jQuery("#jointRotationSlider").slider({
    	values: [0,120],
    	step: 10,
		min: 0,
		max: 180,
		range: true,

		slide: function(event, ui) {
			jQuery( "#jointRotationText" ).val( ui.values[0] + " - " + ui.values[1]);
			Settings.changeJointRotation(ui.values);
		}		
	});
	
	jQuery("#wormSpeedSlider").slider({
    	values: [3,8],
		min: 1,
		max: 10,
		range: true,

		slide: function(event, ui) {
			jQuery( "#wormSpeedText" ).val( ui.values[0] + " - " + ui.values[1]);
			Settings.changeWormSpeed(ui.values);
		}		
	});
	
	jQuery("#creatureWidthSlider").slider({
    	values: [1,15],
		min: 1,
		max: 50,
		range: true,

		slide: function(event, ui) {
			jQuery( "#creatureWidthText" ).val( ui.values[0] + " - " + ui.values[1]);
			Settings.changeCreatureWidth(ui.values);
		}		
	});
	
	jQuery("#segmentLengthSlider").slider({
    	values: [10,20],
		min: 1,
		max: 100,
		range: true,

		slide: function(event, ui) {
			jQuery( "#segmentLengthText" ).val( ui.values[0] + " - " + ui.values[1]);
			Settings.changeSegmentLength(ui.values);
		}		
	});
	
	jQuery("#concurrentCreaturesSlider").slider({
		value:1,
		min: 1,
		max: 10,

		slide: function(event, ui) {
			jQuery( "#concurrentCreaturesText" ).val( ui.value );
			Settings.concurrentCreatures = ui.value;
		}		
	});
	
	jQuery("#gravitySlider").slider({
    	value:1,
		min: 0,
		max: 5,
		step: .25,

		slide: function(event, ui) {
			jQuery( "#gravityText" ).val( ui.value + "g");
			w.ygravity = parseInt(ui.value * 1000);
		}		
	});
	
	jQuery( "#settingsAccordion" ).accordion({
		collapsible: true,
		autoHeight: false 
	});
	
	Object.extend(Event, {
		wheel:function (event){
			var delta = 0;
			if (!event) event = window.event;
			if (event.wheelDelta) {
				delta = event.wheelDelta/120; 
				if (window.opera) delta = -delta;
			} else if (event.detail) { delta = -event.detail/3;	}
			
			cancelEvent(event);
			return Math.round(delta); //Safari Round
		}
	});
	
	function cancelEvent(e)
	{
	  e = e ? e : window.event;
	  if(e.stopPropagation)
		e.stopPropagation();
	  if(e.preventDefault)
		e.preventDefault();
	  e.cancelBubble = true;
	  e.cancel = true;
	  e.returnValue = false;
	  return false;
	}
	
	
	
	//Chrome specific settings cause its faster
	if (jQuery.browser.webkit) {
		jQuery("#concurrentCreaturesSlider").slider("value", 5);
		jQuery( "#concurrentCreaturesText" ).val( "5" );
		
		Settings.concurrentCreatures = 5;
		
		s.renderType = "full";
		jQuery("[name=backgroundChoice]").filter("[value=full]").attr("checked","checked");
		
		s.backgroundChoice = "full";
	}	
	
	
});

//for browser to reset fields when page is refreshed
Event.observe(window, 'unload', function() {
	$("startbutton").disabled = false;
	$("generationlog").value = "";
	$("log").innerHTML = "";
});

