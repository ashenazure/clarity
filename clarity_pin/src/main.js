
// KPR Script file

var whiteSkin = new Skin( { fill:"white" } );
var blackSkin = new Skin( { fill:"black" } );
var redSkin = new Skin( { fill:"red" } );
var labelStyle = new Style( { font: "bold 24px", color:"black" } );
var bigLabelStyle = new Style( { font: "bold 48px", color:"black" } );
var timeStyle = new Style({ color: 'black', font: 'bold 64px', horizontal: 'center', vertical: 'middle', });

// Stuff for draw
var THEME = require("themes/sample/theme");
var CONTROL = require("mobile/control");
var SCROLLER = require("mobile/scroller");
var MODEL = require("mobile/model");

var ReplayLine = function(x, y) {
        this.x = x;
        this.y = y;
}
ReplayLine.prototype.replay = function(canvas, xmodifier, ymodifier) {
        var ctx = canvas.getContext("2d");
        ctx.lineTo(this.x*xmodifier, this.y*ymodifier);
        ctx.stroke();
}
var ReplayMove = function(x, y) {
        var data = model.data;
        //var components = data.components;
        //this.r = components.r;
        //this.g = components.g;
        //this.b = components.b;
        this.color = data.color;
        this.thickness = data.thickness;
        this.x = x;
        this.y = y;
}
ReplayMove.prototype.replay = function(canvas, xmodifier, ymodifier) {
        var data = model.data;
        //var components = data.components;
        //components.r = this.r;
        //components.g = this.g;
        //components.b = this.b;
        //model.onColorChanged();
        data.thickness = this.thickness;
        //model.onThicknessChanged()
        //application.distribute("onModelChanged")
        var ctx = canvas.getContext("2d");
        ctx.lineWidth = data.thickness*xmodifier;
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x*xmodifier, this.y*ymodifier);
}
 
var ApplicationBehavior = function(application, data, context) {
        MODEL.ApplicationBehavior.call(this, application, data, context);
}
ApplicationBehavior.prototype = Object.create(MODEL.ApplicationBehavior.prototype, {
        onQuit:  { value: function(application) {
        		application.shared = false;
                application.forget("clarity_phone.app");
        }},
        onLaunch: { value: function() {
        		application.shared = true;
				application.discover("clarity_phone.app");
                var data = this.data = {
                        color: "black",
                        components: {r:0, g:0, b:0},
                        thickness: 10,
                };
                this.replayStack = [];
                this.replayIndex = 0;
                this.replayFlag = false;
                this.replaySavedStack = [];
                this.replaySavedIndex = 0;
                this.lastSavedStack = [];
                this.lastSavedName = "";
                this.backgroundColor = newFill;
                this.bgc = "white";
                var drawScreen = this.drawScreen = new Screen(data);
                //application.add(new Screen(data));
                mainContainer.add(drawScreen);
        }},
});
 
var model = application.behavior = new ApplicationBehavior(application);

var Screen = Container.template(function($) { return {
        //top:65, bottom: 60, height: 400, width:400, active:true,
        top:0, bottom:0, left: 0, right:0, active:true,
        contents: [
                Canvas($, { anchor:"CANVAS", left:0, right:0, top:0, bottom:0, active:true,
                        /*behavior: Object.create(Behavior.prototype, {
                                //onDisplaying: { value: function(canvas) {
                                //        var ctx = canvas.getContext("2d");
                                //        ctx.fillStyle = "white"
                                //        ctx.fillRect(0, 0, canvas.width, canvas.height);
                                //}},
                                onFinished: { value: function(canvas) {
                                        if (model.replayIndex >= model.replayStack.length) {
                                                var ctx = canvas.getContext("2d");
                                                ctx.fillStyle = "white"
                                                ctx.fillRect(0, 0, canvas.width, canvas.height);
                                                model.replayIndex = 0;
                                        }
                                        else {
                                                model.replayStack[model.replayIndex].replay(canvas, 1, 1);
                                                model.replayIndex++;
                                        }
                                        canvas.time = 0;
                                        canvas.start();
                                }},
                                onTouchBegan: { value: function(canvas, id, x, y, ticks) {
                                        if (model.replayFlag)
                                                return;
                                        this.position = canvas.position;
                                        x -= this.position.x;
                                        y -= this.position.y;
                                        var ctx = canvas.getContext("2d");
                                        ctx.lineWidth = model.data.thickness
                                        ctx.strokeStyle = model.data.color
                                        ctx.beginPath();
                                        ctx.moveTo(x, y);
                                        model.replayStack.push(new ReplayMove(x, y));
                                        currX = x;
                                        currY = y;
                                        currColor = "rgb(" + model.data.components.r + "," + model.data.components.g + "," + model.data.components.b + ")";
                                        currThickness = model.data.thickness;
                                        application.invoke(new Message(deviceURL + "moveUpdate"), Message.JSON);                                        
                                }},
                                onTouchMoved: { value: function(canvas, id, x, y, ticks) {
                                        if (model.replayFlag)
                                                return;
                                        x -= this.position.x;
                                        y -= this.position.y;
                                        var ctx = canvas.getContext("2d");
                                        ctx.lineTo(x, y);
                                        ctx.stroke();
                                        model.replayStack.push(new ReplayLine(x, y));
                                        currX = x;
                                        currY = y;
                                        application.invoke(new Message(deviceURL + "lineUpdate"), Message.JSON);
                                }},
                        }),*/
                }),
        ],
}});

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
	    model.replayStack.push(new ReplayLine(result.x, result.y));
	}
});

