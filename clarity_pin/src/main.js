// KPR Script file

var whiteSkin = new Skin( { fill:"white" } );
var blackSkin = new Skin( { fill:"black" } );
var redSkin = new Skin( { fill:"red" } );
var labelStyle = new Style( { font: "bold 24px", color:"black" } );
var bigLabelStyle = new Style( { font: "bold 48px", color:"black" } );
var timeStyle = new Style({ color: 'black', font: 'bold 64px', horizontal: 'center', vertical: 'middle', });

// Stuff for draw
var MODEL = require("mobile/model");
var ReplayLine = function(x, y) {
        this.x = x;
        this.y = y;
}
ReplayLine.prototype.replay = function(canvas) {
        var ctx = canvas.getContext("2d");
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
}
var ReplayMove = function(x, y, color, thickness) {
        this.color = color
        this.thickness = thickness;
        this.x = x;
        this.y = y;
}
ReplayMove.prototype.replay = function(canvas) {
        var ctx = canvas.getContext("2d");
        ctx.lineWidth = thickness;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
}

var ApplicationBehavior = function(application, data, context) {
        MODEL.ApplicationBehavior.call(this, application, data, context);
}

ApplicationBehavior.prototype = Object.create(MODEL.ApplicationBehavior.prototype, {
		onLaunch: { value: function() {
				application.shared = true;
				application.discover("clarity_phone.app");
                this.drawStack = [];
                //var data = this.data = {}
        }},
		onQuit: function(application) {
				application.shared = false;
				application.forget("clarity_phone.app");
		},
		onUpdate: { value: function(application) {
                var canvas = currentDrawing;
                var drawStack = this.drawStack;
                var c = drawStack.length;
                var i = 0;
                while (i < c) {
                        drawStack[i].replay(canvas);
                        i++;
                }
		}},
})

var model = application.behavior = new ApplicationBehavior(application);

// end draw stuff

var brightnessBox = new Container({
    width:300, height:400,
    skin:whiteSkin
});

var brightnessContainer = new Container({
		top:0,
        skin:whiteSkin,
        name: "container",
        contents:[
                //brightnessBox
        ]
});

var alarmBox = new Container({
    width:300, height:400,
    skin:blackSkin
});

