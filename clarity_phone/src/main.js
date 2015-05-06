// KPR Script file
//Skins and theme
var whiteSkin = new Skin( { fill:"white" } );
var blackSkin = new Skin( { fill:"black" } );
var redSkin = new Skin( { fill:"red" } );
var tealSkin = new Skin ( { fill:"#65D9D3" } );
var blueSkin = new Skin( {fill:"blue"} );
var greySkin = new Skin( { fill:"#F6F6F6" } );
var mediumGreySkin = new Skin( { fill: "#CCCCCC" } );
var darkGreySkin = new Skin( { fill:"#979797" });
var greenSkin = new Skin( { fill:"green" });
var THEME = require('themes/flat/theme');
var SLIDERS = require('controls/sliders');
var SCROLLER = require('mobile/scroller');
var SWITCHES = require('controls/switch');
var currentBrightness = 0;
///////////////////
// Device Handling
///////////////////

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

Handler.bind("/sendNewBrightness", Behavior({
	onInvoke: function(handler, message){
		if (deviceURL != ''){
			handler.invoke(new Message(deviceURL + "requestBrightness"), Message.JSON);
		}
	}
}));

Handler.bind("/currentBrightness", Behavior({
	onInvoke: function(handler, message){
		message.responseText = JSON.stringify( { brightness: currentBrightness } );
		message.status = 200;
	}
}));

/*Handler.bind("/getMove", {
	onInvoke: function(handler, message){
	    trace("you've reached me");
	    trace(currX);
	    message.responseText = JSON.stringify( { x: currX, y: currY, color: currColor, thickness: currThickness } );
	    message.status = 200;
    }
});*/

Handler.bind("/getLine", {
	onInvoke: function(handler, message){
	    message.responseText = JSON.stringify( {x: currX, y: currY } );
	    message.status = 200;
	}
});
 
//var connectionApplicationBehavior = Behavior.template({
//        onDisplayed: function(application) {
//        		application.shared = true;
//                application.discover("clarity_pin.app");
//        },
//        onQuit: function(application) {
//        		application.shared = false;
//                application.forget("clarity_pin.app");
//        },
//})
 
//////////////////////////
 
// Top Bar and logo
var logoImageURL = mergeURI(application.url, "./assets/logo.png")
var logo = new Picture({
        top: -35, height:150, width:250, url:logoImageURL});
var topBar = new Content({
        top:0, height: 65, width: 400,
        skin: tealSkin
});
 
// Tab Bar and buttons
var border = new Content({
        height:1, width:400, bottom:61,
        skin: darkGreySkin
});
var tabBar = new Content({
        bottom:0, height:60, width: 400,
        skin: greySkin
});
var brightnessImageURL = mergeURI(application.url, "./assets/brightness_icon.png")
var alarmImageURL = mergeURI(application.url, "./assets/alarm_icon.png")
var yoImageURL = mergeURI(application.url, "./assets/yo_icon.png")
var drawImageURL = mergeURI(application.url, "./assets/draw_icon.png")
var arrowUpImageURL = mergeURI(application.url, "./assets/arrow_up_button.png")
var arrowDownImageURL = mergeURI(application.url, "./assets/arrow_down_button.png")
 
/////////////////////////////////////////////////////////////////////
//
//                                      Brightness container and content
//
/////////////////////////////////////////////////////////////////////
 
var brightnessBox = new Container({
    left:0, right:0, top:100, bottom:0,
    skin:whiteSkin,
    contents:[
    		new Container({left:38, width:5, top:0, bottom:0, skin:whiteSkin}),
    		new Container({left:144, width:5, top:0, bottom:0, skin:whiteSkin}),
    		new Container({left:250, width:5, top:0, bottom:0, skin:whiteSkin}),
    		new Container({left:356, width:5, top:0, bottom:0, skin:whiteSkin}),
    		new Container({left:0, right:0, top:100, height:5, skin:whiteSkin}),
    		new Container({left:0, right:0, top:205, height:5, skin:whiteSkin}),
    		new Container({left:143, width:1, top:0, height:100, skin:blackSkin}),
    		new Container({left:143, width:1, top:105, height:100, skin:blackSkin}),
    		new Container({left:143, width:1, top:210, height:100, skin:blackSkin}),
    		new Container({left:149, width:1, top:0, height:100, skin:blackSkin}),
    		new Container({left:149, width:1, top:105, height:100, skin:blackSkin}),
    		new Container({left:149, width:1, top:210, height:100, skin:blackSkin}),
    		new Container({left:249, width:1, top:0, height:100, skin:blackSkin}),
    		new Container({left:249, width:1, top:105, height:100, skin:blackSkin}),
    		new Container({left:249, width:1, top:210, height:100, skin:blackSkin}),
    		new Container({left:255, width:1, top:0, height:100, skin:blackSkin}),
    		new Container({left:255, width:1, top:105, height:100, skin:blackSkin}),
    		new Container({left:255, width:1, top:210, height:100, skin:blackSkin}),
    		new Container({left:43, width:101, top:99, height:1, skin:blackSkin}),
    		new Container({left:43, width:101, top:105, height:1, skin:blackSkin}),
    		new Container({left:43, width:101, top:204, height:1, skin:blackSkin}),
    		new Container({left:43, width:101, top:210, height:1, skin:blackSkin}),
    		new Container({left:149, width:101, top:99, height:1, skin:blackSkin}),
    		new Container({left:149, width:101, top:105, height:1, skin:blackSkin}),
    		new Container({left:149, width:101, top:204, height:1, skin:blackSkin}),
    		new Container({left:149, width:101, top:210, height:1, skin:blackSkin}),
    		new Container({left:255, width:101, top:99, height:1, skin:blackSkin}),
    		new Container({left:255, width:101, top:105, height:1, skin:blackSkin}),
    		new Container({left:255, width:101, top:204, height:1, skin:blackSkin}),
    		new Container({left:255, width:101, top:210, height:1, skin:blackSkin}),
    ]
});
 
