
const flagMeta = {
	modelFlags: {
		prefix: 'MF'
	},
	handlingFlags: {
		prefix: 'HF'
	},
	/*advancedFlags: {
		prefix: 'CF'
	},*/
	damageFlags: {
		prefix: 'DF'
	},	
};
const flagData = {
    modelFlags: [
        ['IS_VAN', 'IS_BUS', 'IS_LOW', 'IS_BIG'],
        ['ABS_STD', 'ABS_OPTION', 'ABS_ALT_STD', 'ABS_ALT_OPTION'],
        ['NO_DOORS', 'TANDEM_SEATS', 'SIT_IN_BOAT', 'HAS_TRACKS'],
        ['NO_EXHAUST', 'DOUBLE_EXHAUST', 'NO1FPS_LOOK_BEHIND', 'CAN_ENTER_IF_NO_DOOR'],
        ['AXLE_F_TORSION', 'AXLE_F_SOLID', 'AXLE_F_MCPHERSON', 'ATTACH_PED_TO_BODYSHELL'],
        ['AXLE_R_TORSION', 'AXLE_R_SOLID', 'AXLE_R_MCPHERSON', 'DONT_FORCE_GRND_CLEARANCE'],
        ['DONT_RENDER_STEER', 'NO_WHEEL_BURST', 'INDESTRUCTIBLE', 'DOUBLE_FRONT_WHEELS'],
        ['IS_RC', 'DOUBLE_RWHEELS', 'NO_WHEEL_BREAK', 'IS_HATCHBACK']
    ],
    handlingFlags: [
        ['SMOOTH_COMPRESN', 'REDUCED_MOD_MASS', '', 'HAS_RALLY_TYRES'],
        ['NO_HANDBRAKE', 'STEER_REARWHEELS', 'HB_REARWHEEL_STEER', 'STEER_ALL_WHEELS'],
        ['FREEWHEEL_NO_GAS', 'NO_REVERSE', 'REDUCED_RIGHTING_FORCE', ''],
        ['CVT', 'ALT_EXT_WHEEL_BOUNDS_BEH', 'DONT_RAISE_BOUNDS_AT_SPEED', ''],
        ['LESS_SNOW_SINK', 'TYRES_CAN_CLIP', 'REDUCED_DRIVE_OVER_DAMAGE', ''],
        ['OFFROAD_ABILITY', 'OFFROAD_ABILITY2', 'TYRES_RAISE_SIDE_IMPACT_THRESHOLD', ''],
        ['ENABLE_LEAN', 'HEAVYARMOUR', '', 'ARMOURED'],
        ['SELF_RIGHTING_IN_WATER', 'IMPROVED_RIGHTING_FORCE', 'LOW_SPEED_WHEELIES', '']
	],
	/*advancedFlags: [
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', '']
	],*/
	damageFlags: [
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', '']
	]

    
};












// Store global variables for flag descriptions
let plebFlags = {};
let iktFlags = {};

(async function loadFlags() {
    try {
        // Run both fetches in parallel
        const [plebResponse, iktResponse] = await Promise.all([
            fetch('flags-pleb.json'),
            fetch('flags-ikt.json')
        ]);

        if (!plebResponse.ok) throw new Error(`HTTP error! Status: ${plebResponse.status}`);
        if (!iktResponse.ok) throw new Error(`HTTP error! Status: ${iktResponse.status}`);

        const plebData = await plebResponse.json();
        const iktData = await iktResponse.json();

        console.log('Loaded flags-pleb.json:', plebData);
        console.log('Loaded flags-ikt.json:', iktData);

        plebFlags = plebData;
        iktFlags = iktData.flags || iktData; 

        createFlagSections();
        autoborders();
    } catch (err) {
        console.error('Error loading flags files:', err);
    }
})();



function cap1st(str){
	return String(str).charAt(0).toUpperCase(str) + String(str).slice(1);
}

function low1st(str){
	return String(str).charAt(0).toLowerCase(str) + String(str).slice(1);
}


function camelToTitleCase(camelCaseStr) { 	//ie modelFlags ->Model Flags

    return camelCaseStr
        .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
        .replace(/^./, str => str.toUpperCase()); // Capitalize the first letter
}

