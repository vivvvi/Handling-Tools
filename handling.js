   var baseHandlingV = `<?xml version="1.0" encoding="UTF-8"?>
<CHandlingDataMgr>
  <HandlingData>
  <Item type="CHandlingData">
      <handlingName></handlingName>
      <fMass value="1500.000000" />
      <fInitialDragCoeff value="8.000000" />
      <fDownforceModifier value="0" />
      <fPercentSubmerged value="85.000000" />
      <vecCentreOfMassOffset x="0.000000" y="0.00000" z="0.000000" />
      <vecInertiaMultiplier x="1.400000" y="1.400000" z="1.600000" />
      <fDriveBiasFront value="0.000000" />
      <nInitialDriveGears value="6" />
      <fInitialDriveForce value="0.2000" />
      <fDriveInertia value="1.00000" />
      <fClutchChangeRateScaleUpShift value="2.00000" />
      <fClutchChangeRateScaleDownShift value="2.00000" />
      <fInitialDriveMaxFlatVel value="140.000000" />
      <fBrakeForce value="0.400000" />
      <fBrakeBiasFront value="0.60000" />
      <fHandBrakeForce value="0.60000" />
      <fSteeringLock value="35.000000" />
      <fTractionCurveMax value="2.300" />
      <fTractionCurveMin value="2.000" />
      <fTractionCurveLateral value="22.500000" />
      <fTractionSpringDeltaMax value="0.150000" />
      <fLowSpeedTractionLossMult value="0.500000" />
      <fCamberStiffnesss value="0.000000" />
      <fTractionBiasFront value="0.5000" />
      <fTractionLossMult value="1.000000" />
      <fSuspensionForce value="3.0000" />
      <fSuspensionCompDamp value="1.400000" />
      <fSuspensionReboundDamp value="1.400000" />
      <fSuspensionUpperLimit value="0.0750000" />
      <fSuspensionLowerLimit value="-0.0750000" />
      <fSuspensionRaise value="0.000000" />
      <fSuspensionBiasFront value="0.50000" />
      <fAntiRollBarForce value="0.450000" />
      <fAntiRollBarBiasFront value="0.500000" />
      <fRollCentreHeightFront value="0.30000" />
      <fRollCentreHeightRear value="0.30000" />
      <fCollisionDamageMult value="1.0000" />
      <fWeaponDamageMult value="1.000000" />
      <fDeformationDamageMult value="1.000000" />
      <fEngineDamageMult value="1.500000" />
      <fPetrolTankVolume value="65.000000" />
      <fOilVolume value="5.000000" />
      <fSeatOffsetDistX value="0.000000" />
      <fSeatOffsetDistY value="0.000000" />
      <fSeatOffsetDistZ value="0.000000" />
      <nMonetaryValue value="35000" />
      <strModelFlags>440010</strModelFlags>
      <strHandlingFlags>20000</strHandlingFlags>
      <strDamageFlags>0</strDamageFlags>
      <AIHandling>AVERAGE</AIHandling>
      <SubHandlingData>
        <Item type="NULL" />
        <Item type="NULL" />
        <Item type="NULL" />
      </SubHandlingData>
    </Item>
  </HandlingData>
</CHandlingDataMgr>`;


	// debug log color styles
	var c = { 
		val:    'color: yellow;background: black;  font-weight:bold;',
		ttext:  'color: yellow;background: blue;', 
		tvalue:	'color: white; background: orange; font-weight: bold;',
		bgreen: 'color: white; background: green;  font-weight: bold;',
		bpurple:'color: white; background: purple; font-weight: bold;',


	};


	var kmtomiles = 0.6213712; // multiply with kms to get miles
	var milestokm = 1.609344;  // multiply with miles to get kms

	var handlingFile = null;
    var rawInput = document.getElementById("handlingFileDisplay");

    rawInput.value = baseHandlingV;


    var handlingArray = {
        handling: {

        }
    }
    var comparisonHandlingArray = {
        handling: {

        }
    }
    //File save
    function UpdateFileObject() {
        var a = document.getElementById("savefile");
        var text = rawInput.value; //handlingFile.getElementsByTagName("CHandlingDataMgr")[0];
        var file = new Blob([text], { type: "text/xml" });

        a.href = URL.createObjectURL(file);
        a.download = "handling.meta";
    }
