var brightnessTap = Object.create(Behavior.prototype,{
    onTouchBegan: {value: function(content){
        mainContainer.remove(mainContainer.last);
        mainContainer.add(brightnessContainer);
    }}
});

var BrightnessSlider = SLIDERS.HorizontalSlider.template(function($){ return{
  height:20, left:50, right:50, top: 50,
  behavior: Object.create(SLIDERS.HorizontalSliderBehavior.prototype, {
    onValueChanged: { value: function(container){
      SLIDERS.HorizontalSliderBehavior.prototype.onValueChanged.call(this, container);
      trace("Brightness Value is: " + this.data.value + "\n");
      currentBrightness = this.data.value.toFixed(2);
      application.invoke(new Message("/sendNewBrightness"));
      decVal = Math.round(this.data.value*2.55);
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
  }}})
}});
var blackBox = new Container({ left:40, height:10, top:55, width:10, skin: new Skin( {fill:"black"} ) });
var whiteBox = new Container({ right:40, height:10, top:55, width:10, skin: new Skin( {fill:"#F0F0F0"} ) });
var slider = new BrightnessSlider({ min:0, max:100, value:50,  });
var brightnessContainer = new Container({
        top:65, bottom: 60, height: 400, width:400,
        skin:whiteSkin,
        name: "container",
        contents:[
                slider,
                brightnessBox,
                blackBox,
                whiteBox,
        ]
});
 
 
/////////////////////////////////////////////////////////////////////
//
//                                      Alarm Container
//
//
//                      Note to do: everytime clock is changed; update the pin simulator and send the appropriate message
//                      Assuming its "on" of course    
//
/////////////////////////////////////////////////////////////////////
 
var alarmTap = Object.create(Behavior.prototype,{
    onTouchBegan: {value: function(content){
        mainContainer.remove(mainContainer.last);
        mainContainer.add(alarmContainer);
    }}
});
var alarmStyle = new Style( { font: "bold 40px", color:"gray" } );
var alarmLabel = new Label({top: 30, left:150, right: 0, height:60, string:"Alarm", style: alarmStyle});
 
var clockStyle = new Style( { font: "bold 50px", color:"black" } );
var hour = 1;
var hourLabel = new Label({top: 150, left:133,height:50, string:"0" + hour, style: clockStyle});
var hourIncreaseTap = Object.create(Behavior.prototype,{
    onTouchBegan: {value: function(content){
                if(hour < 24) {
                    if(deviceURL != "") {
                        content.invoke(new Message(deviceURL + "hourUp"), Message.JSON);
                    }
                        hour++;
                        if(hour < 10) {
                                hourLabel.string = "0" + hour;
                        } else {
                                hourLabel.string = hour;
                        }
                }
    }}
});
var hourDecreaseTap = Object.create(Behavior.prototype,{
    onTouchBegan: {value: function(content){
                if(hour > 1) {
                    if(deviceURL != "") {
                        content.invoke(new Message(deviceURL + "hourDown"), Message.JSON);
                    }
                        hour--;
                        hourLabel.string = hour;
                        if(hour < 10) {
                                hourLabel.string = "0" + hour;
                        } else {
                                hourLabel.string = hour;
                        }
                }
    }}
});
var hourUpButton = new Picture({
        left:130, top:100, height:50, width: 50, url: arrowUpImageURL, active: true, behavior: hourIncreaseTap
});
var hourDownButton = new Picture({
        left:130, top:200, height:50, width: 50, url: arrowDownImageURL, active: true, behavior: hourDecreaseTap
});
var alarmTap = Object.create(Behavior.prototype,{
    onTouchBegan: {value: function(content){
    	application.invoke(new Message(deviceURL + "alarmScreen"), Message.JSON);
        mainContainer.remove(mainContainer.last);
        mainContainer.add(alarmContainer);
    }}
});
var colonLabel = new Label({top: 150, left:190,height:50, string:":", style: clockStyle});
var minute = 0;
var minuteLabel = new Label({top: 150, left:223,height:50, string:"00", style: clockStyle});
var minuteIncreaseTap = Object.create(Behavior.prototype,{
    onTouchBegan: {value: function(content){
                if(minute < 59) {
                    if(deviceURL != "") {
                        content.invoke(new Message(deviceURL + "minuteUp"), Message.JSON);
                    }
                        minute++;
                        if(minute < 10) {
                                minuteLabel.string = "0" + minute;
                        } else {
                                minuteLabel.string = minute;
                        }
                }
    }}
});
var minuteDecreaseTap = Object.create(Behavior.prototype,{
    onTouchBegan: {value: function(content){
                if(minute > 0) {
                    if(deviceURL != "") {
                        content.invoke(new Message(deviceURL + "minuteDown"), Message.JSON);
                    }
                        minute--;
                        minuteLabel.string = minute;
                        if(minute < 10) {
                                if (minute == 0) {
                                        minuteLabel.string = "00";                             
                                } else {
                                        minuteLabel.string = "0" + minute;
                                }
                        } else {
                                minuteLabel.string = minute;
                        }
                }
    }}
});
var minuteUpButton = new Picture({
        left:220, top:100, height:50, width: 50, url: arrowUpImageURL, active: true, behavior: minuteIncreaseTap
});
var minuteDownButton = new Picture({
        left:220, top:200, height:50, width: 50, url: arrowDownImageURL, active: true, behavior: minuteDecreaseTap
});
var alarmSwitchTemplate = SWITCHES.SwitchButton.template(function($){ return{
  height:50, width: 100, left: 160, top:250,
  behavior: Object.create(SWITCHES.SwitchButtonBehavior.prototype, {
    onValueChanged: { value: function(container){
      SWITCHES.SwitchButtonBehavior.prototype.onValueChanged.call(this, container);
      container.invoke(new Message(deviceURL + "alarmSwitch"), Message.JSON);
      trace("Alarm is set to: " + this.data.value + "\n");
  }}})
}});
 
var alarmSwitch = new alarmSwitchTemplate({ value: 0 });
var alarmContainer = new Container({
        top:65, bottom: 60, height: 400, width:400,
        skin:greySkin,
        contents:[
                alarmLabel,
                hourUpButton,
                hourLabel,
                hourDownButton,
                colonLabel,
                minuteUpButton,
                minuteLabel,
                minuteDownButton,
                alarmSwitch
        ]
});
 
 
 
