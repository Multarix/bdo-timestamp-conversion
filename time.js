(() => {
	// All the Ameritard timezones and dayshit timezones (Abolish DST, it's fucking useless)
	const timezoneOffsets = {
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

	const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const shortMonths = [
		'Jan', 'Feb',
		'Mar', 'Apr',
		'May', 'Jun',
		'Jul', 'Aug',
		'Sep', 'Oct',
		'Nov', 'Dec'
	];


	/**
	 * @param {string[]} result
	 * @returns {string[]}
	 */
	function buildTimestamp(result, type){
		const [_full, month, date, year, hour, minute, zone] = result; // type 1
		const triMonth = month.slice(0, 3);
		
		const monthNumber = shortMonths.indexOf(triMonth) + 1;
		const offset = timezoneOffsets[zone.toUpperCase()];
		if(!offset) return "";
		
		const timestamps = [];
		
		const monthString = (monthNumber < 10) ? `0${monthNumber}` : monthNumber.toString();
		const dateString = (date.length < 2) ? `0${date}` : date.toString();
		const hourString = (hour.length < 2) ? `0${hour}` : hour.toString();
		const minuteString = (minute.length < 2) ? `0${minute}` : minute.toString();
		
		timestamps.push(`${year}-${monthString}-${dateString}T${hourString}:${minuteString}:00.000${offset}`);
		if(type === 3){
			const altHour = result[7];
			const altMinute = result[8];
			const althourString = (altHour.length < 2) ? `0${altHour}` : altHour.toString();
			const altMinuteString = (altMinute.length < 2) ? `0${altMinute}` : altMinute.toString();
			
			timestamps.push(`${year}-${monthString}-${dateString}T${althourString}:${altMinuteString}:00.000${offset}`);
			console.log(timestamps);
		}
		
		return timestamps;
	}


	/**
	 * @param {string[]} dateTime
	 * @param {number} type
	 * @returns {string}
	 */
	function buildReplacementTimestamp(timestamp, type){
		const converted = new Date(timestamp[0]);
		
		const stringMonth = shortMonths[converted.getMonth()];
		const month = converted.getMonth() + 1;
		const date = converted.getDate();
		const year = converted.getFullYear();
		const stringDay = shortDays[converted.getDay()];
		const hour = converted.getHours();
		const minutes = converted.getMinutes();
		
		const ts = new Date().toString();
		const abrTimezone = /\((.*?)\)/.exec(ts)[0].match(/[A-Z]/g).join(""); // This is kinda ugly but it works. Not really any better solution.
		
		if(type === 0) return `${stringMonth} ${date}, ${year} (${stringDay}) ${(hour < 10) ? "0" + hour : hour}:${(minutes < 10) ? "0" + minutes : minutes} (${abrTimezone})`;
		if(type === 1) return `${stringMonth} ${date}, ${year} (${abrTimezone})`;
		if(type === 2) return `${date}/${month}/${year} ${(hour < 10) ? "0" + hour : hour}:${(minutes < 10) ? "0" + minutes : minutes} ${abrTimezone}` // Fixes Ameritard date system
		if(type === 3){
			const convertedAlt = new Date(timestamp[1]);
			const altHour = convertedAlt.getHours();
			const altMinute = convertedAlt.getMinutes();
			
			return `${stringMonth} ${date}, ${year} (${stringDay}) ${(hour < 10) ? "0" + hour : hour}:${(minutes < 10) ? "0" + minutes : minutes} (${abrTimezone}) ~ ${(altHour < 10) ? "0" + altHour : altHour}:${(altMinute < 10) ? "0" + altMinute : altMinute} (${abrTimezone})`;
		}
	}
	
	
	/**
	 * @param {string[]} result
	 * @param {number} type
	 * @returns {string[]}
	 */
	function adjustResultFormat(result, type){
		if(type === 1){
			result.splice(4, 0, "00", "00");
			return result;
		}
		
		if(type === 2){
			result[1] = shortMonths[parseInt(result[1] - 1)];
			return result;
		}
		
		return result;
	}
	

	const allElements = document.getElementsByTagName("*");
	const fullStampRegex = /(\w+) (\d+), (\d+)(?:\s\(\w+\)\s|,\s)(\d+):(\d+) \(([A-Z]+)\)/;
	const dateOnlyRegex = /(\w+) (\d+), (\d+) \(([A-Z]+)\)/;
	const dateWithTimeRegex = /(\d+)\/(\d+)\/(\d+) (\d+):(\d+) ([A-Z]+)/
	const timePeriodRegex = /(\w+) (\d+), (\d+)(?:\s\(\w+\)\s|,\s)(\d+):(\d+) \(([A-Z]+)\) ~ (\d+):(\d+) \(([A-Z]+)\)/
	
	
	/**
	 * @param {RegExp} regex
	 * @param {number} type
	 */
	function updateStamp(regex, type){
		for(const element of allElements) {
			element.childNodes.forEach(child => {
				if(child.nodeType === Node.TEXT_NODE) {
					const inner = child.nodeValue;
					const result = regex.exec(inner);
					if(!result) return;
					
					const adjustedResult = adjustResultFormat(result, type)
					const timestamp = buildTimestamp(adjustedResult, type);
					if(!timestamp) return;
			
					const replacementTimestamp = buildReplacementTimestamp(timestamp, type);
					
					child.nodeValue = child.nodeValue.replace(adjustedResult[0], replacementTimestamp)
				}
			});
		}
	}

	updateStamp(timePeriodRegex, 3)			// Dec 14, 2024 (Sat) 17:20 (UTC) ~ 07:50 (UTC)
	updateStamp(fullStampRegex, 0);			// Dec 13, 2024 (Fri) 23:00 (UTC) & Dec 13, 2024 23:00 (UTC)
	updateStamp(dateOnlyRegex, 1);			// Dec 14, 2024 (UTC)
	updateStamp(dateWithTimeRegex, 2)		// 12/6/2024 15:00 UTC
	
})();