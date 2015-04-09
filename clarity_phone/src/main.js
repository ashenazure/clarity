// KPR Script file
//Skins and theme
var whiteSkin = new Skin( { fill:"white" } );
var tealSkin = new Skin ( { fill:"#65D9D3" } );
var greySkin = new Skin( { fill:"#F6F6F6" } );
var darkGreySkin = new Skin( { fill:"#979797" });
var THEME = require('themes/flat/theme');
var SLIDERS = require('controls/sliders');

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

var brightnessBox = new Container({
    left:0, right:0, top:100, bottom:0,
    skin:whiteSkin,
});

var brightnessTap = Object.create(Behavior.prototype,{
    onTouchBegan: {value: function(content){
        mainContainer.add(brightnessContainer);
        brightnessContainer.add(brightnessBox);
    }}
});

// TODO NOT SURE HOW TO MAKE THESE INTO BUTTONS UGHHH
var brightnessTabImage = new Picture({
	bottom: 5, left: 10, height:50, width:50, url:brightnessImageURL, active:true, behavior: brightnessTap});
var alarmTabImage = new Picture({
	bottom: 5, left: 90, height:50, width:50, url:alarmImageURL});
var yoTabImage = new Picture({
	bottom: 5, left: 180, height:50, width:50, url:yoImageURL});
var drawTabImage = new Picture({
	bottom: 5, left: 265, height:50, width:50, url:drawImageURL});


// BrightnessContainer and contents
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
	contents:[
		slider
	]
});


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
		drawTabImage
	]
});

application.add(mainContainer);