/////////////////////////////////////////////////////////////////////
//
//                                      YO! Feature
//
/////////////////////////////////////////////////////////////////////
 
var yoTap = Object.create(Behavior.prototype,{
    onTouchBegan: {value: function(content){
        mainContainer.remove(mainContainer.last);
        //mainContainer.remove(drawScreen);
        mainContainer.add(yoContainer);
    }}
});
 
var contactsTitleStyle = new Style( { font:"20px", color:"#676767" } );
var contactsStyle = new Style( { font:"30px bold", color:"black" } );
 
var contactsTitleLabel = new Label({top:10, left:160, height:20, string:"Contacts", style: contactsTitleStyle});

//var data = this.data = {
//        color: "black",
//        components: {r:0, g:0, b:0},
//        thickness: 10,
//};

//drawScreen = Screen(data);
var drawTap = Object.create(Behavior.prototype,{
    onTouchBegan: {value: function(content){
        mainContainer.remove(mainContainer.last);
        //mainContainer.add(new Screen(model.data));
        mainContainer.add(model.drawScreen);
    }}
});
 

var yoTapWithConsent = Object.create(Behavior.prototype,{
    onTouchBegan: {value: function(content){
    	content.invoke(new Message(deviceURL + "YO!"), Message.JSON);
    }}
});

var deliveredLabel = new Label({top:35, left:40, height:30, string:"Delivered!", style: contactsStyle});
var deliveredContainer = new Container({top:150, left:100, width:200, height:100, skin:redSkin,
		contents:[
				deliveredLabel
		]
});
Handler.bind("/YoSent", Behavior({
	onInvoke: function(handler, message){
	    if (yoThere == 1) {
	        contactsContainer.remove(deliveredContainer);
	        yoThere = 0;
	    }
	    contactsContainer.add(deliveredContainer);
	    yoThere = 1;
	    handler.invoke(new Message("/delay"));
	}
}));

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
	        contactsContainer.remove(deliveredContainer);
	        yoThere = 0;
	    }
	}
}));


var THEMESAMPLE = require('themes/sample/theme');
var CONTROL = require('mobile/control');
var KEYBOARD = require('mobile/keyboard');

var nameInputSkin = new Skin({ borders: { left:2, right:2, top:2, bottom:2 }, stroke: 'gray',});
var fieldStyle = new Style({ color: 'black', font: 'bold 24px', horizontal: 'left', vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5, });
var fieldHintStyle = new Style({ color: '#aaa', font: '24px', horizontal: 'left', vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5, });
var whiteSkin = new Skin({fill:"white"});
              
var MyField = Container.template(function($) { return { 
  width: 220, top: $.top, height: 36, skin: nameInputSkin, contents: [
    Scroller($, { 
      left: 4, right: 4, top: 4, bottom: 4, active: true, 
      behavior: Object.create(CONTROL.FieldScrollerBehavior.prototype), clip: true, contents: [
        Label($, { 
          left: 0, top: 0, bottom: 0, skin: THEMESAMPLE.fieldLabelSkin, style: fieldStyle, anchor: 'NAME',
          editable: true, string: $.name,
         	behavior: Object.create( CONTROL.FieldLabelBehavior.prototype, {
         		onEdited: { value: function(label){
         			var data = this.data;
              		data.name = label.string;
              		label.container.hint.visible = ( data.name.length == 0 );	
         		}}
         	}),
         }),
         Label($, {
   			 	left:4, right:4, top:4, bottom:4, style:fieldHintStyle, string:$.hintName, name:"hint"
         })
      ]
    })
  ]
}});

var EditContainerTemplate = Container.template(function($) { return {
  left: $.left, width: 250, top: 50, height: 350, skin: whiteSkin, active: true,
  behavior: Object.create(Container.prototype, {
    onTouchEnded: { value: function(content){
      KEYBOARD.hide();
      content.focus();
    }}
  })
}});

var cancelButtonBehavior = Object.create(Behavior.prototype,{
    onTouchEnded: {value: function(content){
    	editing = false;
        mainContainer.last.remove(mainContainer.last.last);
        mainContainer.last.last.skin = greySkin;
    }}
});

var OKButtonBehaviorDraw = Object.create(Behavior.prototype,{
    onTouchEnded: {value: function(content){
    	model.lastSavedStack = model.replaySavedStack.slice();
    	model.lastSavedName = model.nameField.first.first.string;
        mainContainer.last.remove(mainContainer.last.last);
        var canvas = model.data.CANVAS;
    	var ctx = canvas.getContext("2d");
    	ctx.fillStyle = model.backgroundColor;
    	model.bgc = model.backgroundColor;
    	ctx.fillRect(0, 0, canvas.width, canvas.height);
        var replayStack = model.replayStack;
        var c = replayStack.length;
        var i = model.replayIndex;
        while (i < c) {
        	replayStack[i].replay(canvas, 1, 1);
        	i++;
        }
    }}
});

var OKContainer = Container.template(function($) { return {
  bottom:8, height:36, right:10, width:72, skin:blueSkin, active:true,
  contents: [
  	new Label({string:"OK", style:fieldStyle})
  ],
  behavior: Object.create(Container.prototype, {
    onTouchEnded: { value: function(content){
    	editing = false;
    	if (fieldList[0].first.first.string != "") {
    		userData[$.i].name = fieldList[0].first.first.string;
    		userData[$.i].label.string = userData[$.i].name;
    		var x = 0;
    		userData[$.i].windows = [];
    		while (x < userData[$.i].numWindows) {
    			if (fieldList[x+1].first.first.string != "") {
    				userData[$.i].windows.push(fieldList[x+1].first.first.string);
    			}
    			x++;
    		}
    		if (fieldList[x+1].first.first.string != "") {
    			userData[$.i].windows.push(fieldList[x+1].first.first.string);
    		}
    		userData[$.i].numWindows = userData[$.i].windows.length;
    	}
    	mainContainer.last.remove(mainContainer.last.last);
    	mainContainer.last.last.skin = greySkin;
    }}
  })
}});