function rmFlagsPrefix(flag, key){


	var fPrefix = flagMeta[flag].prefix;

    var regex = new RegExp(`^_?(?:${fPrefix}_)`);

    var result = key.replace(regex, '');


	//console.log(`flag:${flag}, key:${key}, prefix:${fPrefix}\n\nresult:${result}`);

	return result;

}




function createFlagSections() {

	Object.entries(flagMeta).forEach(([key, value]) => {
	  //console.log(key, value.prefix);
	  createFlagSection(`${key}Section`, camelToTitleCase(key)+` Generator (${flagMeta[key].prefix})`, key, flagData[key], 'str'+cap1st(key) );
	});

}

function createFlagSection(id, title, resultId, flagRows, handlingMetaKey) {

	//console.log( `createFlagSection( \n\t'id:${id}',\n\ttitle:'${title}',\n\tflag:'${resultId}',\n\tflagRows: [${flagRows}],\n\thandlingMetaKey:'${handlingMetaKey}'\n);` );

	var initFlagVal = "0";

    const container = document.createElement('div');
    container.id = id;
    container.classList.add('col-xxl-5', 'text-center', 'bg-whitesmoke', 'mt-5', 'border', 'border-info', 'p-5', 'mx-auto');

    container.innerHTML = `
        <div class="alert alert-secondary mx-5" role="alert">
            <h3 class="text-center mt-3">${title}</h3>
        </div>
        <div class="divTbl border border-gray bg-light container-fluid"></div>
        <div class="border border-info bg-light mt-2">
            <h3 class="flagTitle">${handlingMetaKey}</h3>&nbsp;=&nbsp;<span id="${handlingMetaKey}" class="flagHexval">${initFlagVal}</span><br>
            <div title="you can copy ${resultId}" class="noselect mb-2 mt-2 mx-auto text-center border d-inline border-dark bg-light container-fluid">
                &lt;${handlingMetaKey}&gt;<span title="click to edit ${resultId}" class="text-muted"><strong id="${resultId}">${initFlagVal}</strong></span>&lt;&frasl;${handlingMetaKey}&gt;
            </div>
			<br><span id="msg_${resultId}" data-type="message"></span>
        </div>

		</p>
    `;

    const flagContainer = container.querySelector('.divTbl');
    flagRows.forEach((row, rowIndex) => {


        const rowDiv = document.createElement('div');
		rowDiv.classList.add('row');

		row.forEach((flag, colIndex) => {

			var iktVal = ((rowIndex*4)+colIndex);

			var flagInfo = iktFlags[handlingMetaKey][iktVal];

			//var iktName = flagInfo.name.replace(/^_?(?:[A-Z]{2}_)/, '');
			//var iktName = flagInfo.name.replace(/^_?(?:${flagMeta[resultId].prefix}_)/, '');
			var iktName = rmFlagsPrefix(resultId, flagInfo.name);

			//console.log('\n iktFlag:', {'index': iktVal, 'flag': resultId, 'rowIndex': rowIndex, 'colIndex': colIndex, 'iktName': iktName} );

			const colDiv = document.createElement('div');

            colDiv.classList.add('col-sm-3', 'py-1', 'align-middle');
            colDiv.dataset.flag = resultId;
            colDiv.dataset.rowIndex = rowIndex;
            colDiv.dataset.colIndex = colIndex;







			var plebFlag = plebFlags.find(item => item.index === iktVal &&  low1st(item.category) === resultId);

			// error if we find nothing.. 

			/*var matchCategory = String(plebFlag.category).charAt(0).toLowerCase() + String(plebFlag.category).slice(1);*/
			//console.log(`${resultId} == ${matchCategory}`);
			//console.log(`${resultId} == ${matchCategory}`);
			plebFlag.category = cap1st(plebFlag.category);
			//console.log(`plebFlag:`, plebFlag);


			Object.entries(plebFlag).forEach(([key, value]) => {
			  //console.log(`${key}:\t${value}`);
 			  colDiv.classList.add('pleb');
			  colDiv.dataset[`pleb${key}`] = value;
			});










			colDiv.dataset['iktdescription'] = flagInfo.description;
			colDiv.dataset['iktname'] = flagInfo.name;

			colDiv.dataset.address = getHexInfo(iktVal);

			colDiv.title = `${colDiv.dataset.address}\n\n`;
			colDiv.title += `ikt:  \t${flagInfo.name}\n${flagInfo.description}`;
			colDiv.title += `\n\n`; 
			colDiv.title += `pleb:\t${plebFlag.name}\n${plebFlag.description}`;
			//colDiv.title = JSON.stringify( colDiv.dataset, null, 4); /*`${iktName}\n${flagInfo.description}`*/;
			if( !flag ){
				colDiv.classList.add('ikt');
				colDiv.textContent = rmFlagsPrefix(resultId, iktName) || '';
			}

			if(flag){
				colDiv.textContent = flag || '';
			}

			//console.log( colDiv.dataset );

            rowDiv.appendChild(colDiv);
        });
        flagContainer.appendChild(rowDiv);
    });

    document.querySelector('main .row').appendChild(container);

	makeHexEditable(resultId);
}















