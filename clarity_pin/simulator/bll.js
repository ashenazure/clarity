//@module
var PinsSimulators = require('PinsSimulators');

exports.pins = {
	// Define the types of pins used by this BLL
	brightness: { type: "A2D" },
}

var configure = exports.configure = function(configuration) {
	this.pinsSimulator = shell.delegate("addSimulatorPart", {
			header : { 
				label : "Features", 
				name : "Analog Input", 
				iconVariant : PinsSimulators.SENSOR_KNOB 
			},
			axes : [
				new PinsSimulators.AnalogInputAxisDescription(
					{
						valueLabel : "Brightness",
						valueID : "brightness",
						defaultControl : PinsSimulators.SLIDER,
					}
				),
			]
		});
}

exports.close = function() {
	// Close the objects used to communicate with the pins
	shell.delegate("removeSimulatorPart", this.pinsSimulator);
}

exports.read = function() {
	return this.pinsSimulator.delegate("getValue");
}