var fieldList = [];

var editContainer = Container.template(function($) { return {
  top:$.top, right:60, height:30, width:30, skin: whiteSkin, active: true,
  behavior: Object.create(Container.prototype, {
    onTouchEnded: { value: function(content){
    	if (!editing) {
    		editing = true;
    		var editBox = new EditContainerTemplate({left: 75});
        	mainContainer.last.last.skin = darkGreySkin;
        	mainContainer.last.add(editBox);
        	editBox.add(new Container({ bottom:8, height:36, left:10, width:72, skin:redSkin, active:true, behavior:cancelButtonBehavior,
        		contents:[
        				new Label({string:"Cancel", style:fieldStyle})
        		]
        	}));
        	editBox.add(new OKContainer({i:$.index}));
        	fieldList = [];
        	var i = 0;
        	var currTop = 10;
        	var currHint = "Name...";
        	var currField = new MyField({ top:currTop, name:$.name, hintName:currHint });
        	fieldList.push(currField);
        	editBox.add(currField);
        	while (i < $.numWindows) {
        	    currTop = currTop + 40;
        	    j = i + 1;
        	    currHint = "Window " + j + " ID..."
        		currField = new MyField({ top:currTop, name:$.windows[i], hintName:currHint});
        		fieldList.push(currField);
        		editBox.add(currField);
        		i++;
        	}
        	currField = new MyField({ top:currTop+40, name:"", hintName:"+ Add New Window"})
        	fieldList.push(currField);
        	editBox.add(currField);
        }
    }}
  })
}});

var alexLabel = new Label({top:25, left:60, height:30, string:"Alex", style: contactsStyle, active: true, behavior: yoTapWithConsent});
var andersLabel = new Label({top:75, left:60, height:30, string:"Anders", style: contactsStyle, active: true, behavior: yoTapWithConsent});
var jennyLabel = new Label({top:125, left:60, height:30, string:"Jenny", style: contactsStyle, active: true, behavior: yoTapWithConsent});
var johnLabel = new Label({top:175, left:60, height:30, string:"John", style: contactsStyle, active: true, behavior: yoTapWithConsent});
var mironLabel = new Label({top:225, left:60, height:30, string:"Miron", style: contactsStyle, active: true, behavior: yoTapWithConsent});

var alexData = {
	top:25,
	name:"Alex",
	index:0,
	numWindows:2,
	windows:["3F24","3F25"],
	label:alexLabel,
}

var andersData = {
	top:75,
	name:"Anders",
	index:1,
	numWindows:4,
	windows:["1","2","3","4"],
	label:andersLabel,
}

var jennyData = {
	top:125,
	name:"Jenny",
	index:2,
	numWindows:1,
	windows:["F2G2"],
	label:jennyLabel,
}

var johnData = {
	top:175,
	name:"John",
	index:3,
	numWindows:1,
	windows:["DFJ853"],
	label:johnLabel,
}

var mironData = {
	top:225,
	name:"Miron",
	index:4,
	numWindows:1,
	windows:["3342"],
	label:mironLabel,
}

userData = [alexData, andersData, jennyData, johnData, mironData];

var editURL = mergeURI(application.url, "./assets/edit.png");
var plusURL = mergeURI(application.url, "./assets/plus.png");
var editPic = new Picture({top:0, right:0, height:30, width:30, url:editURL});
var alexEdit = new editContainer(alexData);
alexEdit.add(new Picture({top:0, right:0, height:30, width:30, url:editURL}));
var andersEdit = new editContainer(andersData);
andersEdit.add(new Picture({top:0, right:0, height:30, width:30, url:editURL}));
var jennyEdit = new editContainer(jennyData);
jennyEdit.add(new Picture({top:0, right:0, height:30, width:30, url:editURL}));
var johnEdit = new editContainer(johnData);
johnEdit.add(new Picture({top:0, right:0, height:30, width:30, url:editURL}));
var mironEdit = new editContainer(mironData);
mironEdit.add(new Picture({top:0, right:0, height:30, width:30, url:editURL}));

var OKButtonBehavior = Object.create(Behavior.prototype,{
    onTouchEnded: {value: function(content){
    	editing = false;
    	if (fieldList[0].first.first.string != "") {
    		YoTopIndex += 50
    		YoUserIndex += 1
    		userData.push({top:YoTopIndex, name:fieldList[0].first.first.string, index:YoUserIndex, numWindows:0, windows:[]});
    		if (fieldList[1].first.first.string != "") {
    			userData[YoUserIndex].numWindows = 1;
    			userData[YoUserIndex].windows.push(fieldList[1].first.first.string);
    		}
    	}
        mainContainer.last.remove(mainContainer.last.last);
        mainContainer.last.last.skin = greySkin;
        if (fieldList[0].first.first.string != "") {
        	var newLabel = new Label({top:userData[YoUserIndex].top, left:60, height:30, string:userData[YoUserIndex].name, style: contactsStyle, active: true, behavior: yoTapWithConsent});
        	contactsContainer.add(newLabel);
        	var newEdit = new editContainer(userData[YoUserIndex]);
        	newEdit.add(new Picture({top:0, right:0, height:30, width:30, url:editURL}));
        	contactsContainer.add(newEdit);
        	userData[YoUserIndex].label = newLabel;
        }
    }}
});

var plusButtonTap = Object.create(Behavior.prototype,{
    onTouchEnded: {value: function(content){
    	if ((YoUserIndex < 6) && (!editing)) {
    		editing = true;
        	var newContactsBox = new EditContainerTemplate({left: 75});
        	mainContainer.last.last.skin = darkGreySkin;
        	mainContainer.last.add(newContactsBox);
        	newContactsBox.add(new Container({ bottom:8, height:36, left:10, width:72, skin:redSkin, active:true, behavior:cancelButtonBehavior,
        		contents:[
        				new Label({string:"Cancel", style:fieldStyle})
        		]
        	}));
        	newContactsBox.add(new Container({ bottom:8, height:36, right:10, width:72, skin:blueSkin, active:true, behavior:OKButtonBehavior,
        		contents:[
        				new Label({string:"OK", style:fieldStyle})
        		]
        	}));
        	fieldList = [];
        	var currField = new MyField({ top:10, name:"", hintName:"Name..." });
        	fieldList.push(currField);
        	newContactsBox.add(currField);
        	currField = new MyField({ top:50, name:"", hintName:"Window 1 ID..." });
        	fieldList.push(currField);
        	newContactsBox.add(currField);
        }
    }}
});