//File load
var input = document.getElementById("handlingFileLoader");
input.addEventListener("change", function () {
    if (this.files && this.files[0]) {

		// we need to zero undefined values
		handlingArray.handling = {};


        var myFile = this.files[0];
        var reader = new FileReader();
        reader.addEventListener('load', function (e) {
            // Parse the document. Copy all values in the document onto the sliders/inputs on the page
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(e.target.result, "text/xml");

            xmlDoc.getElementsByTagName("Item")[0].childNodes.forEach(element => {
                if (element.attributes) {
                    let debugInfo = {
                        elementName: element.nodeName,
                        attributes: {}
                    };

                    // Convert attributes to an object
                    const attributesObject = Array.from(element.attributes).reduce((obj, attr) => {
                        obj[attr.name] = parseFloat(attr.value) || attr.value;
                        return obj;
                    }, {});

                    debugInfo.attributes = attributesObject;

                    // Look for X, Y, Z attributes
                    if ('x' in attributesObject && 'y' in attributesObject && 'z' in attributesObject) {
                        const x = parseFloat(attributesObject['x']) || 0;
                        const y = parseFloat(attributesObject['y']) || 0;
                        const z = parseFloat(attributesObject['z']) || 0;

                        // Store X, Y, Z in the handling array
                        handlingArray.handling[element.nodeName] = { X: x, Y: y, Z: z };

                        // Populate sliders/inputs for X, Y, Z
                        const xSlider = document.getElementById(`d_${element.nodeName}XSlider`);
                        const xInput = document.getElementById(`d_${element.nodeName}XInput`);
                        if (xSlider) xSlider.value = x;
                        if (xInput) xInput.value = x;

                        const ySlider = document.getElementById(`d_${element.nodeName}YSlider`);
                        const yInput = document.getElementById(`d_${element.nodeName}YInput`);
                        if (ySlider) ySlider.value = y;
                        if (yInput) yInput.value = y;

                        const zSlider = document.getElementById(`d_${element.nodeName}ZSlider`);
                        const zInput = document.getElementById(`d_${element.nodeName}ZInput`);
                        if (zSlider) zSlider.value = z;
                        if (zInput) zInput.value = z;

                        debugInfo.x = x;
                        debugInfo.y = y;
                        debugInfo.z = z;

                        console.log(`%c${element.nodeName}%c (%carray%c): %cX:${x}, Y:${y}, Z:${z}`, c.bgreen, '', c.bpurple, '', c.val, debugInfo);
                    } 
                    
                    else {
                        // Handle single-value elements (with value attribute)
                        if ('value' in attributesObject) {
                            const rawValue = parseFloat(attributesObject['value']) || attributesObject['value'];

                            // Update handling array
                            handlingArray.handling[element.nodeName] = rawValue;

                            // Populate slider/input
                            const slider = document.getElementById(`${element.nodeName}Slider`);
                            const input = document.getElementById(`${element.nodeName}Input`);
                            if (slider) slider.value = rawValue;
                            if (input) input.value = rawValue;


                            debugInfo.value = rawValue;
                            console.log(`%c${element.nodeName}%c (%cvalue%c): %c${rawValue}`, c.bgreen, '', c.tvalue, '', c.val );

                        }

                        // Handle child nodes (e.g., text content)
                        if (typeof element.childNodes[0] !== 'undefined' && element.childNodes[0].nodeValue.trim()) {
                            const textValue = element.childNodes[0].nodeValue.trim();

							const flag = $(`#${element.nodeName}.flagHexval`);
							if (flag.length) {

								// "strThisIsAFlagName" -> "thisIsAFlagName"
								var flagName = element.nodeName.replace(/^str(.)(.*)$/, (match, firstChar, rest) => firstChar.toLowerCase() + rest);

								//console.log(`flagName:${flagName} %c#${element.nodeName}.flagHexval`,'color:purple;', flag);
								//console.log(`%csetFlagState('${flagName}', '${textValue}')`, 'background:blue;color:yellow;font-weigh:bold;');

								//setFlagState('modelFlags', '00000880');
								setFlagState(flagName, textValue)
							}

							handlingArray.handling[element.nodeName] = textValue;

                            debugInfo.textContent = textValue;
                            console.log(`%c${element.nodeName}%c (%ctext%c): %c${textValue}`, c.bgreen, '', c.ttext, '', c.val );
 
                        }
                    }

                    //console.log(`%cDebug Info for ${element.nodeName}`, 'color: yellow; background: black; font-weight: bold;');
                    //console.log(debugInfo);
                }
            });

            UpdateCharts();
            console.log(handlingArray.handling);

            // Copy the file's raw content to the raw input. We will do all our edits there.
            rawInput.value = e.target.result;
					applyValueChange();
					updateArrayPre();

					UpdateExplanations(e);

        });

        reader.readAsText(myFile);
        $.notify("File loaded.", "success");
    }
});





























    //File load
    var input = document.getElementById("compparisonHandlingFileLoader");
    input.addEventListener("change", function () {
        if (this.files && this.files[0]) {

            var myFile = this.files[0];
            var reader = new FileReader();
            reader.addEventListener('load', function (e) {
                //Parse the document. Copy all values in the document on to the sliders/inputs in the page
                parser = new DOMParser();
                xmlDoc = parser.parseFromString(e.target.result, "text/xml");

//console.log(xml->, xmlDoc.getElementsByTagName("handlingName")[0].childNodes[0].data );

				
				xmlDoc.getElementsByTagName("Item")[0].childNodes.forEach(element => {
                    if (element.attributes) {
                        var d = element.attributes[0];

						if( typeof element.childNodes[0] !== 'undefined' && $(element.childNodes[0])[0].nodeValue.trim() ){ 

							console.log(`xml->(+ typeof $(element.childNodes[0])[0].nodeValue + ): `, element.nodeName,  $(element.childNodes[0])[0].nodeValue );
							comparisonHandlingArray.handling[element.nodeName] = $(element.childNodes[0])[0].nodeValue;
						}

						
						if (d != null) {
                            var sld = document.getElementById(element.nodeName + "Slider");
                            if (sld != null) sld.value = d.value;
                            var input = document.getElementById(element.nodeName + "Input");
                            if (input != null) {
                                input.value = d.value;
                                UpdateExplanations(input);
                            }
                            comparisonHandlingArray.handling[element.nodeName] = d.value;
                            updateArrayPre();
                            
                            $("#wEmptyFile").toggleClass("d-none", true);
                        }

                    }
                });
				
				UpdateCharts();

				console.log(comparisonHandlingArray.handling);
                //Copy the file's raw content to the raw input. We will do all our edits there.
                rawInput.value = e.target.result;
            });
            reader.readAsText(myFile);
            $.notify("File loaded.", "success");
        }
    });




















    //Other




