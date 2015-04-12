// KPR Script file

var whiteSkin = new Skin( { fill:"white" } );
var labelStyle = new Style( { font: "bold 24px", color:"black" } );

var ApplicationBehavior = Behavior.template({
	onLaunch: function(application) {
		application.shared = true;
	},
	onQuit: function(application) {
		application.shared = false;
	},
})

///////////////////////////////////////////////////////////
//
// Handlers
//
///////////////////////////////////////////////////////////

Handler.bind("/hourUp", Behavior({
	onInvoke: function(handler, message){
	    hour += 1;
	    trace("hour: " + hour + "\n");
		message.responseText = JSON.stringify( { hour: hour, minute: minute } );
		message.status = 200;
	}
}));

Handler.bind("/hourDown", Behavior({
	onInvoke: function(handler, message){
	    hour -= 1;
	    trace("hour: " + hour + "\n");
		message.responseText = JSON.stringify( { hour: hour, minute: minute } );
		message.status = 200;
	}
}));

Handler.bind("/minuteUp", Behavior({
	onInvoke: function(handler, message){
	    minute += 1;
	    trace("minute: " + minute + "\n");
		message.responseText = JSON.stringify( { hour: hour, minute: minute } );
		message.status = 200;
	}
}));

Handler.bind("/minuteDown", Behavior({
	onInvoke: function(handler, message){
	    minute -= 1;
	    trace("minute: " + minute + "\n");
		message.responseText = JSON.stringify( { hour: hour, minute: minute } );
		message.status = 200;
	}
}));

Handler.bind("/alarmSwitch", Behavior({
	onInvoke: function(handler, message){
	    alarm = (alarm + 1) % 2;
	    trace("alarm: " + alarm + "\n");
		message.responseText = JSON.stringify( { alarm: alarm } );
		message.status = 200;
	}
}));

// hardware simulates the window, pin input brightness is toned down as specified by "brightnessLevel" setting
// user control of brightnessLevel not yet implemented
var mainContainer = Container.template(function($) { return { left: 0, right: 0, top: 0, bottom: 0,
    behavior: Object.create((mainContainer.behavior).prototype), skin: whiteSkin }});
mainContainer.behavior = Behavior.template({
	onValueChanged: function(container,result) {
	    percentage = brightnessLevel/(100*result.brightness);
	    if (percentage >= 1) {
	        container.skin = whiteSkin;
	    }
	    else {
	        decVal = Math.round(percentage*255);
	        hexVal = decVal.toString(16);
	        if (hexVal.toString().length == 1) {
                hexVal = "0" + hexVal;
            }
            newFill = "#" + hexVal + hexVal + hexVal;
            container.skin = new Skin({fill: newFill});
	    }
	},
})

////////////////////////////////////////////
//
// Pin Stuff
//
////////////////////////////////////////////

Handler.bind("/newValue", Object.create(Behavior.prototype, {
	onInvoke: { value: 
		function(handler, message) {
            var result = message.requestObject;  
            application.distribute( "onValueChanged", result );
		},
	},
}));

application.invoke( new MessageWithObject( "pins:configure",{
    analogSensor: {
        require: "bll",
        pins:{
            brightness: { pin: 1 },
        }
    }
}));

//////////////////////////////////////////////

hour = 1;
minute = 0;
alarm = 1;
brightnessLevel = 50;
application.invoke( new MessageWithObject( "pins:/analogSensor/read?repeat=on&callback=/newValue&interval=20" ) );
application.behavior = new ApplicationBehavior();
application.add(new mainContainer());