var plusButton = new Container({top:5, bottom:5, left:310, width:30, skin:whiteSkin, active:true, behavior:plusButtonTap});
plusButton.add(new Picture({top:0, right:0, height:30, width:30, url:plusURL}));

var contactsTitleContainer = new Container({
        top:0, bottom: 370, height: 20, width:400,
        skin:mediumGreySkin,
        contents:[
                contactsTitleLabel,
                plusButton,
        ]
});
 
var contactsContainer = new Container({
        top:40, bottom: 0, height: 400, width:400,
        skin:greySkin,
        contents:[
                alexLabel,
                alexEdit,
                andersLabel,
                andersEdit,
                jennyLabel,
                jennyEdit,
                johnLabel,
                johnEdit,
                mironLabel,
                mironEdit,
        ]
});
 
var yoContainer = new Container({
        top:65, bottom: 60, height: 400, width:400,
        skin:greySkin,
        contents:[
                contactsTitleContainer,
                contactsContainer
        ]
});
 
////////////////////////////////////////////
//
// Tab Bar Buttons
//
///////////////////////////////////////////
 
var brightnessTabImage = new Picture({
        bottom: 5, left: 10, height:50, width:50, url:brightnessImageURL, active:true, behavior: brightnessTap});
var alarmTabImage = new Picture({
        bottom: 5, left: 90, height:50, width:50, url:alarmImageURL, active:true, behavior: alarmTap});
var yoTabImage = new Picture({
        bottom: 5, left: 180, height:50, width:50, url:yoImageURL, active:true, behavior: yoTap});
var drawTabImage = new Picture({
        bottom: 5, left: 265, height:50, width:50, url:drawImageURL, active:true, behavior: drawTap});
 
////////////////////////////////////////////
//
// MAIN CONTAINER
//
////////////////////////////////////////////
 
var mainContainer = new Container({
        left:0, right:0, top:0, bottom:0,
        skin: whiteSkin,
        contents:[
                topBar,
                logo,
                border,
                tabBar,
                brightnessTabImage,
                alarmTabImage,
                yoTabImage,
                drawTabImage,
                //brightnessContainer
        ]
});
 
///////////////////////////////////////////////////////////////////////////////
//@program
/*
  Copyright 2011-2014 Marvell Semiconductor, Inc.
 
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
 
      http://www.apache.org/licenses/LICENSE-2.0
 
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
 
var THEME = require("themes/sample/theme");
var CONTROL = require("mobile/control");
var SCROLLER = require("mobile/scroller");
var MODEL = require("mobile/model");
 
/*
        ASSETS
*/
 
var toolsTexture = new Texture("./assets/tools.png");
var toolsSkin = new Skin({ texture: toolsTexture,  x:0, y:0, width:32, height:32, states:32, variants:32 });
var menuSkin = new Skin({ texture: toolsTexture, x:64, y:0, width:32, height:32, states:32,
        tiles: { left:4, right:0, top:0, bottom:0 },
});
var marksTexture = new Texture("./assets/marks.png");
var marksSkin = new Skin({ texture: marksTexture,  x:0, y:0, width:30, height:30, states:30 });
var sliderBarSkin = new Skin({ texture: marksTexture, x:30, y:0, width:40, height:30, states:30,
        tiles:{ left:10, right:10 }
});
var sliderThumbSkin = new Skin({ texture: marksTexture, x:70, y:0, width:20, height:30, states:30 });
 
var commandStyle = new Style({ font:"bold", size:20, horizontal:"center", color:["white","white","#acd473"] });
var sliderLabelStyle = new Style({ font:"bold", size:14, horizontal:"left", color:["white","white","#acd473"] });
var sliderValueStyle = new Style({ font:"bold", size:14, horizontal:"right", color:["white","white","#acd473"] });
 
/*
        MODEL
*/
 
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
        var components = data.components;
        this.r = components.r;
        this.g = components.g;
        this.b = components.b;
        this.thickness = data.thickness;
        this.x = x;
        this.y = y;
}
ReplayMove.prototype.replay = function(canvas, xmodifier, ymodifier) {
        var data = model.data;
        var components = data.components;
        components.r = this.r;
        components.g = this.g;
        components.b = this.b;
        model.onColorChanged();
        data.thickness = this.thickness;
        model.onThicknessChanged()
        application.distribute("onModelChanged")
        var ctx = canvas.getContext("2d");
        ctx.lineWidth = data.thickness*xmodifier
        ctx.strokeStyle = data.color
        ctx.beginPath();
        ctx.moveTo(this.x*xmodifier, this.y*ymodifier);
}
 
