// KPR Script file

var whiteSkin = new Skin( { fill:"white" } );
var redSkin = new Skin( { fill:"red" } );
var labelStyle = new Style( { font: "bold 24px", color:"black" } );
var bigLabelStyle = new Style( { font: "bold 48px", color:"black" } );

var ApplicationBehavior = Behavior.template({
	onLaunch: function(application) {
		application.shared = true;
		application.discover("clarity_phone.app");
	},
	onQuit: function(application) {
		application.shared = false;
		application.forget("clarity_phone.app");
	},
})

var brightnessBox = new Container({
    width:300, height:400,
    skin:whiteSkin,
});

var brightnessContainer = new Container({
		top:0,
        skin:whiteSkin,
        name: "container",
        contents:[
                brightnessBox
        ]
});

///////////////////////////////////////////////////////////
//
// Handlers
//
///////////////////////////////////////////////////////////

var deviceURL = "";
 
Handler.bind("/discover", Behavior({
        onInvoke: function(handler, message){
                deviceURL = JSON.parse(message.requestText).url;
        },
}));
 
Handler.bind("/forget", Behavior({
        onInvoke: function(handler, message){
                deviceURL = "";
        }
}));

Handler.bind("/requestBrightness", Behavior({
	onInvoke: function(handler, message){
		handler.invoke(new Message(deviceURL + "currentBrightness"), Message.JSON);
	},
	onComplete: function(handler, message, json) {
		if (json) {
			trace(json.brightness);
      		decVal = Math.round(json.brightness*2.55);
      		//trace("decVal is: " + decVal + "\n");
      		hexVal = decVal.toString(16);
      		brightnessContainer.remove(brightnessBox);
      		if (hexVal.toString().length == 1) {
          		hexVal = "0" + hexVal;
      		}
      		//trace("hexVal is: " + hexVal + "\n");
      		newFill = "#" + hexVal + hexVal + hexVal;
      		brightnessBox.skin = new Skin({fill:newFill});
      		brightnessContainer.add(brightnessBox);
		}	
	}
}));

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

Handler.bind("/YO!", {
	onInvoke: function(handler, message){
	    if (yoThere == 1) {
	        mainContainer.remove(YoBox);
	        yoThere = 0;
	    }
	    mainContainer.add(YoBox);
	    yoThere = 1;
		message.status = 200;
	    handler.invoke(new Message("/delay"));
	}
});

Handler.bind("/delay", { // delay for Yo feature
    onInvoke: function(handler, message){
        handler.wait(2000); //will call onComplete after 2 seconds
    },
    onComplete: function(handler, message){
        handler.invoke(new Message("/removeYo"));
    }
});

Handler.bind("/removeYo", Behavior({
	onInvoke: function(handler, message){
	    if (yoThere == 1) {
	        mainContainer.remove(YoBox);
	        yoThere = 0;
	    }
	}
}));


var YoBox = new Container({
    left: 100, right: 100, top: 80, bottom: 80, skin: redSkin,
    contents: [
        new Label({left:0, right:0, top:0, bottom:0, string:"YO!", style: bigLabelStyle}),
    ],
});


// hardware simulates the window, pin input brightness is toned down as specified by "brightnessLevel" setting
// user control of brightnessLevel not yet implemented
var mainContainerObj = Container.template(function($) { return { left: 0, right: 0, top: 0, bottom: 0,
    behavior: Object.create((mainContainerObj.behavior).prototype), skin: whiteSkin }});
mainContainerObj.behavior = Behavior.template({
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
yoThere = 0; // is the yo box already there ??
application.invoke( new MessageWithObject( "pins:/analogSensor/read?repeat=on&callback=/newValue&interval=5000" ) );
application.behavior = new ApplicationBehavior();
mainContainer = new mainContainerObj();
application.add(mainContainer);
mainContainer.add(brightnessContainer);