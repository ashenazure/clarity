// KPR Script file
//Skins
var whiteSkin = new Skin( { fill:"white" } );
var tealSkin = new Skin ( { fill:"#65D9D3" } );


// Top Bar and logo
var logo = new Picture({
	top: -35, height:150, width:250, url:"http://i.imgur.com/kot0tAK.png"});
var topBar = new Content({
	top:0, height: 65, width: 400,
	skin: tealSkin
});


// Main Container
var mainContainer = new Container({
	left:0, right:0, top:0, bottom:0,
	skin: whiteSkin,
	contents:[
		topBar,
		logo,
	]
});

application.add(mainContainer);