var alarmContainer = new Container({
		top:0,
        skin:whiteSkin,
        name: "container",
        contents:[
                alarmBox
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

Handler.bind("/lineUpdate", {
	onInvoke: function(handler, message){
	    handler.invoke(new Message(deviceURL + "getLine"), Message.JSON);
	},
	onComplete: function(handler, message, result) {
	    model.drawStack.push(new ReplayLine(result.x, result.y));
	}
});

Handler.bind("/moveUpdate", {
	onInvoke: function(handler, message){
	    trace("updating move");
	    handler.invoke(new Message(deviceURL + "getMove"), Message.JSON);
	},
	onComplete: function(handler, message, result) {
	    trace("finished updating");
	    trace("result " + result.thickness);
	    model.drawStack.push(new ReplayMove(result.x, result.y, result.color, result.thickness));
	}
});

Handler.bind("/eraseDrawing", {
    onInvoke: function(handler, message){
        model.drawStack = [];
    }
});

Handler.bind("/updateDrawing", {
    onInvoke: function(handler, message){
        application.distribute("onUpdate");
    }
});

Handler.bind("/requestBrightness", Behavior({
	onInvoke: function(handler, message){
		handler.invoke(new Message(deviceURL + "currentBrightness"), Message.JSON);
	},
	onComplete: function(handler, message, json) {
		if (json) {
		    brightnessLevel = json.brightness;
			/*trace(json.brightness);
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
      		brightnessContainer.add(brightnessBox);*/
		}	
	}
}));


Handler.bind("/time", Object.create(Behavior.prototype, {
	onInvoke: { value: 
//@line 37
		function(handler, message) {
			application.distribute( "onTimeUpdated" );
			handler.invoke( new Message( "/timeDelay?duration=500" ) );
		},
	},
}));
Handler.bind("/timeDelay", Object.create(Behavior.prototype, {
	onInvoke: { value: 
//@line 46
		function(handler, message) {
			var query = parseQuery( message.query );
			var duration = query.duration;
			handler.wait( duration )
		},
	},
	onComplete: { value: 
//@line 51
		function(handler, message) {
			handler.invoke( new Message( "/time" ) );
		},
	},
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

var alarmScreenCalled = false;
Handler.bind("/alarmScreen", Behavior({
	onInvoke: function(handler, message){
		//if (!alarmScreenCalled) {
		if (alarm == 1) {
		    if (!alarmScreenCalled) {
			    mainContainer.add(alarmContainer);
			    alarmScreenCalled = true;
			}
		}
	}
}));

Handler.bind("/alarmSwitch", Behavior({
	onInvoke: function(handler, message){
	    alarm = (alarm + 1) % 2;
	    trace("alarm: " + alarm + "\n");
	    if(alarm == 0) {
	        if (alarmScreenCalled) {
	    	    mainContainer.remove(alarmContainer);
	    	    alarmScreenCalled = false;
	    	}
	    } else {
	        if (!alarmScreenCalled) {
	    	    mainContainer.add(alarmContainer);
	    	    alarmScreenCalled = true;
	    	}
	    }
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
	    handler.invoke(new Message(deviceURL + "YoSent"), Message.JSON);
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

////////////////////////////////

var YoBox = new Container({
    left: 111, width: 99, top: 83, height: 75, skin: redSkin,
    contents: [
        new Label({left:0, right:0, top:0, bottom:0, string:"YO!", style: bigLabelStyle}),
    ],
});

var MenuTransition = function() {
        Transition.call(this, 5000);
}
MenuTransition.prototype = Object.create(Transition.prototype, {
        onBegin: { value: function(screen, container, delta) {
                var toolLayer = this.toolLayer = new Layer({ alpha:true });
                toolLayer.attach(container.first);
                var menuLayer = this.menuLayer = new Layer({ alpha:true });
                menuLayer.attach(container.last);
                this.delta = delta;
        }},
        onEnd: { value: function(screen, container, delta) {
                this.menuLayer.detach();
                this.toolLayer.detach();
                container.moveBy(delta, 0);
        }},
        onStep: { value: function(fraction) {
                fraction = Math.quadEaseOut(fraction);
                this.menuLayer.translation = this.toolLayer.translation = { y: -this.delta * fraction };
        }}
});
 
// hardware simulates the window, pin input brightness is toned down as specified by "brightnessLevel" setting
// user control of brightnessLevel not yet implemented
var mainContainerObj = Container.template(function($) { return { left: 0, right: 0, top: 0, bottom: 0,
    behavior: Object.create((mainContainerObj.behavior).prototype), skin: whiteSkin }});
mainContainerObj.behavior = Behavior.template({
	onCreate: function(container, data) {
		container.invoke( new Message( "/time" ) );
	},
	onTimeUpdated: function(container) {
		var date = new Date();
		var hours = String( date.getHours() );
		var minutes = String( date.getMinutes() );
		var seconds = String( date.getSeconds() );
		if ( 1 == minutes.length )
			minutes = '0' + minutes;
		if ( 1 == seconds.length )
			seconds = '0' + seconds;
		if(hours == hour && minutes == minute && alarm == 1 && seconds == 0) {
			//ANIMATION HERE
			container.run(new MenuTransition, alarmContainer, alarmContainer.last.height - 4);
		}
	},
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
alarm = 0;
brightnessLevel = 50;
yoThere = 0; // is the yo box already there ??
application.invoke( new MessageWithObject( "pins:/analogSensor/read?repeat=on&callback=/newValue&interval=500" ) );
//application.behavior = new ApplicationBehavior();
mainContainer = new mainContainerObj();
application.add(mainContainer);
//window components
mainContainer.add(new Container({left:0, width:4, top:0, bottom:0, skin:whiteSkin}));
mainContainer.add(new Container({left:105, width:5, top:0, bottom:0, skin:whiteSkin}));
mainContainer.add(new Container({left:211, width:5, top:0, bottom:0, skin:whiteSkin}));
mainContainer.add(new Container({left:317, width:5, top:0, bottom:0, skin:whiteSkin}));
mainContainer.add(new Container({left:0, right:0, top:77, height:5, skin:whiteSkin}));
mainContainer.add(new Container({left:0, right:0, top:159, height:5, skin:whiteSkin}));
mainContainer.add(new Container({left:104, width:1, top:0, height:77, skin:blackSkin}));
mainContainer.add(new Container({left:104, width:1, top:82, height:77, skin:blackSkin}));
mainContainer.add(new Container({left:104, width:1, top:164, height:77, skin:blackSkin}));
mainContainer.add(new Container({left:110, width:1, top:0, height:77, skin:blackSkin}));
mainContainer.add(new Container({left:110, width:1, top:82, height:77, skin:blackSkin}));
mainContainer.add(new Container({left:110, width:1, top:164, height:77, skin:blackSkin}));
mainContainer.add(new Container({left:210, width:1, top:0, height:77, skin:blackSkin}));
mainContainer.add(new Container({left:210, width:1, top:82, height:77, skin:blackSkin}));
mainContainer.add(new Container({left:210, width:1, top:164, height:77, skin:blackSkin}));
mainContainer.add(new Container({left:216, width:1, top:0, height:77, skin:blackSkin}));
mainContainer.add(new Container({left:216, width:1, top:82, height:77, skin:blackSkin}));
mainContainer.add(new Container({left:216, width:1, top:164, height:77, skin:blackSkin}));
mainContainer.add(new Container({left:4, width:101, top:76, height:1, skin:blackSkin}));
mainContainer.add(new Container({left:4, width:101, top:82, height:1, skin:blackSkin}));
mainContainer.add(new Container({left:4, width:101, top:158, height:1, skin:blackSkin}));
mainContainer.add(new Container({left:4, width:101, top:164, height:1, skin:blackSkin}));
mainContainer.add(new Container({left:110, width:101, top:76, height:1, skin:blackSkin}));
mainContainer.add(new Container({left:110, width:101, top:82, height:1, skin:blackSkin}));
mainContainer.add(new Container({left:110, width:101, top:158, height:1, skin:blackSkin}));
mainContainer.add(new Container({left:110, width:101, top:164, height:1, skin:blackSkin}));
mainContainer.add(new Container({left:216, width:101, top:76, height:1, skin:blackSkin}));
mainContainer.add(new Container({left:216, width:101, top:82, height:1, skin:blackSkin}));
mainContainer.add(new Container({left:216, width:101, top:158, height:1, skin:blackSkin}));
mainContainer.add(new Container({left:216, width:101, top:164, height:1, skin:blackSkin}));
//mainContainer.add(brightnessContainer);