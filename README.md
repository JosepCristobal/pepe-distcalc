## pepe-distcalc

A geographical distance calculator. It calculates the distance between two geographic points and identifies the country, address, zipcode, city of origin and destination. It also calculates the distance in a straight line between the two points in kilometers and nautical miles.  
A geographical points identifier. You enter the geographic coordinate of a point and it returns the country, address, zipcode and city. 


## Installation

Install using npm:

	$ npm i pepe-distcalc
	
## Usage examples

### A geographical distance calculator

#### Search by coordinates
Accepted two types of coordinates
		
		/**
		 * supported formats
		 *  (DMS): 41°24'12"N 2°10'26"E
		 *  (DD): 41.40338 2.17403
		 * Decimal separator "."
		 * No decimals accepted in format DMS
		 */
The quotes that belong to the seconds, can be a double or two simple
		
		41°24'12"N 2°10'26"E
				or
		41°24'12''N 2°10'26''E
		
Always between latitude and longitude in both formats, you must leave a space.

**Example 1**   
**coordToDistance(coordInit,coordEnd,type)**

	const distCalc = require('pepe-distcalc')

	const tests0 = async (coordInit,coordEnd,type)=>{
	    try {
	        const coorDist = await distCalc.coordToDistance(coordInit,coordEnd,type)
	        console.log('The result is: ',coorDist);
	        
	    } catch (error) {
	        console.error(error)
	    };   
	};
	
	//example coordenates type 'DMS'
	tests0(`41°37'03"N 0°37'47"E`,`40°31'33"N 3°23'27"W`,'DMS');
	
	//example coordinates type DD
	tests0("41.40333333333333 2.1738888888888885","41.39333333333333 2.1738888888888885","DD")
	
**The result is:**

	The result is:  {
	  coordOr: { lat: 41.4034789, lon: 2.174410333009705 },
	  cityO: 'Barcelona',
	  countryO: 'España',
	  zipcodeO: '08001',
	  streetNameO: 'Carrer de Mallorca',
	  coordDest: { lat: 41.3933595, lon: 2.1739429 },
	  cityE: 'Barcelona',
	  countryE: 'España',
	  zipcodeE: '08001',
	  streetNameE: 'Gran Via de les Corts Catalanes',
	  provider: 'openstreetmap',
	  distanceKM: '1.1',
	  distanceNM: '0.6'
	}


#### Search by Country and Zip code
Searches can also be done by country and zip code

**Example 2  
codPostToDistance(country1,zipCode1,country2,zipCode2)**

	const distCalc = require('pepe-distcalc')
	
	const test2 = async (country1,zipCode1,country2,zipCode2) =>{
    	try{
        	const zipDist = await distCalc.codPostToDistance(country1,zipCode1,country2,zipCode2)
        	console.log('The result is: ',zipDist);
    	} catch (error) {
        	return error;
    	};
	};
	
	//Example country and zip code
	test2('Spain','08210','Spain','41001')
	
	
**The result is:**

	The result is:  {
	  coordOr: { lat: 41.5166373621772, lon: 2.1274182947644396 },
	  cityO: 'Barberà del Vallès',
	  countryO: 'España',
	  zipcodeO: '08210',
	  streetNameO: undefined,
	  coordDest: { lat: 37.3883271650025, lon: -5.995913806931262 },
	  cityE: 'Sevilla',
	  countryE: 'España',
	  zipcodeE: '41001',
	  streetNameE: undefined,
	  provider: 'openstreetmap',
	  distanceKM: '834.4',
	  distanceNM: '450.5'
	}
	

### A geographical points identifier

#### Search by coordinates
Accepted two types of coordinates
		
		/**
		 * supported formats
		 *  (DMS): 41°24'12"N 2°10'26"E
		 *  (DD): 41.40338 2.17403
		 * Decimal separator "."
		 * No decimals accepted in format DMS
		 */
The quotes that belong to the seconds, can be a double or two simple
		
		41°24'12"N 2°10'26"E
				or
		41°24'12''N 2°10'26''E
		
Always between latitude and longitude in both formats, you must leave a space.

**Example 3**   
**coordToLocation(coord,'DMS')**
	
	const distCalc = require('pepe-distcalc')
	
	const test3 = async (coord,type) =>{
	    try {
	        const coorPos = await distCalc.coordToLocation(coord,type)
	        console.log('The result is: ',coorPos);
	    } catch (error) {
	        console.error(error)
	    }
	};
	
	//example coordenates type 'DMS'
	test3(`41°37'03"N 0°37'47"E`,'DMS');
	//example coordenates type 'DMS'
	test3("41.40333333333333 2.1738888888888885","DD")
	
**The result is:**

	The result is:  {
	  coord: { lat: 41.4034789, lon: 2.174410333009705 },
	  city: 'Barcelona',
	  country: 'España',
	  zipcode: '08001',
	  streetName: 'Carrer de Mallorca',
	  provider: 'openstreetmap'
	}


#### Search by Country and Zip code
Searches can also be done by country and zip code	
**Example 4  
codPostToLocation(country,zipCode)**

	const distCalc = require('pepe-distcalc')
	
	const test4 = async (country,zipCode) =>{
	    try {
	        const zipPos = await distCalc.codPostToLocation(country,zipCode);
	        console.log('The result is: ',zipPos);
	    } catch (error) {
	        console.error(error);
	    }    
	};
	
	//Example country and zip code
	test4('Spain','08210');
	
The result is:

	The result is:  {
	  coord: { lat: 41.5166373621772, lon: 2.1274182947644396 },
	  city: 'Barberà del Vallès',
	  country: 'España',
	  zipcode: '08210',
	  streetName: undefined,
	  provider: 'openstreetmap'
	}


## pepe-distcalc providers

1. node-geoceoder [link](https://www.npmjs.com/package/node-geocoder).
2. openstreetmap : OpenStreetMapGeocoder. Supports address geocoding and reverse geocoding. You can use options.language and options.email to specify a language and a contact email address.
For geocode, you can use an object as value, specifying one or several parameters
For reverse, you can use additional parameters
You should specify a specific user-agent or referrer header field as required by the OpenStreetMap [Usage Policy](https://operations.osmfoundation.org/policies/nominatim/)
Set options.osmServer to use custom nominatim server. Example: you can setup local nominatim server by following [these instructions](http://nominatim.org/release-docs/latest/admin/Installation/) and set options.osmServer: http://localhost:8000 to use local server.