var ApplicationBehavior = function(application, data, context) {
        MODEL.ApplicationBehavior.call(this, application, data, context);
}
ApplicationBehavior.prototype = Object.create(MODEL.ApplicationBehavior.prototype, {
        onDisplayed:  { value: function(application) {
        		application.shared = true;
                application.discover("clarity_pin.app");
        }},
        onQuit:  { value: function(application) {
        		application.shared = false;
                application.forget("clarity_pin.app");
        }},
        doErase: { value: function(application) {
                var canvas = this.data.CANVAS;
                canvas.stop();
                this.replayStack.length = 0;
                this.replayIndex = 0;
                this.replayFlag = false;
                this.backgroundColor = "white";
                var ctx = canvas.getContext("2d");
                ctx.fillStyle = "white"
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                application.distribute("onModelChanged");
        }},
        doPlay: { value: function(application) {
                var canvas = this.data.CANVAS;
                if (this.replayFlag) {
                        canvas.stop();
                        var replayStack = this.replayStack;
                        var c = replayStack.length;
                        var i = this.replayIndex;
                        while (i < c) {
                                replayStack[i].replay(canvas, 1, 1);
                                i++;
                        }
                        this.replayFlag = false;
                        this.replayIndex = 0;
                }
                else {
                        this.replayFlag = true;
                        this.replayIndex = 0;
                        var ctx = canvas.getContext("2d");
                        ctx.fillStyle = "white"
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        canvas.duration = 10;
                        canvas.start();
                }
                application.distribute("onModelChanged");
        }},
        /*doUpdate: { value: function() {
            	trace("pressed\n");
    			application.invoke(new Message(deviceURL + "updateDrawing"), Message.JSON);
    	}},*/
    	doFill: { value: function() {
    			var canvas = this.data.CANVAS;
                var ctx = canvas.getContext("2d");
                ctx.fillStyle = this.data.color;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                this.backgroundColor = this.data.color;
                var replayStack = this.replayStack;
                var c = replayStack.length;
                var i = this.replayIndex;
                while (i < c) {
                	replayStack[i].replay(canvas, 1, 1);
                    i++;
                }
                application.distribute("onModelChanged");
    	}},
    	doSave: { value: function() {
    			var savedBox = new EditContainerTemplate({left:38});
    			var canvas = this.data.CANVAS;
    			var ctx = canvas.getContext("2d");
    			ctx.fillStyle = "gray";
    			ctx.fillRect(0, 0, canvas.width, canvas.height);
    			mainContainer.last.add(savedBox);
    			var nameField = this.nameField = new MyField({ top:10, name:"", hintName:"Drawing Name..." });
    			savedBox.add(nameField);
    			this.replaySavedStack = this.replayStack;
    			this.replaySavedIndex = this.replayIndex;
    			this.mode = "save";
    			savedBox.add(new savedScreen(this.data));
    			savedBox.add(new Container({ bottom:0, height:30, left:0, width:72, skin:redSkin, active:true, behavior:this.cancelButtonBehaviorDraw,
        			contents:[
        				new Label({string:"Cancel", style:fieldStyle})
        			]
        		})),
        		savedBox.add(new Container({ bottom:0, height:30, right:0, width:72, skin:blueSkin, active:true, behavior:OKButtonBehaviorDraw,
        			contents:[
        				new Label({string:"OK", style:fieldStyle})
        			]
        		})),
    	}},
    	doLoad: { value: function() {
    			var loadBox = new EditContainerTemplate({left:38});
    			var canvas = this.data.CANVAS;
    			var ctx = canvas.getContext("2d");
    			ctx.fillStyle = "gray";
    			ctx.fillRect(0, 0, canvas.width, canvas.height);
    			mainContainer.last.add(loadBox);
    			var nameField = this.nameField = new MyField({ top:10, name:this.lastSavedName, hintName:"Drawing Name..." });
    			loadBox.add(nameField);
    			this.replaySavedStack = this.lastSavedStack;
    			this.replaySavedIndex = this.replayIndex;
    			this.mode = "load";
    			loadBox.add(new savedScreen(this.data));
    			loadBox.add(new Container({ bottom:0, height:30, left:0, width:72, skin:redSkin, active:true, behavior:this.cancelButtonBehaviorDraw,
        			contents:[
        				new Label({string:"Cancel", style:fieldStyle})
        			]
        		})),
        		loadBox.add(new Container({ bottom:0, height:30, right:0, width:72, skin:blueSkin, active:true, behavior:this.OKButtonBehaviorLoad,
        			contents:[
        				new Label({string:"OK", style:fieldStyle})
        			]
        		})),
    	}},
        onColorChanged: { value: function() {
                var data = this.data;
                var components = data.components;
                data.color = "rgb(" + components.r + "," + components.g + "," + components.b + ")";
                data.COLOR.skin = new Skin(data.color);
        }},
        onLaunch: { value: function() {
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
                this.backgroundColor = "white";
                this.bgc = "white";
                var drawScreen = this.drawScreen = new Screen(data);
                //application.add(new Screen(data));
                mainContainer.add(drawScreen);
                this.cancelButtonBehaviorDraw = Object.create(Behavior.prototype,{
    				onTouchEnded: {value: function(content){
        				mainContainer.last.remove(mainContainer.last.last);
        				var canvas = model.data.CANVAS;
    					var ctx = canvas.getContext("2d");
    					ctx.fillStyle = model.backgroundColor;
    					ctx.fillRect(0, 0, canvas.width, canvas.height);
        				var replayStack = model.replayStack;
        				var c = replayStack.length;
        				var i = model.replayIndex;
        				while (i < c) {
        					replayStack[i].replay(canvas, 1, 1);
        					i++;
        				}
    				}}
				});
				this.OKButtonBehaviorLoad = Object.create(Behavior.prototype,{
    				onTouchEnded: {value: function(content){
    					model.lastSavedName = model.nameField.first.first.string;
        				mainContainer.last.remove(mainContainer.last.last);
        				var canvas = model.data.CANVAS;
    					var ctx = canvas.getContext("2d");
    					ctx.fillStyle = model.bgc;
    					ctx.fillRect(0, 0, canvas.width, canvas.height);
        				var replayStack = model.lastSavedStack;
        				var c = replayStack.length;
        				var i = model.replayIndex;
        				while (i < c) {
        					replayStack[i].replay(canvas, 1, 1);
        					i++;
        				}
    				}}
				});
        }},
        onThicknessChanged: { value: function() {
                var data = this.data;
                data.COLOR.height = data.thickness;
        }},
});
 
var model = application.behavior = new ApplicationBehavior(application);
 
/*
        SCREEN
*/