/**
 * How We Build a Flag
 * -------------------
 * Flags are represented as binary numbers where each bit represents an "ON" or "OFF" state of a specific flag.
 * Each row contains 4 flags. Each flag corresponds to a bit position in a 4-bit binary number.
 * The leftmost flag in the row is the most significant bit (MSB), and the rightmost flag is the least significant bit (LSB).
 *
 * Example:
 * ['IS_VAN', 'IS_BUS', 'IS_LOW', 'IS_BIG']
 * If IS_VAN and IS_LOW are toggled ON, then the binary is: 1010 (binary) = A (hexadecimal)
*/ 

function autoborders() {
    const autoborder = document.querySelectorAll(".col-sm-3");
    autoborder.forEach((col) => {
        col.onclick = toggle;
        col.classList.add('border', /*'text-truncate',*/ 'border-gray');
    });
}

function toggle(e) {
    const target = e.target;

	var flagType = target.dataset.flag;
    target.classList.toggle('bg-success');



	  //console.log(`flagType: ${flagType}, calcFlags(${flagType}, flagData['${flagType}'])`);
      calcFlags(flagType, flagData[flagType]);


	/*Object.entries(flagMeta).forEach(([key, value]) => {
	  console.log(`flagType: ${flagType}, calcFlags(${key}, flagData['${key}'])`);
      calcFlags(key, flagData[key]);

	});

	calcFlags('modelFlags', flagData.modelFlags);
    calcFlags('handlingFlags', flagData.handlingFlags);
	calcFlags('advancedFlags', flagData.advancedFlags);
	calcFlags('damageFlags', flagData.strDamageFlags);
	*/
}

function getHexInfo(flagIndex){


	if (flagIndex < 0 || flagIndex > 31) {
		console.error(`Invalid flagIndex: ${flagIndex}. Must be between 0 and 31.`);
		return;
	}

	// Calculate the hexadecimal value of this specific bit
	const flagValue = (1 << flagIndex) >>> 0; // Force unsigned 32-bit shift 

	returnStr=`Flag ${flagIndex} / 0x${flagValue.toString(16).toUpperCase().padStart(8, '0')} \/\/ ${flagValue}`;
	// Log the flag information
	//console.log(returnStr);

	return returnStr

}

