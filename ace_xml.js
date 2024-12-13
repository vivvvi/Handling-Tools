// ** Initialize Ace Editor **
var rawEditor = ace.edit("rawEditor");
rawEditor.setTheme("ace/theme/monokai");
rawEditor.session.setMode("ace/mode/xml");
rawEditor.setShowPrintMargin(false);
rawEditor.setFontSize(14);
rawEditor.setOptions({
    autoScrollEditorIntoView: true,
    copyWithEmptySelection: true
});

// Load XML from the hidden textarea or use default content
const textarea = document.getElementById('handlingFileDisplay');
const textareaContent = textarea ? textarea.value.trim() : '';
const defaultContent = textareaContent || `
<root>
    <fPetrolTankVolume value="65.000000" />
    <fOilVolume value="5.000000" />
    <vecCentreOfMassOffset x="0.000000" y="0.000000" z="0.000000" />
    <vecInertiaMultiplier x="1.400000" y="1.400000" z="1.600000" />
    <strModelFlags>4400110</strModelFlags>
</root>`;

rawEditor.setValue(defaultContent, -1);
if (textarea) textarea.value = defaultContent;

// ** Regexes to match editable regions **
const valueAttributeRegex = /\bvalue="([a-zA-Z0-9.-]*)"/g;
const tagContentRegex = /<([a-zA-Z0-9]+)>([a-zA-Z0-9.-]*)<\/\1>/g;
const generalAttributeRegex = /\b([a-zA-Z0-9_-]+)="([a-zA-Z0-9.-]*)"/g; // Match any attribute and its value

// ** Track the last known value of the editable area **
let lastEditableValue = null;
let lastTag = null;
let lastAttr = null;



// ** Track Caret Position & Log Editable Status **
const debouncedLogCaretInfo = debounce(logCaretInfo, 150);
rawEditor.on('changeSelection', debouncedLogCaretInfo);
rawEditor.on('click', debouncedLogCaretInfo);

let isSelecting = false;

rawEditor.container.addEventListener('mousedown', () => isSelecting = true);
rawEditor.container.addEventListener('mouseup', () => {
    setTimeout(() => {
        isSelecting = false; 
        const selectionRange = rawEditor.getSelectionRange();
        if (!selectionRange.isEmpty()) {
            console.log('Manual selection detected, skipping programmatic selection.');
        }
    }, 50); 
});



// ** Logs caret information, whether user is in an editable region or not **
function logCaretInfo() {
    if (isSelecting) return; // 🔥 Do not interfere with user manual selection

    const selectionRange = rawEditor.getSelectionRange();
    if (!selectionRange.isEmpty()) {
        // console.log('Manual selection active, skipping programmatic selection.');
        return; // 🚫 Stop here if a selection is ongoing
    }


    const cursorPosition = rawEditor.getCursorPosition();
    const docText = rawEditor.getValue();
    const index = rawEditor.session.doc.positionToIndex(cursorPosition);
    const charAtCursor = docText[index] || 'EOF';
    const { isEditable, tagName, attrName, oldValue } = getEditableInfo(index);

    if (isEditable) {
        const attrDisplay = attrName ? `[${attrName}]` : '';
        // console.log(`✅ Editable position at index: ${index} (character: "${charAtCursor}")`);
        // console.log(`🟢 Editing <${tagName}> ${attrDisplay} Current value: "${oldValue}"`);

        // Store the value to detect changes later
        lastEditableValue = oldValue;
        lastTag = tagName;
        lastAttr = attrName;
    } else {
        //console.warn(`🚫 Not editable at index: ${index} (character: "${charAtCursor}")`);
		//console.log( getNearestTag(docText, index) );
		var valAtts = getValuePosition( docText, index );

		if (valAtts){
		
			// Get row and column corresponding to this character index
			const startPos = rawEditor.session.doc.indexToPosition(valAtts.start, 0);
			const endPos   = rawEditor.session.doc.indexToPosition(valAtts.end, 0);

			// ** Create the selection range using Ace's Range class **
			const aceRange = ace.require('ace/range').Range;
			const range = new aceRange(endPos.row, endPos.column, startPos.row, startPos.column);
			rawEditor.selection.setSelectionRange(range);

		}
		// Move the cursor to the calculated (startPos) row and column
		//rawEditor.moveCursorTo(startPos.row, startPos.column);

	}
}

