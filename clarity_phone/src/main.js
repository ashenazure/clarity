// KPR Script file
//Skins and theme
var whiteSkin = new Skin( { fill:"white" } );
var tealSkin = new Skin ( { fill:"#65D9D3" } );
var greySkin = new Skin( { fill:"#F6F6F6" } );
var darkGreySkin = new Skin( { fill:"#979797" });
var THEME = require('themes/flat/theme');
var SLIDERS = require('controls/sliders');
var SCROLLER = require('mobile/scroller');
var SWITCHES = require('controls/switch');

///////////////////
// Device Handling
///////////////////

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

var ApplicationBehavior = Behavior.template({
	onDisplayed: function(application) {
		application.discover("clarity_pin.app");
	},
	onQuit: function(application) {
		application.forget("clarity_pin.app");
	},
})

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
//					Brightness container and content
//
/////////////////////////////////////////////////////////////////////
var brightnessBox = new Container({
    left:0, right:0, top:100, bottom:0,
    skin:whiteSkin,
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
var slider = new BrightnessSlider({ min:0, max:100, value:50,  });
var brightnessContainer = new Container({
	top:65, bottom: 60, height: 400, width:400,
	skin:whiteSkin,
	name: "container",
	contents:[
		slider,
		brightnessBox
	]
});


/////////////////////////////////////////////////////////////////////
//
//					Alarm Container
//
//
//			Note to do: everytime clock is changed; update the pin simulator and send the appropriate message
//			Assuming its "on" of course	
//
/////////////////////////////////////////////////////////////////////
var alarmTap = Object.create(Behavior.prototype,{
    onTouchBegan: {value: function(content){
    	mainContainer.remove(mainContainer.last);
        mainContainer.add(alarmContainer);
    }}
});
var alarmStyle = new Style( { font: "bold 40px", color:"gray" } );
var alarmLabel = new Label({top: 30, left:0, right: 0, height:60, string:"Alarm", style: alarmStyle});

var clockStyle = new Style( { font: "bold 50px", color:"black" } );
var hour = 1;
var hourLabel = new Label({top: 150, left:133,height:50, string:"0" + hour, style: clockStyle});
var hourIncreaseTap = Object.create(Behavior.prototype,{
    onTouchBegan: {value: function(content){
		if(hour < 24) {
		    content.invoke(new Message(deviceURL + "hourUp"), Message.JSON);
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
		    content.invoke(new Message(deviceURL + "hourDown"), Message.JSON);
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
		    content.invoke(new Message(deviceURL + "minuteUp"), Message.JSON);
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
		    content.invoke(new Message(deviceURL + "minuteDown"), Message.JSON);
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

var alarmSwitch = new alarmSwitchTemplate({ value: 1 });
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

////////////////////////////////////////////
// Tab Bar Buttons
//
///////////////////////////////////////////
var brightnessTabImage = new Picture({
	bottom: 5, left: 10, height:50, width:50, url:brightnessImageURL, active:true, behavior: brightnessTap});
var alarmTabImage = new Picture({
	bottom: 5, left: 90, height:50, width:50, url:alarmImageURL, active:true, behavior: alarmTap});
var yoTabImage = new Picture({
	bottom: 5, left: 180, height:50, width:50, url:yoImageURL});
var drawTabImage = new Picture({
	bottom: 5, left: 265, height:50, width:50, url:drawImageURL});

////////////////////////////////////////////
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
		brightnessContainer
	]
});

application.behavior = new ApplicationBehavior();

application.add(mainContainer);