function calcFlags(flagType, flagArray) {
    let result = 0 >>> 0; // Force unsigned 32-bit result

	console.log( `calcFlags('${flagType}', flagArray)` );

	var flaginfoLines = '';
	$(`#${flagType}Section .divTbl div.row`).each((rowIndex, rowElement) => {
        let rowResult = 0;


		var binaryRow = [];
        $(rowElement).find('div').each((colIndex, flagElement) => {

			//console.log( `index: `, flagElement.dataset.plebindex );

			if (flagElement.classList.contains('bg-success')) {

				// Calculate the flag index using the combined row and column position
				const flagIndex = (rowIndex * 4) + colIndex;

				// Calculate the bit shift position
				const shiftAmount = flagIndex;

				// Calculate the hexadecimal value of this specific bit
				const flagValue = (1 << shiftAmount) >>> 0; // Force unsigned 32-bit shift

				// Log the flag information
				var flagInfo = `Flag ${flagIndex} / 0x${flagValue.toString(16).toUpperCase().padStart(8, '0')} \/\/ ${flagValue}`;

				flaginfoLines += `${flagInfo}\n`

				// Merge this bit into the overall result
				result |= flagValue;

				binaryRow.push("1");
			}else{
				binaryRow.push("0");
			}

		});
		//console.log( `${binaryRow}` );

	});

    // Convert the full 32-bit result to an 8-character hexadecimal string
    const hexString = (result >>> 0).toString(16).toUpperCase().padStart(8, '0');

	var truncatedHex = hexString.replace(/^0+/, '') || '0';

	document.getElementById(`${flagType}`).innerHTML = truncatedHex;
	
	//if(flaginfoLines){
		console.log(`%c${flagType}%c:\n${flaginfoLines}`, 'color:yellow;background:black;font-weigh:bold;', '');
		
		updHexSpan(flagType, truncatedHex);

		console.log();
	//}
}

function updHexSpan(flagType, hexString){


		var flagIndex = `${"str"+cap1st(flagType)}`;
		var messg = `#%c${flagIndex}%c: %c${hexString}`;
		console.log(`${messg}\n\n`, 'color:yellow;background:black;font-weigh:bold;', '', 'color:yellow;background:blue;font-weigh:bold;');

		$(`#${flagIndex}`).text(`${hexString}`);

		//handlingArray.handling[flagType] = hexString;

		// function replaceHandlingAttr(tagName, attrName, newValue) {
		// replaceHandlingAttr(fDownforceModifier, value, 62.45){};
		// tagName:fDownforceModifier, attrName:value, newValue:62.45
		replaceHandlingAttr(flagIndex, 'string', hexString);
}

function setFlagState(flagType, hexString) {

    console.log( `%csetFlagState('${flagType}', '${hexString}');`, 'background:blue;color:yellow;font-weigh:bold;' );

    const binaryValue = parseInt(hexString, 16).toString(2).padStart(32, '0');
    // console.log( 'binaryValue:', binaryValue );

    const flagArray = flagData[flagType];
    
    flagArray.forEach((row, rowIndex) => {
        // Reverse the row index to match the binary layout
        const reverseRowIndex = flagArray.length - 1 - rowIndex; 
        const rowBinary = binaryValue.slice(reverseRowIndex * 4, (reverseRowIndex + 1) * 4).split('').reverse();
        
        row.forEach((flag, colIndex) => {
            var flagNo = ((rowIndex * 4) + colIndex);
            var queryFlagDivs = `[data-flag='${flagType}'][data-plebindex='${flagNo}']`;

            const element = document.querySelector(queryFlagDivs);
            if (!element) {
                console.warn(`Element not found for query: ${queryFlagDivs}`);
                return;
            }
            
            if (rowBinary[colIndex] === '1') {
                element.classList.add('bg-success');
            } else {
                element.classList.remove('bg-success');
            }
        });
        
        // console.log(`${rowBinary}`);

    });

	var truncatedHex = hexString.replace(/^0+/, '') || '0';

    updHexSpan(flagType, truncatedHex);
	hexInputEl = document.getElementById(flagType);


	$(hexInputEl).text(truncatedHex);

    var flagIndex = `${"str"+cap1st(flagType)}`;
    var messg = `${flagIndex} flag updated: "${truncatedHex}"`;
    $(`#msg_${flagType}`).removeAttr('class').addClass('alert-success').text(messg).show().fadeOut(3600, function(){ 
        $(this).html('&nbsp;').show();
    });
}





// Function to restore the caret position
function restoreCaret(element, position) {
	const selection = window.getSelection();
	const range = document.createRange();
	
	const textNode = element.childNodes[0];
	const maxPosition = textNode ? textNode.length : 0; // Get the length of the text node safely
	
	const safePosition = Math.min(position, maxPosition); // Ensure position is within the text length
	try {
		range.setStart(textNode, safePosition);
	} catch (error) {
		console.warn(`Failed to set caret position: ${error.message}`);
		return;
	}
	
	range.collapse(true);
	selection.removeAllRanges();
	selection.addRange(range);
}