// ** Check if a given index position is within an editable range **
function getEditableInfo(index) {
    const documentText = rawEditor.getValue();
    let isEditable = false, tagName = '', attrName = '', oldValue = '';

    // Check if position is inside `value="..."` attributes
    valueAttributeRegex.lastIndex = 0;
    while ((match = valueAttributeRegex.exec(documentText)) !== null) {
        const valueStart = match.index + match[0].indexOf('"') + 1;
        const valueEnd = valueStart + match[1].length;
        if (index >= valueStart && index <= valueEnd) {
            isEditable = true;
            attrName = 'value';
            oldValue = match[1];
            tagName = getNearestTag(documentText, match.index);
            break;
        }
    }

    // Check if position is inside `<tag>value</tag>` text content
    tagContentRegex.lastIndex = 0;
    while ((match = tagContentRegex.exec(documentText)) !== null) {
        const valueStart = match.index + match[0].indexOf('>') + 1;
        const valueEnd = valueStart + match[2].length;
        if (index >= valueStart && index <= valueEnd) {
            isEditable = true;
            attrName = ''; // No attribute for root value
            oldValue = match[2];
            tagName = match[1];
            break;
        }
    }

    // Check if position is inside any attribute value 
    generalAttributeRegex.lastIndex = 0;
    while ((match = generalAttributeRegex.exec(documentText)) !== null) {
        const valueStart = match.index + match[0].indexOf('"') + 1;
        const valueEnd = valueStart + match[2].length;
        if (index >= valueStart && index <= valueEnd) {
            isEditable = true;
            attrName = match[1]; 
            oldValue = match[2];
            tagName = getNearestTag(documentText, match.index);
            break;
        }
    }

    return { isEditable, tagName, attrName, oldValue };
}

// ** Get nearest tag from a position in the document **
function getNearestTag(documentText, position) {
    const beforeCursor = documentText.slice(0, position);
    const tagMatch = beforeCursor.match(/<([a-zA-Z0-9]+)(?=\s|>)/g);
    if (tagMatch && tagMatch.length > 0) {
		// console.log( tagMatch[tagMatch.length - 1].replace('<', '') );
        return tagMatch[tagMatch.length - 1].replace('<', '');
    }
    return 'UnknownTag';
}

function getValuePosition(documentText, position) {
    const lineStart = documentText.lastIndexOf('\n', position) + 1; // Start of the current line
    const lineEnd = documentText.indexOf('\n', position);
    const lineText = documentText.slice(lineStart, lineEnd > -1 ? lineEnd : documentText.length);

    // ** 1. Check for values in attributes like value="1500.000000" **
    const attributeMatch = lineText.match(/\b([a-zA-Z0-9-]+)="([a-zA-Z0-9.-]*)"/);
    if (attributeMatch) {
        const matchStart = lineText.indexOf(attributeMatch[0]) + lineStart;
        const valueStart = matchStart + attributeMatch[0].indexOf('"') + 1; // Start after the first quote
        const valueEnd = valueStart + attributeMatch[2].length;
        return { start: valueStart, end: valueEnd, value: attributeMatch[2], attrName: attributeMatch[1], type: 'attribute', lineText };
    }

    // ** 2. Check for tag content like <strHandlingFlags>20000</strHandlingFlags> **
    const tagMatch = lineText.match(/<([a-zA-Z0-9]+)>([a-zA-Z0-9.-]+)<\/\1>/);
    if (tagMatch) {
        const matchStart = lineText.indexOf(tagMatch[0]) + lineStart;
        const valueStart = matchStart + tagMatch[0].indexOf('>') + 1; // Start after the ">" character
        const valueEnd = valueStart + tagMatch[2].length;
        return { start: valueStart, end: valueEnd, value: tagMatch[2], tagName: tagMatch[1], type: 'tag', lineText };
    }

    // ** 3. Check for general attributes, like x="0.000000" y="0.000000" z="0.000000" **
    const generalAttrMatch = lineText.match(/\b([a-zA-Z0-9-]+)="([a-zA-Z0-9.-]*)"/g);
    if (generalAttrMatch) {
        for (let i = 0; i < generalAttrMatch.length; i++) {
            const match = generalAttrMatch[i].match(/([a-zA-Z0-9-]+)="([a-zA-Z0-9.-]*)"/);
            const matchStart = lineText.indexOf(match[0], i > 0 ? lineText.indexOf(generalAttrMatch[i - 1]) + generalAttrMatch[i - 1].length : 0) + lineStart;
            const valueStart = matchStart + match[0].indexOf('"') + 1; // Start after the first quote
            const valueEnd = valueStart + match[2].length;
            if (position >= valueStart && position <= valueEnd) {
                return { start: valueStart, end: valueEnd, value: match[2], attrName: match[1], type: 'attribute', lineText };
            }
        }
    }

    return null; // No match found
}



// ** Detect changes and log if a value changes **
rawEditor.on('change', function() {
    const { tagName, attrName, newValue } = getCurrentEditableValue();

    if (lastEditableValue !== null && lastEditableValue !== newValue) {
        const attrDisplay = attrName ? `[${attrName}]` : '';
        console.log(`🔄 Value changed for <${tagName}> ${attrDisplay} from "${lastEditableValue}" to "${newValue}"`);
		// console.log( $(`[name="${tagName}${attrDisplay}"].form-control`) );
    }

    // Update last known value
    lastEditableValue = newValue;
});

function getCurrentEditableValue() {
    const cursorPosition = rawEditor.getCursorPosition();
    const docText = rawEditor.getValue();
    const index = rawEditor.session.doc.positionToIndex(cursorPosition);
    const { isEditable, tagName, attrName, oldValue } = getEditableInfo(index);

    return { tagName, attrName, newValue: oldValue };
}

function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}
