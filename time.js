// Attempts to convert this: "Dec 13, 2024 (Fri) 23:00 (PST)""

var regex = /(\w+) (\d+), (\d+) \(\w+\) (\d+):(\d+) \((\w+)\)/g


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


function buildTimestamp(result){
	const [_full, month, date, year, hour, minute, zone] = result;
	const monthNumber = shortMonths.indexOf(month) + 1;
	const offset = timezoneOffsets[zone];
	
	if(!offset) return "";
	return `${year}-${monthNumber}-${date}T${hour}:${minute}:00.000${offset}`;
}


/**
 * @param {Date} dateTime
 */
function buildReplacement(dateTime){
	const month = shortMonths[dateTime.getMonth()];
	const date = dateTime.getDate();
	const year = dateTime.getFullYear();
	const day = shortDays[dateTime.getDay()];
	const hour = dateTime.getHours();
	const minutes = dateTime.getMinutes();
	
	var ts = new Date().toString();
	var abrTimezone = /\((.*?)\)/.exec(ts)[0].match(/[A-Z]/g).join(""); // This is kinda ugly but it works. Not really any better solution.
	
	return `${month} ${date}, ${year} (${day}) ${(hour < 10) ? "0" + hour : hour}:${(minutes < 10) ? "0" + minutes : minutes} (${abrTimezone})`; // Add 0 in front of hours and minutes if under 10
}



var allElements = document.getElementsByTagName("*");
for(const element of allElements) {
	const inner = element.innerHTML;
	const result = regex.exec(inner);
	if(!result) continue;
	
	const timestamp = buildTimestamp(result);
	if(!timestamp) continue;
	
	
	const converted = new Date(timestamp);
	const replacement = buildReplacement(converted);

	element.innerHTML = inner.replace(result[0], replacement);
	// console.log(`Updated a timezone: ${result[0]} -> ${replacement}`);
}