var Screen = Container.template(function($) { return {
        //top:65, bottom: 60, height: 400, width:400, active:true,
        top:65, bottom:60, left: 0, right:0, active:true,
        contents: [
                Canvas($, { anchor:"CANVAS", left:0, right:0, top:0, bottom:0, active:true,
                        behavior: Object.create(Behavior.prototype, {
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
                                        /*currX = x;
                                        currY = y;
                                        currColor = "rgb(" + model.data.components.r + "," + model.data.components.g + "," + model.data.components.b + ")";
                                        currThickness = model.data.thickness;
                                        application.invoke(new Message(deviceURL + "moveUpdate"), Message.JSON);*/                                        
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
                                        /*currX = x;
                                        currY = y;
                                        application.invoke(new Message(deviceURL + "lineUpdate"), Message.JSON);*/
                                }},
                        }),
                }),
                //Container($, { left:0, top:0, active:true,
                //        behavior: Object.create(CONTROL.ButtonBehavior.prototype, {
                //                onTap: { value: function(container) {
                //                        application.invoke(new Message("xkpr://shell/close?id=" + application.id));
                //                }},
                //        }),
                //        contents: [
                //                Content($, { skin:toolsSkin, variant:0 }),
                //        ]
                //}),
                Container($, { width:32, right:4, height:32, top:0, active:true,
                        behavior: Object.create(CONTROL.ButtonBehavior.prototype, {
                                onDisplayed: { value: function(container) {
                                        if (!isMenuVisible) {
                                            this.onTap(container);
                                        }
                                }},
                                onTap: { value: function(container) {
                                        if (isMenuVisible)
                                                container.container.run(new MenuTransition, container, container.last.width - 4);
                                        else
                                                container.container.run(new MenuTransition, container, 4 - container.last.width);
                                        isMenuVisible = !isMenuVisible;
                                }},
                        }),
                        contents: [
                                Content($, { skin:toolsSkin, variant:1 }),
                                Layout($, { left:32, top:0, skin:menuSkin,
                                        behavior: Object.create(Behavior.prototype, {
                                                onMeasureHorizontally: { value: function(layout) {
                                                        var size = layout.first.first.measure();
                                                        return size.width + 4;
                                                }},
                                                onMeasureVertically: { value: function(layout) {
                                                        var size = layout.first.first.measure();
                                                        return Math.min(size.height + 4, application.height);
                                                }},
                                        }),
                                        contents: [
                                                SCROLLER.VerticalScroller($, { left:4, clip:true,
                                                contents:[
                                                        Menu($),
                                                        SCROLLER.TopScrollerShadow($),
                                                        SCROLLER.BottomScrollerShadow($),
                                                ]}),
                                        ]
                                }),
                        ]
                }),
        ],
}});

var savedScreen = Container.template(function($) { return {
        //top:65, bottom: 60, height: 400, width:400, active:true,
        top:50, bottom:30, left: 0, right:0, active:true,
        contents: [
                Canvas($, { anchor:"SAVECANVAS", left:0, right:0, top:0, bottom:0, active:true,
                        behavior: Object.create(Behavior.prototype, {
                                onDisplaying: { value: function(canvas) {
                                        var ctx = canvas.getContext("2d");
                                        if (model.mode == "save") {
                                            ctx.fillStyle = model.backgroundColor;
                                        }
                                        if (model.mode == "load") {
                                            ctx.fillStyle = model.bgc;
                                        }
                                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        				canvas.stop();
                        				var replayStack = model.replaySavedStack;
                        				var c = replayStack.length;
                        				var i = model.replaySavedIndex;
                        				while (i < c) {
                                				replayStack[i].replay(canvas, 0.75, 0.66);
                               					i++;
                        				}
                        				model.replaySavedIndex = 0;
                                }},
                                /*onTouchBegan: { value: function(canvas, id, x, y, ticks) {
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
                                }},*/
                        }),
                }),
        ],
}});
                
 
var Menu = Column.template(function($) { return {
        left:0, top:0,
        contents: [
                Container($, { left:0, right:0, height:60,
                        contents: [
                                Container($, { width:42, height: 42, skin: new Skin({ fill:"black" }),
                                        contents: [
                                                Container($, { width:40, height: 40, skin: new Skin({ fill:"white" }),
                                                        contents: [
                                                                Content($, { anchor:"COLOR", width:40, height:$.thickness, skin: new Skin({ fill:$.color }) }),
                                                        ],
                                                }),
                                        ],
                                }),
                        ],
                }),
                MenuSlider({ log: false, min: 0, max: 255, step: 1, title: "Red",
                        getter: function() { return this.components.r; },
                        setter: function(value) { this.components.r = Math.round(value); model.onColorChanged(); },
                }),
                MenuSlider({ log: false, min: 0, max: 255, step: 1, title: "Green",
                        getter: function() { return this.components.g; },
                        setter: function(value) { this.components.g = Math.round(value); model.onColorChanged(); },
                }),
                MenuSlider({ log: false, min: 0, max: 255, step: 1, title: "Blue",
                        getter: function() { return this.components.b; },
                        setter: function(value) { this.components.b = Math.round(value); model.onColorChanged(); },
                }),
                MenuSlider({ log: false, min: 1, max: 20, step: 1, title: "Size",
                        getter: function() { return this.thickness; },
                        setter: function(value) { this.thickness = Math.round(value); model.onThicknessChanged(); },
                }),
                Line($, {
                        left:0, right:0, height:44, active:true,
                        behavior: Object.create(CONTROL.ButtonBehavior.prototype, {
                                onTap: { value: function(line) {
                                        line.bubble("doErase")
                                }},
                        }),
                        contents: [
                                Label($, { left:0, right:0, style:commandStyle, string:"Erase" }),
                        ]
                }),
                /*Line($, {
                        left:0, right:0, height:44, active:true,
                        behavior: Object.create(CONTROL.ButtonBehavior.prototype, {
                                onModelChanged: { value: function(line) {
                                        line.first.string = model.replayFlag ? "Pause" : "Play";
                                }},
                                onTap: { value: function(line) {
                                        line.bubble("doPlay")
                                }},
                        }),
                        contents: [
                                Label($, { left:0, right:0, style:commandStyle, string:"Play" }),
                        ]
                }),*/
                /*Line($, {
                        left:0, right:0, height:44, active:true,
                        behavior: Object.create(CONTROL.ButtonBehavior.prototype, {
                                onTap: { value: function(line) {
                                        line.bubble("doUpdate")
                                }},
                        }),
                        contents: [
                                Label($, { left:0, right:0, style:commandStyle, string:"Update" }),
                        ]
                }),*/
                Line($, {
                        left:0, right:0, height:44, active:true,
                        behavior: Object.create(CONTROL.ButtonBehavior.prototype, {
                                onTap: { value: function(line) {
                                        line.bubble("doFill")
                                }},
                        }),
                        contents: [
                                Label($, { left:0, right:0, style:commandStyle, string:"Fill" }),
                        ]
                }),
                Line($, {
                        left:0, right:0, height:44, active:true,
                        behavior: Object.create(CONTROL.ButtonBehavior.prototype, {
                                onTap: { value: function(line) {
                                        line.bubble("doSave")
                                }},
                        }),
                        contents: [
                                Label($, { left:0, right:0, style:commandStyle, string:"Save" }),
                        ]
                }),
                Line($, {
                        left:0, right:0, height:37, active:true,
                        behavior: Object.create(CONTROL.ButtonBehavior.prototype, {
                                onTap: { value: function(line) {
                                        line.bubble("doLoad")
                                }},
                        }),
                        contents: [
                                Label($, { left:0, right:0, style:commandStyle, string:"Load" }),
                        ]
                }),
        ]
}});
 
