var fs = require('fs'),
readline = require('readline'),
stream = require('stream');

var instream = fs.createReadStream('../CSV/crime_big.csv');

var outFile = 'data_crime_1.json';

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
var years = [];


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
					
                    if((obj.Description =='OVER $500'||obj.Description =='$500 AND UNDER'))
                    {
                    		obj_new['Year']=obj.Year;
                    		obj_new['Description']=obj.Description;
                    		//console.log(obj.Year+"   "+obj.Description     );
                    		//console.log(nobj);
                    		//years.push(obj.Year);
                    		result.push(obj_new);
				   }

				}	
	});

var resultFinal = [];

rl.on('close',function()
{
	// years = years.filter((x, n, a) => a.indexOf(x) == n);
	// years.sort(function(a, b) {return a - b;});
	// console.log(years);
	// years.forEach(function (i)
	// 
	for(var i = 2001 ; i<=2016 ; i++)
		{
		var under500Array = result.filter(function (el) {  return (+el.Year == i && el.Description=="$500 AND UNDER");});
		var over500Array = result.filter(function (el) {  return (+el.Year ==i && el.Description=="OVER $500");});
		var objFinal = {};

		objFinal['Year'] = i;
		objFinal['$500_AND_UNDER'] = under500Array.length;
		objFinal['OVER_$500'] = over500Array.length;
		resultFinal.push(objFinal);
		//console.log("Year : "+i+" under500 : "+under500Array.length+ "   over 500 : "+over500Array.length);	
	};
	fs.writeFileSync(outFile,JSON.stringify(resultFinal), 'utf-8');
});

var start = Date.now();

process.on("exit", function() {
  var end = Date.now();
  console.log("Time taken: %ds", (end - start)/1000);
});


//console.log(over500Count+":::"+under500Count);