// Function to replace the current selection with new text
function replaceSelectionWithText(element, newText) {
	const selection = window.getSelection();
	const range = selection.getRangeAt(0);
	range.deleteContents();
	range.insertNode(document.createTextNode(newText));
}

// Function to get the length of the current selection
function getSelectionLength() {
	const selection = window.getSelection();
	return selection.toString().length;
}


function makeHexEditable(elementId) {
    // Get the element by ID
    const element = document.getElementById(elementId);

    if (!element) {
        console.warn(`Element with id "${elementId}" not found.`);
        return;
    }


    $(element).off('change').on('change', (e) => {

        var messg;
        const lengthlimit=8;
        const targetFlagEl = e.currentTarget;
        var flagStr = targetFlagEl.innerHTML;
        console.log( flagStr, flagStr.length );
        
        if( flagStr.length >= lengthlimit ){
            e.preventDefault();
            targetFlagEl.innerHTML = flagStr.substring(0, lengthlimit);
            alert( `max ${lengthlimit} chars`);         
        }
	})

    // Make it contenteditable
    element.setAttribute('contenteditable', 'true');






	$(element).off('keydown input paste').on('keydown input paste', (e) => {
		const lengthLimit = 8; // Maximum allowed length
		const targetFlagEl = e.currentTarget;

		// ** Save Original Text and Caret Position **
		const originalText = targetFlagEl.textContent; // Original text before change
		const selection = window.getSelection();
		const range = selection.getRangeAt(0);
		const caretPosition = range.startOffset;

		// Utility to restore text and caret if something goes wrong
		const restoreOriginal = () => {
			targetFlagEl.textContent = originalText;
			restoreCaret(targetFlagEl, caretPosition);
		}

		switch (e.type) {

			case 'paste':
				e.preventDefault(); // Stop default paste action

				navigator.clipboard.readText().then((pastedText) => {
					const cleanValue = pastedText.toUpperCase().replace(/[^0-9A-F]/g, ''); // Hex only
					const currentText = targetFlagEl.textContent;
					const selectionLength = getSelectionLength();
					const availableChars = lengthLimit - currentText.length + selectionLength;

				   const pasteValue = cleanValue.slice(0, availableChars); // Get only what fits
					const updatedText = replaceSelectionWithText(originalText, caretPosition, selectionLength, pasteValue);


					if (cleanValue.length > availableChars) {
						//console.warn(`Paste rejected - not enough space for the pasted content.`);
						//restoreOriginal();
						var messg = `Paste truncated - text would exceed length limit.`;
						console.warn(messg);
						$(`#msg_${elementId}`).removeAttr('class').addClass('alert-warning').text(messg).show(); //fadeOut(3600, function(){ $(this).html('&nbsp;').show();	});

						targetFlagEl.textContent = updatedText;
						return;
					}

	 
					if (updatedText.length <= lengthLimit) {
						targetFlagEl.textContent = updatedText; // Commit change
						restoreCaret(targetFlagEl, caretPosition + pasteValue.length); // Move caret
					} else {
						//console.warn(`Paste rejected - text would exceed length limit.`);
						//restoreOriginal();

						console.warn(`Paste truncated - text would exceed length limit.`);
						targetFlagEl.textContent = updatedText;

					}
				}).catch(err => {
					console.warn(`Error reading clipboard: ${err}`);
					restoreOriginal();
				});

				$(`#msg_${elementId}`).removeAttr('class').text(" ").show();

				break;

			case 'input':
				const cleanValue = targetFlagEl.textContent.toUpperCase().replace(/[^0-9A-F]/g, '');

				if (cleanValue.length > lengthLimit) {
					console.warn(`Input rejected - character limit of ${lengthLimit} exceeded.`);
					restoreOriginal();
					return;
				}

				targetFlagEl.textContent = cleanValue; // Commit change
				restoreCaret(targetFlagEl, caretPosition);

				$(`#msg_${elementId}`).removeAttr('class').text(" ").show();

				break;

			case 'keydown':
				const validKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
				const key = e.key.toUpperCase();

				// Handle Enter Key: If 8 chars are present, submit via setFlagState
				if (e.key === 'Enter') {
					e.preventDefault();
					var currentText = targetFlagEl.textContent;

					if (currentText.length <= lengthLimit) {


						if( currentText.length < lengthLimit) {
							console.log( `before: %c${currentText}`, 'color:red;');
							//currentText = currentText.padEnd( lengthLimit, '0');
							//currentText = currentText.padStart( lengthLimit, '0');
							console.log( `after: %c${currentText}`, 'color:red;');

						}

						var messg = `Submitting setFlagState('${targetFlagEl.id}', '${currentText}');`;
						//console.log(messg);
						$(`#msg_${elementId}`).removeAttr('class').addClass('alert-warning').text(messg);
						try {
							setFlagState(`${targetFlagEl.id}`, `${currentText}`);
						} catch (error) {
							console.error('❌ Error in setFlagState:', error);
						}

					} else {
						var messg = `You must enter exactly ${lengthLimit} characters. Current: ${currentText.length}`;
						console.log(messg);
						$(`#msg_${elementId}`).removeAttr('class').addClass('alert-danger').text(messg).show(); //fadeOut(3600, function(){ $(this).html('&nbsp;').show();	});

					}
					return;
				}

				// Allow Ctrl+V, Ctrl+X (paste, cut)
				if ((key === "A" || key === "V" || key === "Z" || key === "X") && e.ctrlKey) {
					return;
				}

				// Allow navigation, backspace, delete, arrow keys
				if (['Shift', 'Control', 'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
					return;
				}

				// Reject non-hex characters
				if (!validKeys.includes(key)) {
					e.preventDefault();

					var messg = `${elementId} Invalid key "${key}" ignored. Only hex characters (0-9, A-F) allowed. `;
					console.warn(messg);
					$(`#msg_${elementId}`).removeAttr('class').addClass('alert-danger').text(messg).show(); //fadeOut(3600, function(){ $(this).html('&nbsp;').show();	});

					restoreOriginal();
					return;
				}

				// Check if we have space for more characters
				var currentText = targetFlagEl.textContent;
				if (currentText.length >= lengthLimit && !getSelectionLength()) {
					e.preventDefault();
					var messg = `Max length of ${lengthLimit} reached. Ignoring further input.`;
					console.warn(messg);
					$(`#msg_${elementId}`).removeAttr('class').addClass('alert-warning').text(messg).show(); //

					restoreOriginal();
					return;
				}

				console.log(`#msg_${elementId}`);
				$(`#msg_${elementId}`).text(" ");
				/*
				var el = $(`#msg_${elementId}`);

				console.log( $(el) );
				$(el).innerHTML(" ");
				$(el).removeAttr('class');
				$(el).show();
				*/

				break;

		}

		/**
		 * Restore the caret position to the previous location.
		 * Ensures the position is valid and doesn't exceed text length.
		 */
		function restoreCaret(element, position) {
			const selection = window.getSelection();
			const range = document.createRange();

			const textNode = element.childNodes[0];
			const maxPosition = textNode ? textNode.length : 0; // Get the length of the text node safely

			const safePosition = Math.min(position, maxPosition); // Ensure position is within the text length
			try {
				range.setStart(textNode, safePosition);
			} catch (error) {
				console.warn(`Failed to set caret position: ${error.message}`);
				return;
			}

			range.collapse(true);
			selection.removeAllRanges();
			selection.addRange(range);
		}

		/**
		 * Replace the current selection with new text.
		 * Handles the current selection and replaces it with the provided newText.
		 */
		function replaceSelectionWithText(currentText, startPos, selectionLength, newText) {
			const before = currentText.slice(0, startPos);
			const after = currentText.slice(startPos + selectionLength);
			return before + newText + after;
		}

		/**
		 * Get the length of the current selection.
		 * Useful for determining how much text is currently highlighted.
		 */
		function getSelectionLength() {
			const selection = window.getSelection();
			return selection.toString().length;
		}

	});



















    console.log(`Hexadecimal input/keydown enabled for element with id "${elementId}"`);

}
