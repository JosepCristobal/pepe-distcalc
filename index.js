'use strict'

/**
 * supported formats
 *  (DMS): 41°24'12"N 2°10'26"E
 *  (DD): 41.40338, 2.17403
 * Decimals .
 * No decimals in format DMS
 */

const nodeGeocoder = require('node-geocoder');

function ParseDMS(input) {
    var parts = input.split(/[^\d\w]+/);
    var lat = ConvertDMSToDD(parts[0], parts[1], parts[2], parts[3]);
    var lng = ConvertDMSToDD(parts[4], parts[5], parts[6], parts[7]);

    return {
        Latitude : lat,
        Longitude: lng
    };
};


function ConvertDMSToDD(degrees, minutes, seconds, direction) {   
    var dd = Number(degrees) + Number(minutes)/60 + Number(seconds)/(60*60);

    if (direction == "S" || direction == "W") {
        dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
};



const check_lat_lon = function (lat, lon){
  const ck_lat = /^(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)$/;
  const ck_lon = /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/;
  var validLat = ck_lat.test(lat);
  var validLon = ck_lon.test(lon);
  if(validLat && validLon) {
      return true;
  } else {
      return false;
  };
};

function getDistanceFromLatLonInKm(lat1_lon1,lat2_lon2) {
    if (!lat1_lon1 || !lat2_lon2){
      return 0;
    }
    const lat1 = lat1_lon1.lat;
    const lon1 = lat1_lon1.lon;
    const lat2 = lat2_lon2.lat;
    const lon2 = lat2_lon2.lon;

    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }

const options = {
    provider: 'openstreetmap',
  };
   
const geoCoder = nodeGeocoder(options);


/**
 * (DMS): 41°24'12"N 2°10'26"E
 * (DD): 41.40338, 2.17403 
 */
const desgloseCoor= async (coor,type)=>{
  if (type==='DMS'){
    const lat = ParseDMS(coor).Latitude;
    const long = ParseDMS(coor).Longitude;
    const coordR =  check_lat_lon(lat,long) ? {lat: lat, lon: long}:undefined;
    return coordR;
  }else if(type==='DD'){
    const coordArr = coor.split(' ')
    const lat = coordArr[0];
    const long = coordArr[1];
    const coordR = check_lat_lon(lat,long) ? {lat: lat, lon: long}:undefined;
    return coordR
  }else{
    return 'Error';
  };

};

const searchByZip = async (country,zipcode)=>{
  const zipGeo = {country: country,postalcode: zipcode}
  const respCoor = await geoCoder.geocode(zipGeo);
  return respCoor
}

const functionFinal = async (coordObj)=>{
  try {
    const resp = await geoCoder.reverse(coordObj);
    return resp
  } catch (error) {
    return error
  }  
  
}

const distanceNM = (dist)=>{
  const nM = ((dist * 1000)/1852).toFixed(1)
  return nM
}  

const final = async(coordObjI,coordObjF,distance)=>{
  
  const coordinatesResIni = await functionFinal(coordObjI);
  const coordinatesResEnd = await functionFinal(coordObjF);

  const bRes = await finalZipCodeCoor(coordinatesResIni[0],coordinatesResEnd[0],distance);
  return bRes;
}
const finalZipCodeCoor = async(coordinatesResIni,coordinatesResEnd,distance)=>{

  const city = coordinatesResIni.city;
  const country = coordinatesResIni.country;
  const zipcode = coordinatesResIni.zipcode;
  const streetName = coordinatesResIni.streetName;
  const provider = coordinatesResIni.provider;

  const cityE = coordinatesResEnd.city;
  const countryE = coordinatesResEnd.country;
  const zipcodeE = coordinatesResEnd.zipcode;
  const streetNameE = coordinatesResEnd.streetName;
  const coordOr = {lat:coordinatesResIni.latitude,lon:coordinatesResIni.longitude};
  const coordDest = {lat:coordinatesResEnd.latitude,lon:coordinatesResEnd.longitude};
  const resultReturn = {coordOr:coordOr,cityO:city,countryO:country,zipcodeO:zipcode,streetNameO:streetName,
                        coordDest:coordDest,cityE:cityE,countryE:countryE,
                        zipcodeE:zipcodeE,streetNameE:streetNameE,provider:provider,distanceKM:distance.toFixed(1),distanceNM:distanceNM(distance)}
  const resultObject = []
  resultObject.push(resultReturn)
 
  return resultReturn;
}

const finalZipCodeCoorOne = async(coordinatesRes)=>{

  const city = coordinatesRes.city;
  const country = coordinatesRes.country;
  const zipcode = coordinatesRes.zipcode;
  const streetName = coordinatesRes.streetName;
  const provider = coordinatesRes.provider;
  const coordOr = {lat:coordinatesRes.latitude,lon:coordinatesRes.longitude};

  const resultReturn = {coord:coordOr,city:city,country:country,zipcode:zipcode,streetName:streetName,
                        provider:provider}
  const resultObject = []
  resultObject.push(resultReturn)
 
  return resultReturn;
}

exports.coordToDistance = async function (coordInitial,coordFinal, type){
    const transcooI = await desgloseCoor(coordInitial,type);
    const transcooF = await desgloseCoor(coordFinal,type);
    
    if (!transcooI || !transcooF) return new Error('Coordinates not valid')
    
    const distance = getDistanceFromLatLonInKm(transcooI,transcooF);
    const aRes = await final(transcooI,transcooF,distance)
    
    return aRes;
}

exports.coordToLocation = async function(coordInitial,type){
  const transcoo = await desgloseCoor(coordInitial,type);
  if (!transcoo) return new Error('Coordinates not valid');
  const coordinatesRes = await functionFinal(transcoo);
  const aRes = await finalZipCodeCoorOne(coordinatesRes[0]);
  return aRes;
};

//countryIni,codPostIni,countryEnd,codPostEnd
exports.codPostToDistance = async function(countryIni,codPostIni,countryEnd,codPostEnd){
  const coor1 = await searchByZip(countryIni,codPostIni);
  const coor2 = await searchByZip(countryEnd,codPostEnd);
  if (!coor1.length || !coor2.length){
    if (!coor1.length)  return ('ERROR!!Zip code or Country no exists in first coordinate');
    return ('ERROR!! Zip code or Country no exists in second coordinate');
  }else{
    const searchcoo1 = {lat:coor1[0].latitude,lon:coor1[0].longitude};
    const searchcoo2 = {lat:coor2[0].latitude,lon:coor2[0].longitude};
    const distance =  getDistanceFromLatLonInKm(searchcoo1,searchcoo2);
    const bRes = await finalZipCodeCoor(coor1[0],coor2[0],distance);
    return bRes;
  };
};

exports.codPostToLocation = async function(country,codPost){
  const coor = await searchByZip(country,codPost);
  if (!coor.length){
    return ('ERROR!! Zip code or Country no exists');
  }else{
    const bResOne = await finalZipCodeCoorOne(coor[0]);
    return bResOne;
  }
};