// Replace the values in the rawInput textarea (the XML file in the textbox).
// This textarea holds the data we will provide when saving the file.
function replaceHandlingAttr(tagName, attrName, newValue) {

    if (!rawInput || !rawInput.value) {
        console.error('rawInput is not defined or empty.');
        return;
    }

    var reg;

    // If we're working with x, y, z attributes, they should be updated within the tag.
    if (['x', 'y', 'z'].includes(attrName)) {
        // Regex to match tags like: <vecCentreOfMassOffset x="0.000000" y="0.000000" z="0.000000" />
        reg = new RegExp(`(<${tagName}[^>]*\\s${attrName}=")([a-zA-Z0-9.-]+)(")`, 'i');
    } 
    else if (attrName === 'value') {
        // Regex for attributes like: <fMass value="1500.000000" />
        reg = new RegExp(`(<${tagName}[^>]*\\s${attrName}=")([a-zA-Z0-9.-]+)(")`, 'i');
    } 
    else if (attrName === 'string') {
        // New improved regex to match the value inside a tag like <modelFlags>value</modelFlags>
        reg = new RegExp(`(<${tagName}\\b[^>]*>)([\\s\\S]*?)(</${tagName}>)`, 'i');
    } 
    else {
        console.error(`Unsupported attribute name: ${attrName}`);
        return;
    }

    const match = rawInput.value.match(reg);
    if (!match) {
        console.warn(`No match found for tag: <${tagName}> with attribute: [${attrName}]`);
        console.log('--- Current rawInput value ---');
        console.log(rawInput.value);
        console.log('--- Regex used ---');
        console.log(reg);
        return;
    }

    console.log(`%c[BEFORE] %c${match[0]}`, 'color: orange; font-weight: bold;', '');

    // Replace the matched value with the new value
    const result = rawInput.value.replace(reg, `$1${newValue}$3`);
    
    // Check if the replacement was successful
    if (result === rawInput.value) {
        console.warn(`No match found for tag: <${tagName}> with attribute: [${attrName}]`);
    } else {
        //console.log('%c[AFTER]', 'color: green; font-weight: bold;', result);
        console.log(`%cUpdated <${tagName}> [${attrName}] to ${newValue}`, 'color: green; font-weight: bold;');
        rawInput.value = result;
    }
}




	// applyValueChange() with no arguments updates all inputs ids, ending in 'Input'. 
	// added support to change ALL INPUT fields IDs matching /Input$/ then running the applyValueChange(input) with input = document.getElementById( matchedEl ) 
	// this could be more targetted using class or data- attributes. 
    function applyValueChange(e, type) {

		if (e == null){

			$('input').each(function (i,v){

				var matchesInput = v.id.match(/Input$/);
				if( matchesInput ){
					console.log( v.id ); // or matchesInput.input );
					var input = document.getElementById(v.id);
					applyValueChange( input  );
				}
				//console.log(i,v.id);
				
			});

		}else{
		  AVChange(e, type);
		}
	}




    //Applies the change to the array, and looks for its html counterpart (Slider/Input). 
    //Also applies a the change to them, to keep parity.
    function AVChange(e, type) {

		if (type == null) type = "value";
		if (rawInput.value.length < 1000) {
			$("#wEmptyFile").toggleClass("d-none", false);
			return;
		} else {
			$("#wEmptyFile").toggleClass("d-none", true);
		}

		// Identify the axis (X, Y, Z) for vecCentreOfMassOffset or vecInertiaMultiplier
		const attributeName = e.name; // e.g. vecCentreOfMassOffsetX, vecCentreOfMassOffsetY, vecCentreOfMassOffsetZ
		const isXYZ = attributeName.match(/(X|Y|Z)$/); // Check if it's X, Y, or Z attribute
		if (isXYZ) {
			// Handle X, Y, Z attributes like vecCentreOfMassOffsetX, vecInertiaMultiplierX
			const baseName = attributeName.replace(/X|Y|Z/g, ''); // Remove X, Y, Z to get vecCentreOfMassOffset or vecInertiaMultiplier
			const axis = attributeName.slice(-1).toLowerCase(); // Get 'x', 'y', or 'z'

			// Update handlingArray for x, y, or z under baseName
			if (!handlingArray.handling[baseName]) handlingArray.handling[baseName] = { x: "0.000000", y: "0.000000", z: "0.000000" };
			handlingArray.handling[baseName][axis] = e.value;

			// Update the XML (rawInput)
			replaceHandlingAttr(baseName, axis, e.value);

			// console.log(`%cUpdated ${baseName} [${axis}] to ${e.value}`, 'color: yellow; font-weight: bold;');
		} else {
			// Handle normal value attributes like fMass, fBrakeForce, etc.
			handlingArray.handling[attributeName] = e.value;

			// Update the XML (rawInput)
			replaceHandlingAttr(attributeName, 'value', e.value);

			console.log(`%cUpdated ${attributeName} [value] to ${e.value}`, 'color: lightblue; font-weight: bold;');
		}


		// Sync range and input fields
		const input = document.getElementById(e.id.includes('Slider') ? e.id.replace('Slider', 'Input') : e.id.replace('Input', 'Slider'));
		if (input) input.value = e.value;

		updateArrayPre();
		UpdateCharts();
		UpdateExplanations(e);
	}
















    function UpdateExplanations(e) {


        var expl = document.getElementById(e.name + "Expl");
        if (expl != null) {
            if (e.name == "fClutchChangeRateScaleUpShift") {
                expl.innerHTML = Math.round((1 / e.value) * 1000) / 1000;
            }
            if (e.name == "fDriveInertia") {
                expl.innerHTML = Math.round((1 / e.value) * 100) / 100;
            }
            if (e.name == "fInitialDriveForce") {
                expl.innerHTML = Math.round((((e.value * gearRatios[1]) * 9.8) / 0.44704) * 100) / 100;
            }
            if (e.name == "fBrakeForce") {
                var decc = (e.value) * 9.8; //ms^2
                expl.innerHTML = Math.round(((60 * 0.44704) / (decc * 4)) * 100) / 100;
            }
            if (e.name == "fBrakeBiasFront") {
                var balance = (e.value);
                var result = Math.round((e.value) * 100) + "% Front - " + Math.round((1 - e.value) * 100) + "% Rear";

                expl.innerHTML = result;
            }
            if (e.name == "fTractionBiasFront") {
                var balance = (e.value);
                var grip = handlingArray.handling.fTractionCurveMax;
                var gripFront = Math.round((grip * e.value) * 100) / 100;
                var gripRear = Math.round((grip * (1 - e.value)) * 100) / 100;
                var result = gripFront + " Gs Front <br> " + gripRear + " Gs Rear";

                expl.innerHTML = result;
            }

            if (e.name == "fDownforceModifier") {
                expl.innerHTML = GetDownforceGs(60 * milestokm, e.value);// Math.round((((Math.sqrt(27)) * e.value) * 0.01) * 100) / 100;

				$("#fDownforceModifier2Expl").text( GetDownforceGs(100 , e.value) );
            }
            if (e.name == "fInitialDragCoeff") {
                expl.innerHTML = GetDragCoeffGs(53, e.value);
            }
            if (e.name == "fInitialDriveMaxFlatVel") {

				var topSpeedKph = Math.round((e.value / 0.75 ) * 100) / 100;
				var topSpeedMph = Math.round((topSpeedKph * kmtomiles));

                expl.innerHTML = topSpeedMph;
				
				$('#fInitialDriveMaxFlatVelExplKm').text(topSpeedKph);
				//console.log( () + " kph");
            }


        }

		
        if (typeof handlingArray.handling.fInitialDriveMaxFlatVel !== 'undefined' && e.id == 'fBrakeForceInput' ) {
            if (handlingArray.handling.fInitialDriveForce) {
                var power = handlingArray.handling.fInitialDriveForce;
                var topspeed = (handlingArray.handling.fInitialDriveMaxFlatVel / 0.75) / 3.6; //to m/s halved


				var topspeedkph=(topspeed*kmtomiles);
				console.log(`fInitialDriveMaxFlatVel: ${handlingArray.handling.fInitialDriveMaxFlatVel}, %ctopspeed%c: ${topspeed}mph, ${topspeedkph}kph`, 'background:red;color:white;font-weight:bold;', '', e.id, e.value )
                var drag = handlingArray.handling.fInitialDragCoeff;
                var gearings = gearShiftPoints[handlingArray.handling.nInitialDriveGears];
                var spd = 0;


                //console.log(topspeed +"m/s")
                while (spd < topspeed * 2) {

                    spd += 2;
                    var percent = (spd * 100) / topspeed;


                    var gear = 0;
                    while (percent > gearings[gear]) gear++;




                    var torque = Math.round((power * gearRatios[handlingArray.handling.nInitialDriveGears][gear]) * 1000) / 1000;
                    var dragNow = Math.round(((Math.sqrt(spd / 5) / 100) * drag) * 1000) / 1000;


                    //console.log(spd + " m/s at x" + gear + "º  - torque: " + torque + " drag " + dragNow + "");
                    if (torque < dragNow + 0.01) {
                        //var info = "This car peaks at " + spd + "m/s - " + gear + "/" + gearings.length;
                        var info = Math.round((spd / 0.44704) * 10) / 10;

                        var dragExp = document.getElementById("TopSpeedExpl");
                        if (dragExp != null) dragExp.innerHTML = info;
                        break;
                    }


                    //console.log(gearings.findIndex(percent)+"d");
                }

            }
        }
    }
    function GetDragCoeffGs(ms, mod) {
        return Math.round(Math.exp(ms * (mod * 0.001)) * 1000) / 1000;
    }
    function GetDownforceGs(ms, mod) {

        //Standard
        var speedmod = map(ms, 0, handlingArray.handling.fInitialDriveMaxFlatVel * 0.9, 0, (0.035 * mod));

        if (ms > handlingArray.handling.fInitialDriveMaxFlatVel * 0.9) speedmod = (0.035 * mod);
        var r = speedmod;


        //Minimum
        if (mod <= 1.00) r = 0.035;

        //New Downforce
        if (mod > 100) r = 0.0105;

        return Math.round(r * 4 * 1000) / 1000;
    }
    function map(x, in_min, in_max, out_min, out_max) {

        return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }
    function round(number, decimals = 1) {
        if (decimals <= 0) return Math.round(number);
        else return Math.round(number * (10 * decimals)) / (10 * decimals);
    }
    function updateArrayPre() {
        document.getElementById("handlingArray").innerHTML = JSON.stringify(handlingArray, undefined, 2);
    }
	function assignChartLabel(e) {

		//???//

		var ctxChartID = $(e)[0].ctx.canvas.id;

		// Assign label for "Your Car <handlingName>"
		e.config.data.datasets[0].label = 'Your Car: ' + handlingArray.handling.handlingName;
		//console.log(`%c${ctxChartID}.config.data.datasets[0].label%c:`, 'color:yellow;background:green;font-weight:bold;', '', e.config.data.datasets[0].label );

		// Assign label for "Comparison <handlingName>"
		e.config.data.datasets[1].label = 'Comparison: ' + comparisonHandlingArray.handling.handlingName;
		//console.log(`%c${ctxChartID}.config.data.datasets[1].label%c:`, 'color:yellow;background:green;font-weight:bold;', '', e.config.data.datasets[1].label);
	}


    function UpdateCharts() {

        //Torque Chart
        var power = handlingArray.handling.fInitialDriveForce;
        var gears = handlingArray.handling.nInitialDriveGears;
        for (var i = 1; i < 10; i++) chartPower.data.datasets[0].data[i] = 0;
        for (var i = 0; i < gears; i++) {
            chartPower.data.datasets[0].data[i] = round(((power * gearRatios[handlingArray.handling.nInitialDriveGears][i])), 2);
        }
        var power = comparisonHandlingArray.handling.fInitialDriveForce;
        var gears = comparisonHandlingArray.handling.nInitialDriveGears;
        for (var i = 1; i < 10; i++) chartPower.data.datasets[1].data[i] = 0;
        for (var i = 0; i < gears; i++) {
            chartPower.data.datasets[1].data[i] = round(((power * gearRatios[comparisonHandlingArray.handling.nInitialDriveGears][i])), 2);
        }
		assignChartLabel(chartPower);

        //Drag Chart
        var i = 0;
        while (i < chartAirDrag.data.labels.length) {
            chartAirDrag.data.datasets[0].data[i] = GetDragCoeffGs(chartAirDrag.data.labels[i] * 0.447, handlingArray.handling.fInitialDragCoeff);
            i++;
        }
        var i = 0;
        while (i < chartAirDrag.data.labels.length) {
            chartAirDrag.data.datasets[1].data[i] = GetDragCoeffGs(chartAirDrag.data.labels[i] * 0.447, comparisonHandlingArray.handling.fInitialDragCoeff);
            i++;
        }
		assignChartLabel(chartAirDrag, );

        //Downforce
        var i = 0;
        while (i < chartDownforce.data.labels.length) {
            chartDownforce.data.datasets[0].data[i] = GetDownforceGs(chartDownforce.data.labels[i] * kmtomiles, handlingArray.handling.fDownforceModifier);
            i++;
        }
        var i = 0;
        while (i < chartDownforce.data.labels.length) {
            chartDownforce.data.datasets[1].data[i] = GetDownforceGs(chartDownforce.data.labels[i] * kmtomiles, comparisonHandlingArray.handling.fDownforceModifier);
            i++;
        }
		assignChartLabel(chartDownforce);


        chartStats.data.datasets[0].data[0] = round(map(handlingArray.handling.fInitialDriveForce, 0, 0.5, 0, 500), 1)/2;
        chartStats.data.datasets[0].data[1] = round(map((handlingArray.handling.fInitialDriveMaxFlatVel / 0.75 * milestokm), 0, 200, 0, 200), 1);
        chartStats.data.datasets[0].data[3] = round(map(handlingArray.handling.fTractionCurveMax, 0, 3, 0, 300, 1));
        chartStats.data.datasets[0].data[2] = round(map(handlingArray.handling.fBrakeForce, 0, 1, 0, 100), 1)*2;
        chartStats.data.datasets[0].data[4] = round(map(GetDownforceGs(chartStats.data.datasets[0].data[1] * kmtomiles, handlingArray.handling.fDownforceModifier), 0, 0.5, 0, 50), 2)*4;


        chartStats.data.datasets[1].data[0] = round(map(comparisonHandlingArray.handling.fInitialDriveForce, 0, 0.5, 0, 500), 1)/2;
        chartStats.data.datasets[1].data[1] = round(map((comparisonHandlingArray.handling.fInitialDriveMaxFlatVel / 0.75 * milestokm), 0, 200, 0, 200), 1);
        chartStats.data.datasets[1].data[3] = round(map(comparisonHandlingArray.handling.fTractionCurveMax, 0, 3, 0, 300, 1));
        chartStats.data.datasets[1].data[2] = round(map(comparisonHandlingArray.handling.fBrakeForce, 0, 1, 0, 100), 1)*2;
        chartStats.data.datasets[1].data[4] = round(map(GetDownforceGs(chartStats.data.datasets[1].data[1] * kmtomiles, comparisonHandlingArray.handling.fDownforceModifier), 0, 0.5, 0, 50), 2)*4;


        var sum = 0;
        chartStats.data.datasets[0].data.forEach(e => sum += e)
        chartPerformanceIndex.data.datasets[0].data[0] = round(sum);
        document.getElementById("currentPrice").innerHTML = round(GetPrice(sum));

		assignChartLabel(chartStats);



        sum = 0;
        chartStats.data.datasets[1].data.forEach(e => sum += e)
        chartPerformanceIndex.data.datasets[1].data[0] = round(sum);
        document.getElementById("compPrice").innerHTML = round(GetPrice(sum));

		assignChartLabel(chartPerformanceIndex);
        //chartStats.data.datasets[2] = chartStats.data.datasets[1];

        chartPower.update();
        chartAirDrag.update();
        chartDownforce.update();
        chartStats.update();
        chartPerformanceIndex.update();
    }

    function GetPrice(s) {
        if (s > 800) return map(s, 800, 1000, 500000, 1000000);
        if (s > 600) return map(s, 600, 800, 200000, 500000);
        if (s > 400) return map(s, 400, 600, 50000, 200000);
        if (s > 200) return map(s, 200, 400, 10000, 50000);
        if (s > 0) return map(s, 0, 200, 1000, 10000);
    }

    var ctxDownforce = document.getElementById('downforceChart').getContext('2d');
    var chartDownforce = new Chart(ctxDownforce, {
        type: 'line',
        data: {
            labels: [0, 50, 100, 150, 200],
            datasets: [{

                label: 'Your vehicle: '+handlingArray.handling.handlingName,
                fill: false,
                data: [0, 1.5, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',

                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',

                ],
                borderWidth: 1,
                lineTension: 0.15,
            },
            {
				label: 'Comparison: ' + comparisonHandlingArray.handling.handlingName, 
                fill: false,
                data: [0, 1, 2],
                backgroundColor: [

                    'rgba(54, 162, 235, 0.2)',
                ],
                borderColor: [

                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1,
                lineTension: 0.25,
            }],
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {

                        beginAtZero: true,
                        min: 0
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Extra Gs'
                    }
                },],
                xAxes: [
                    {

                        scaleLabel: {
                            display: true,
                            labelString: 'Miles Per Hour'
                        }
                    }
                ]
            },
        },
    });

    var ctxAirDrag = document.getElementById('airdragChart').getContext('2d');
    var chartAirDrag = new Chart(ctxAirDrag, {
        type: 'line',

        data: {
            labels: [0, 25, 50, 75, 100, 125, 150, 175, 200],
            datasets: [
                {
	                label: 'Your Car: '+handlingArray.handling.handlingName,

                    fill: false,
                    data: [0.9, 1, 1.2, 1.3, 1.4, 1.6, 1.8, 2, 2.2],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',

                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',

                    ],
                    borderWidth: 1,
                    lineTension: 0.25,
                },
                {
					label: 'Comparison: ' + comparisonHandlingArray.handling.handlingName, 

                    fill: false,
                    data: [0.9, 1, 1.2, 1.3, 1.4, 1.6, 1.8, 2, 2.2],
                    backgroundColor: [

                        'rgba(54, 162, 235, 0.2)',
                    ],
                    borderColor: [

                        'rgba(54, 162, 235, 1)',
                    ],
                    borderWidth: 1,
                    lineTension: 0.25,
                },
            /*
                {
                label: 'x1',
                fill: false,
                data: [0.9, 1, 1.2, 1.3, 1.4, 1.6, 1.8, 2, 2.2],
                backgroundColor: [
                    'rgba(255, 99, 132, 0)',

                ],
                borderColor: [
                    'skyblue',
                ],
                borderWidth: 1,
                lineTension: 0.25,
            },
            {
                label: 'x5',
                fill: false,
                data: [0.9, 1.1, 1.2, 1.4, 1.7, 2, 2.26, 2.65, 2.9],
                backgroundColor: [
                    'rgba(255, 99, 132, 0)',

                ],
                borderColor: [
                    'skyblue',

                ],
                borderWidth: 1,
                lineTension: 0.25,
            },
            {
                label: 'x10',
                fill: false,
                data: [0.9, 1.15, 1.46, 1.78, 2.225, 3.00, 3.7, 4.5, 5.4],
                backgroundColor: [
                    'rgba(255, 99, 132, 0)',

                ],
                borderColor: [
                    'skyblue',

                ],
                borderWidth: 1,
                lineTension: 0.25,
            },
            {
                label: 'x50',
                fill: false,
                data: [1, 1.1, 1.74, 2.5, 3.4, 4.7, 6.3, 8, 9.9],
                backgroundColor: [
                    'rgba(255, 99, 132, 0)',

                ],
                borderColor: [
                    'skyblue',

                ],
                borderWidth: 1,
                lineTension: 0.25,
            }
            */],
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,

                        min: 0
                    },

                    scaleLabel: {
                        display: true,
                        labelString: 'Resistance (Gs)'
                    }
                },],
                xAxes: [
                    {

                        scaleLabel: {
                            display: true,
                            labelString: 'Miles Per Hour'
                        }
                    }
                ]
            },
        },
    });

    var gearRatios =
    {
        1: [0.9], 2: [3.33, 0.9], 3: [3.33, 1.565, 0.9], 4: [3.33, 1.826, 1.222, 0.9], 5: [3.33, 1.934, 1.358, 1.054, 0.9], 6: [3.333, 1.949, 1.392, 1.095, 0.946, 0.9]
    }

    var gearShiftPoints =
    {
        0: [0], 1: [100], 2: [100], 3: [100], 4: [0, 22, 47, 69], 5: [0, 22, 45, 62, 79], 6: [0, 22, 45, 60, 76, 88], 7: [0, 22, 45, 60, 78, 91, 96], 8: [0, 22, 45, 64, 83, 98, 105, 105]
    }
    var ctxPower = document.getElementById('powerChart').getContext('2d');
    var chartPower = new Chart(ctxPower, {
        type: 'line',

        data: {
            labels: ["1º", "2º", "3º", "4º", "5º", "6º", "7º", "8º", "9º", "10º"],

            datasets: [{
                steppedLine: true,
	            label: 'This car: '+handlingArray.handling.handlingName,
                fill: false,
                data: [0.2 * gearRatios[1], 0.2 * gearRatios[2], 0.2 * gearRatios[3], 0.2 * gearRatios[4], 0.2 * gearRatios[5], 0.2 * gearRatios[6],],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',

                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',

                ],
                borderWidth: 1,
                lineTension: 0,
            },
            {
                steppedLine: true,
				label: 'Comparison: ' + comparisonHandlingArray.handling.handlingName, 
                fill: false,
                data: [0.2 * gearRatios[1], 0.2 * gearRatios[2], 0.2 * gearRatios[3], 0.2 * gearRatios[4], 0.2 * gearRatios[5], 0.2 * gearRatios[6],],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',

                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1,
                lineTension: 0,
            }],

        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        min: 0
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Gs'
                    }
                },],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Gear'
                    }
                }]
            },
        },
    });

    var ctxStats = document.getElementById('statsChart').getContext('2d');
    var chartStats = new Chart(ctxStats, {
        type: 'horizontalBar',

        data: {
            labels: ["Power", "Speed", "Braking", "Grip", "Aero"],

            datasets: [{
	            label: 'This car: '+handlingArray.handling.handlingName,

                data: [5, 5, 5, 5, 5],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,

            }, {
				label: 'Comparison: ' + comparisonHandlingArray.handling.handlingName, 
                data: [5, 5, 5, 5, 5],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(54, 162, 235, 0.2)',

                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',

                ],

                borderWidth: 1,
            }],

        },
        options: {
            scales: {
                yAxes: [{

                    scaleLabel: {
                        display: false,
                        labelString: ''
                    }
                },],
                xAxes: [{
                    scaleLabel: {
                        display: false,
                        labelString: ''
                    },
                    ticks: {
                        max: 250,
                        min: 0,
                        stepSize: 25

                    },
                }]
            },
        },
    });


    var ctxPerformanceIndex = document.getElementById('piChart').getContext('2d');
    var chartPerformanceIndex = new Chart(ctxPerformanceIndex, {
        type: 'horizontalBar',
        data: {
            labels: ["PI"],

            datasets: [{
	            label: 'This car: '+handlingArray.handling.handlingName,
                data: [5],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,

            }, {
                label: 'Comparison: ' + comparisonHandlingArray.handling.handlingName, 

                data: [5],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1,
            }],

        },
        options: {
            scales: {
                yAxes: [{

                    scaleLabel: {
                        display: false,
                        labelString: ''
                    }
                },],
                xAxes: [{
                    scaleLabel: {
                        display: false,
                        labelString: ''
                    },
                    ticks: {
                        max: 1000,
                        min: 0,
                        stepSize: 50

                    },
                }]
            },
        },
    });
    /*
        slider.oninput = function() {
            var shiftTime = this.value / 100;
            displayValue.innerHTML = shiftTime;

            realValue.innerHTML = Math.round((1 / shiftTime) * 10000) / 10000;
        }
        function map(x, in_min, in_max, out_min, out_max) {
            return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
        }
        */



	/// DUMMY XML
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(rawInput.value, "text/xml");

	xmlDoc.getElementsByTagName("Item")[0].childNodes.forEach(element => {




		if (element.attributes) {



			if( typeof element.attributes[0] !== 'undefined' ){
				console.log( `${element.nodeName}: `, element.attributes[0].value );
				comparisonHandlingArray.handling[ element.nodeName ] = element.attributes[0].value;
			}else if(element.textContent.trim() ){
				console.log( `${element.nodeName}:`, element.textContent.trim() ); 
				comparisonHandlingArray.handling[ element.nodeName ] = element.textContent.trim();
			}else{
				console.log( element.nodeName, element ); 
			
			}

			var d = element.attributes[0];
            if (d != null) {
                var sld = document.getElementById(element.nodeName + "Slider");
                if (sld != null) sld.value = d.value;
                var input = document.getElementById(element.nodeName + "Input");
                if (input != null) {
                    input.value = d.value;
                    UpdateExplanations(input);
                }
                handlingArray.handling[element.nodeName] = d.value;
                comparisonHandlingArray.handling[element.nodeName] = d.value;


                $("#wEmptyFile").toggleClass("d-none", true);
            }

		}
    });




    UpdateCharts();

    $(".custom-file-input").on("change", function () {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    });





