Handler.bind("/moveUpdate", {
	onInvoke: function(handler, message){
	    handler.invoke(new Message(deviceURL + "getMove"), Message.JSON);
	},
	onComplete: function(handler, message, result) {
	    model.data.thickness = result.thickness;
	    model.data.color = result.color;
	    model.replayStack.push(new ReplayMove(result.x, result.y));
	}
});

Handler.bind("/eraseDrawing", {
    onInvoke: function(handler, message){
        model.replayStack = [];
    }
});

Handler.bind("/requestAlarm", Behavior({
	onInvoke: function(handler, message){
		handler.invoke(new Message(deviceURL + "currentAlarm"), Message.JSON);
	},
	onComplete: function(handler, message, json) {
		if (json) {
			hour = json.hour;
			minute = json.minute;
		}
	}
}));

Handler.bind("/updateDrawing", {
    onInvoke: function(handler, message){
    	var canvas = model.data.CANVAS;
    	var ctx = canvas.getContext("2d");
    	ctx.fillStyle = newFill;
    	//ctx.fillStyle = "white";
    	ctx.fillRect(0, 0, canvas.width, canvas.height);
        var replayStack = model.replayStack;
        var c = replayStack.length;
        var i = model.replayIndex;
        while (i < c) {
        	replayStack[i].replay(canvas, 1, 0.6);
        	i++;
        }
    }
});

Handler.bind("/saveCurrent", {
	onInvoke: function(handler, message){
		model.lastSavedStack = model.replayStack.slice();
	},
});

Handler.bind("/load", {
	onInvoke: function(handler, message){
		model.replayStack = model.lastSavedStack;
		var canvas = model.data.CANVAS;
    	var ctx = canvas.getContext("2d");
    	ctx.fillStyle = newFill;
    	//ctx.fillStyle = "white";
    	ctx.fillRect(0, 0, canvas.width, canvas.height);
        var replayStack = model.replayStack;
        var c = replayStack.length;
        var i = model.replayIndex;
        while (i < c) {
        	replayStack[i].replay(canvas, 1, 0.6);
        	i++;
        }
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
        new Label({left:10, right:0, top:0, bottom:0, string:"YO!", style: bigLabelStyle}),
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
	    var canvas = model.data.CANVAS;
    	var ctx = canvas.getContext("2d");
	    if (percentage >= 1) {
	        container.skin = whiteSkin;
	        ctx.fillStyle = "white";
	        newFill = "white";
	    }
	    else {
	        decVal = Math.round(percentage*255);
	        hexVal = decVal.toString(16);
	        if (hexVal.toString().length == 1) {
                hexVal = "0" + hexVal;
            }
            newFill = "#" + hexVal + hexVal + hexVal;
            container.skin = new Skin({fill: newFill});
    		ctx.fillStyle = newFill;
    	}
    	ctx.fillRect(0, 0, canvas.width, canvas.height);
        var replayStack = model.replayStack;
        var c = replayStack.length;
        var i = model.replayIndex;
        while (i < c) {
        	replayStack[i].replay(canvas, 1, 0.6);
        	i++;
        }
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
var newFill = "";
hour = 1;
minute = 0;
alarm = 0;
brightnessLevel = 50;
yoThere = 0; // is the yo box already there ??
application.invoke( new MessageWithObject( "pins:/analogSensor/read?repeat=on&callback=/newValue&interval=2000" ) );
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