var MenuSeparator = Line.template(function($) { return {
        left:0, right:0, active:true,
        contents: [
                Content($, { left:3, right:3, height:1, skin:menuSeparatorSkin }),
        ]
}});
 
var MenuSlider = Container.template(function($) { return {
        left:0, width:120, height:44, active:true,
        behavior: Object.create(Behavior.prototype, {
                changeState: { value: function(container, state) {
                        var content = container.first;
                        while (content) {
                                content.state = state;
                                content = content.next;
                        }
                }},
                onCreate: { value: function(container, data) {
                        this.data = data;
                }},
                onDisplaying: { value: function(container) {
                        this.onModelChanged(container);
                }},
                onFinished: { value: function(container, ticks) {
                        var touch = this.touch;
                        container.captureTouch(touch.id, touch.x, touch.y, ticks);
                        touch.captured = true;
                        this.onTouchMoved(container, touch.id, touch.x, touch.y, ticks);
                }},
                onTouchBegan: { value: function(container, id, x, y, ticks) {
                        this.touch = { captured: false, id: id, x: x, y: y };
                        container.duration = 250;
                        container.time = 0;
                        container.start();
                        this.changeState(container, 2);
                }},
                onTouchCancelled: { value: function(container, id, x, y, ticks) {
                        container.stop();
                        this.changeState(container, 1);
                }},
                onTouchEnded: { value: function(container, id, x, y, ticks) {
                        var touch = this.touch;
                        if ((!touch.captured)) {
                                container.stop();
                                touch.captured = true;
                                this.onTouchMoved(container, id, x, y, ticks);
                        }
                        this.changeState(container, 1);
                }},
                onTouchMoved: { value: function(container, id, x, y, ticks) {
                        var touch = this.touch;
                        if ((!touch.captured) && (Math.abs(x - touch.x) > 8)) {
                                container.stop();
                                container.captureTouch(id, x, y, ticks);
                                touch.captured = true;
                        }
                        if (touch.captured) {
                                var thumb = container.last;
                                var bar = thumb.previous;
                                var value = this.offsetToValue(x - bar.x - (thumb.width >> 1), bar.width - thumb.width);
                                this.data.setter.call(model.data, value);
                                this.onModelChanged(container);
                        }
                }},
                offsetToValue: { value: function(offset, size) {
                        var data = this.data;
                        var result;
                        if (data.log) {
                          var minv = Math.log(data.min);
                          var maxv = Math.log(data.max);
                          result = Math.exp(minv + (offset * (maxv - minv) / size));
                        }
                        else
                                result = data.min + ((offset * (data.max - data.min)) / size);
                        if (result < data.min)
                                result = data.min;
                        else if (result > data.max)
                                result = data.max;
                        return result;
                }},
                onModelChanged: { value: function(container) {
                        var thumb = container.last;
                        var bar = thumb.previous;
                        var data = this.data;
                        var value = data.getter.call(model.data);
                        thumb.x = bar.x + this.valueToOffset(value, bar.width - thumb.width);
                        if (data.step >= 1.0)
                                container.first.next.string = Math.round(value).toString();
                        else {
                                var numStr = value.toString();
                                var index = numStr.lastIndexOf(".");
                                if (index >= 0)
                                        numStr = numStr.slice(0, index + 2);
                                container.first.next.string = numStr;
                        }
                }},
                valueToOffset: { value: function(value, size) {
                        var data = this.data;
                        var result;
                        if (data.log) {
                                var minv = Math.log(data.min);
                                var maxv = Math.log(data.max);
                                result = Math.round(((Math.log(value) - minv) * size) / (maxv - minv));
                        }
                        else
                                result = Math.round(((value - data.min) * size) / (data.max - data.min));
                        return result;
                }},
        }),
        contents: [
                Label($, { left:10, right:0, top:4, height:20, style:sliderLabelStyle, string:$.title, }),
                Label($, { left:0, right:10, top:4, height:20, style:sliderValueStyle, }),
                Content($, { left:0, right:0, top:18, skin:sliderBarSkin, }),
                Content($, { left:10, top:18, skin:sliderThumbSkin, }),
        ]
}});
 
/*
        TRANSITIONS
*/
 
var MenuTransition = function() {
        Transition.call(this, 250);
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
                this.menuLayer.translation = this.toolLayer.translation = { x: this.delta * fraction };
        }}
});
 
 
///////////////////////////////////////////////////////////////////////////////
//application.behavior = new connectionApplicationBehavior();

isMenuVisible = false;
var editing = false;
var YoTopIndex = 225;
var YoUserIndex = 4;
currX = 0;
currY = 0;
currColor = "";
currThickness = 0;
yoThere = 0;
application.add(mainContainer);