//Mass Comparer

// Define allowed values and their corresponding labels/units
const columnDefinitions = [
    { key: "handlingFilePath", name: "filePath", unit: "" },
    { key: "handlingName", name: "ID", unit: "" },
    { key: "fTractionCurveMax", name: "Tyre Grip", unit: " Gs" },
    { key: "fInitialDriveForce", name: "Acceleration", unit: " Gs" },
    { key: "fInitialDriveMaxFlatVel", name: "Top Speed (MPH)", unit: " MPH" },
    { key: "fInitialDriveMaxFlatVelKPH", name: "Top Speed (KPH)", unit: " KPH" },
    { key: "nInitialDriveGears", name: "Gears", unit: "" },
    { key: "fInitialDragCoeff", name: "Air Drag", unit: " Gs" },
    { key: "fDownforceModifier", name: "Downforce", unit: " Gs" },
    { key: "fBrakeForce", name: "Brakes", unit: "" }
];

var tableArr = [];
var input = document.getElementById("masscomparerloader");

input.addEventListener("change", function () {
    tableArr = []; // Reset the table array

    console.log("Starting file processing...");

    Array.from(this.files).forEach(file => {
        const reader = new FileReader();

        reader.addEventListener('load', (e) => {
            console.log("Loading file...");
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(e.target.result, "text/xml");

            Array.from(xmlDoc.getElementsByTagName("Item")).forEach(item => {
                var itemType = item.getAttribute('type') || 'NULL';
                
                // Only process CHandlingData and CCarHandlingData types
                if (itemType !== "CHandlingData" && itemType !== "CCarHandlingData") {
                    console.log(`%cSkipped Item Type: ${itemType}`, 'color: orange; font-weight: bold;');
                    return; // Skip this item
                }

                const row = new Array(columnDefinitions.length).fill("-");

                // Loop over each child element of the <Item> tag
                Array.from(item.children).forEach(element => {
                    const colIndex = columnDefinitions.findIndex(col => col.key === element.tagName);

                    if (colIndex !== -1 && element.attributes && element.attributes[0]) {
                        const rawValue = parseFloat(element.attributes[0].value) || 0;

                        if (element.tagName === "fInitialDriveMaxFlatVel") {
                            const speedmph = (rawValue / 0.75 * milestokm).toFixed(1);
                            const speedkph = (speedmph * kmtomiles).toFixed(1);
                            row[colIndex] = speedmph;

                            const kphIndex = columnDefinitions.findIndex(col => col.key === "fInitialDriveMaxFlatVelKPH");
							if (kphIndex !== -1) row[kphIndex] = speedkph;

							const handlingFilePathIndex = columnDefinitions.findIndex(col => col.key === "handlingFileName");

							const filePathIndex = columnDefinitions.findIndex(col => col.key === "handlingFilePath");
							if (filePathIndex !== -1) row[filePathIndex] = file.name;


							//if (handlingFileNameIndex !== -1) row[handlingFileNameIndex] = filename;

						
						
						} else if (element.tagName === "fInitialDriveForce") {
                            row[colIndex] = (rawValue * 3.33).toFixed(3);
                        } else {
                            row[colIndex] = rawValue.toFixed(3);
                        }
                    } else if (colIndex !== -1) {
                        const textval = element.textContent.trim();
                        row[colIndex] = textval || "-";
                    }

					if( typeof row[colIndex] === 'undefined'){

						if( element.textContent.trim() ){

							console.log( `${colIndex} %c${element.tagName}%c:`, 'color:white;background:purple;font-weight:bold;', '', element.textContent.trim() );

						}else{

							

							const attributesArray = Array.from($(element)[0].attributes); // Turn attributes into an array
							const jsonObject = attributesArray.reduce((obj, attr) => {
							    obj[attr.name] = attr.value;
							    return obj;
							}, {});
							

							if( typeof jsonObject.value !== 'undefined' && Object.keys(jsonObject).length == 1){

								console.log( `${colIndex} %c${element.tagName} %c:`, 'color:white;background:red;font-weight:bold;', '', jsonObject.value /*Array.from($(element)[0].attributes)*/ );

							}else{
							
								console.log( `${colIndex} %c${element.tagName} %c:`, 'color:white;background:red;font-weight:bold;', '', jsonObject /*Array.from($(element)[0].attributes)*/ );

							}

						}

					}else{
					
						console.log( `${colIndex} %c${element.tagName}%c: [${row[colIndex]}]`, 'color:white;background:orange;font-weight:bold;', '' );
						console.log(`\n`);
					}
                });

                // Check if row contains valid data (not all "-" values)
                const hasValidData = row.some(value => value !== "-");

                // Check if handlingName is set
                const hasValidHandlingName = row[0] && row[0] !== "-";

                if (hasValidData && hasValidHandlingName) {
                    tableArr.push(row);
                } else {
                    console.log(`%cSkipped empty or invalid row for type ${itemType}`, 'color: red; font-weight: bold;');
                }
            });

            console.log("File loaded and processed.");
        });

        reader.readAsText(file);
    });

    setTimeout(() => drawTableFromArray(tableArr), 2000);
});

function drawTableFromArray(dataArray) {
    const container = document.getElementById("compareTableDIV");
    container.innerHTML = ''; // Clear existing content

    const table = document.createElement('table');
    table.id = "tablecompare";
    table.classList.add('table', 'mx-auto', 'border');

    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    columnDefinitions.forEach(col => {
        const th = document.createElement('th');
        th.textContent = col.name;
        th.scope = "col";
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');
    dataArray.forEach(row => {
        const newRow = document.createElement('tr');
        row.forEach((cell, index) => {
            const newCell = document.createElement('td');
            newCell.textContent = cell + (columnDefinitions[index]?.unit || "");
            newCell.setAttribute("value", cell);
            newCell.classList.add("p-1");
            newRow.appendChild(newCell);
        });
        tbody.appendChild(newRow);
    });

    table.appendChild(tbody);
    container.appendChild(table);
}




var input = document.getElementById('fDownforceModifier' + "Input");
applyValueChange( input  );