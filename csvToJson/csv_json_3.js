var fs = require('fs'),
readline = require('readline'),
stream = require('stream');

var instream = fs.createReadStream('../CSV/crime_big.csv');

var outFile = 'data_crime_3.json';

var outstream = new stream;
outstream.readable = true;
outstream.writable = true;

var util = require('util');

var rl = readline.createInterface({
	input: instream,
	output: outstream,
	terminal: false
});

var lineCount=0;
var myHeader="";
var recordCount=0;
var obj_new = {};
var result = []; 

var index = 0;
var nonIndex = 0;
var violent =0;
var property = 0;


rl.on('line', function(line) 
{
			var headers = myHeader.split(",");//all headers

			var obj = {};
			var obj_new = {};

			var row = line,
			headCount = 0,
			startValue = 0,
			count = 0;

				// if (row.trim() == '') // it will skip all empty rows.....
				// 	{ 
				// 		continue; 
				// 	}

				while (count < row.length) //check all char 
				{
					// console.log("------------------------------"+row.length+"::::::"+count);

					var c = row[count];

					if (c == '"') //to check if this char is " or not......
					{
						do
						{
							c = row[++count]; 
							// console.log(count+":::::::::::::::::::::::"+c+"::::::::::::::::::::"+i);
						} 
						while(c !== '"' && count < row.length - 1);
					}

					else if (c == ',' || count == row.length - 1) //to check each column with ,
					{
						// console.log(":::::::::::::::::::::::::::::::::::::"+count);
						var value = row.substr(startValue,count - startValue).trim();//one column

						/* skip first double quote */
						if (value[0] == '"') 
						{ 
							value = value.substr(1); 
						}
						/* skip last comma */
						if (value[value.length - 1] == ',') 
						{ 
							value = value.substr(0, value.length - 1); 
						}
						/* skip last double quote */
						if (value[value.length - 1] == '"') 
						{ 
							value = value.substr(0, value.length - 1); 
						}

						var key = headers[headCount++];
						obj[key] = value;
						startValue = count + 1;
					}
					++count;
				}
				if(lineCount==0)
				{
					lineCount++;
					myHeader=line;
				}
				else
				{
					if(obj['Year'] == '2015')
					{
						if(obj['Primary Type'] == 'HOMICIDE'){
							index++;
							violent++;
						}
						else if(obj['Primary Type'] == 'CRIMINAL SEXUAL ASSAULT'){
							index++;
							violent++;
						}
						else if(obj['Primary Type'] == 'ROBBERY'){
							index++;
							violent++;
						}
						else if(obj['Primary Type'] == 'AGGRAVATED ASSAULT'){
							index++;
							violent++;
						}
						else if(obj['Primary Type'] == 'AGGRAVATED BATTERY'){
							index++;
							violent++;
						}
						else if(obj['Primary Type'] == 'BURGLARY'){
							index++;
							property++;
						}
						else if(obj['Primary Type'] == 'LARCENY'){
							index++;
							property++;
						}
						else if(obj['Primary Type'] == 'MOTOR VEHICLE THEFT'){
							index++;
							property++;
						}
						else if(obj['Primary Type'] == 'ARSON'){
							index++;
							property++;
						}
						else if(obj['Primary Type'] == 'INVOLUNTARY MANSLAUGHTER'){
							nonIndex++;
						}
						else if(obj['Primary Type'] == 'SIMPLE ASSAULT'){
							nonIndex++;
						}
						else if(obj['Primary Type'] == 'SIMPLE BATTERY'){
							nonIndex++;
						}
						else if(obj['Primary Type'] == 'FORGERY & CONUTERFEITING'){
							nonIndex++;
						}
						else if(obj['Primary Type'] == 'FRAUD'){
							nonIndex++;
						}
						else if(obj['Primary Type'] == 'EMBEZZLEMENT'){
							nonIndex++;
						}
						else if(obj['Primary Type'] == 'STOLEN PROPERTY'){
							nonIndex++;
						}
						else if(obj['Primary Type'] == 'VANDALISM'){
							nonIndex++;
						}
						else if(obj['Primary Type'] == 'WEAPONS VIOLATION'){
							nonIndex++;
						}
						else if(obj['Primary Type'] == 'PROSTITUTION'){
							nonIndex++;
						}
						else if(obj['Primary Type'] == 'CRIMINAL SEXUAL ABUSE'){
							nonIndex++;
						}
						else if(obj['Primary Type'] == 'DRUG ABUSE'){
							nonIndex++;
						}
						else if(obj['Primary Type'] == 'GAMBLING'){
							nonIndex++;
						}
						else if(obj['Primary Type'] == 'OFFENSES AGAINST FAMILY'){
							nonIndex++;
						}
						else if(obj['Primary Type'] == 'LIQUOR LICENSE'){
							nonIndex++;
						}
						else if(obj['Primary Type'] == 'DISORDERLY CONDUCT'){
							nonIndex++;
						}
						else if(obj['Primary Type'] == 'MISC NON-INDEX OFFENSE'){
							nonIndex++;
						}
					}
				}
			});

var resultFinal = [];

rl.on('close',function()
{
	var objFinal1 = {};
	var objFinal2 = {};
	var objFinal3 = {};
	var objFinal4 = {};
	
	objFinal1['crime'] = "Index";
	objFinal1['count'] = index;
	objFinal2['crime'] = "NonIndex";
	objFinal2['count'] = nonIndex;
	objFinal3['crime'] = "Violent";
	objFinal3['count'] = violent;
	objFinal4['crime'] = "Property";
	objFinal4['count'] = property;
	
	resultFinal.push(objFinal1);
	resultFinal.push(objFinal2);
	resultFinal.push(objFinal3);
	resultFinal.push(objFinal4);
	
	fs.writeFileSync(outFile,JSON.stringify(resultFinal), 'utf-8');
});

var start = Date.now();

process.on("exit", function() {
	var end = Date.now();
	console.log("Time taken: %ds", (end - start)/1000);
});


//console.log(over500Count+":::"+under500Count);

