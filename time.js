var allElements = document.getElementsByTagName("*");

// All the Ameritard timezones and dayshit timezones (Abolish DST, it's fucking useless)
var timezoneOffsets = {
	"HST": "-10:00",
	"HDT": "-09:00",
	"AKST": "-09:00",
	"AKDT": "-08:00",
	"PST": "-08:00",
	"PDT": "-07:00",
	"MST": "-07:00",
	"MDT": "-06:00",
	"CST": "-06:00",
	"CDT": "-05:00",
	"EST": "-05:00",
	"EDT": "-04:00",
	"UTC": "Z"
}

var shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var shortMonths = [
	'Jan', 'Feb',
	'Mar', 'Apr',
	'May', 'Jun',
	'Jul', 'Aug',
	'Sep', 'Oct',
	'Nov', 'Dec'
];

/**
 * @param {string[]} result
 * @returns
 */
function buildFullTimestamp(result){
	const [_full, month, date, year, hour, minute, zone] = result;
	const triMonth = month.slice(0, 3);
	
	const monthNumber = shortMonths.indexOf(triMonth) + 1;
	const offset = timezoneOffsets[zone.toUpperCase()];
	
	const monthString = (monthNumber < 10) ? `0${monthNumber}` : monthNumber.toString();
	const dateString = (date.length < 2) ? `0${date}` : date.toString();
	const hourString = (hour.length < 2) ? `0${hour}` : hour.toString();
	const minuteString = (minute.length < 2) ? `0${minute}` : minute.toString();
	
	
	if(!offset) return "";
	const timestamp = `${year}-${monthString}-${dateString}T${hourString}:${minuteString}:00.000${offset}`;
	return timestamp;
}


/**
 * @param {Date} dateTime
 */
function buildReplacementFullTimestamp(dateTime){
	const month = shortMonths[dateTime.getMonth()];
	const date = dateTime.getDate();
	const year = dateTime.getFullYear();
	const day = shortDays[dateTime.getDay()];
	const hour = dateTime.getHours();
	const minutes = dateTime.getMinutes();
	
	var ts = new Date().toString();
	var abrTimezone = /\((.*?)\)/.exec(ts)[0].match(/[A-Z]/g).join(""); // This is kinda ugly but it works. Not really any better solution.
	
	return `${month} ${date}, ${year} (${day}) ${hour}:${(minutes < 10) ? "0" + minutes : minutes} (${abrTimezone})`; // Add 0 in front of hours and minutes if under 10
}


function fullStamp(){ // Attempts to convert this: "Dec 13, 2024 (Fri) 23:00 (PST)"
	var regex = /(\w+) (\d+), (\d+)(?:\s\(\w+\)\s|,\s)(\d+):(\d+) \((\w+)\)/g
	
	for(const element of allElements) {
		element.childNodes.forEach(child => {
			if(child.nodeType === Node.TEXT_NODE) {
				const inner = child.nodeValue;
				const result = regex.exec(inner);
				if(!result) return;
				
				const timestamp = buildFullTimestamp(result);
				if(!timestamp) return;
				
				const converted = new Date(timestamp);
				const replacementTimestamp = buildReplacementFullTimestamp(converted);
				
				child.nodeValue = child.nodeValue.replace(result[0], replacementTimestamp)
			}
		})
	}
}

fullStamp()