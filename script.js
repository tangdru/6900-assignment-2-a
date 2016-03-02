console.log('Homework 2-A...')

d3.csv('data/hubway_trips_reduced.csv',parse,dataLoaded);

function dataLoaded(err,rows){

//console.log(rows);

//create crossfilter
var cfilter = crossfilter(rows);

//start filtering
//filter by year
var start2012 = new Date ('January 01, 2012 00:00:00'),
    end2012 = new Date ('December 31, 2012 23:59:59');
    
var tripsByYear = cfilter.dimension(function(d){return d.startTime});
    tripsIn2012 = tripsByYear.filterRange([start2012,end2012]).top(Infinity);
    console.log("Total trips in 2012", tripsIn2012.length);

//filter by male + registered users   
var tripsByGender = cfilter.dimension(function(d){return d.gender});
    tripsMale = tripsByGender.filter("Male").top(Infinity);
    //filter by registered users 
var tripsByRegistration = cfilter.dimension(function(d){return d.reg});
    tripsRegistered = tripsByRegistration.filter("Registered").top(Infinity);
    console.log("Total trips in 2012 by Male Registered Users", tripsRegistered.length);   
    tripsByGender.filter(null); 
    tripsByRegistration.filter(null);

    
//filter by trips starting at station 5    
var tripsByStation = cfilter.dimension(function(d){return d.startStation});
    tripsByStation5 = tripsByStation.filter("5").top(Infinity);
    console.log("Total trips in 2012 from station 5", tripsByStation5.length);
    tripsByStation.filter(null);
    tripsByYear.filter(null);
    
//top 50 trips regardless of other variables     
var tripsByDuration = cfilter.dimension(function(d){return d.duration});
    top50ByDuration = tripsByDuration.top(50);
    console.log("Top 50 trips by duration ", top50ByDuration);
    
//zero'ing out my filters
tripsByYear.filter(null);
tripsByGender.filter(null);
tripsByRegistration.filter(null);
tripsByStation.filter(null);
tripsByDuration.filter(null);
    
//trips by 10 year age increments
var tripsByAge = cfilter.dimension(function(d){return d.age});
var tripsByAgeGroup = tripsByAge.group(function(d){return Math.floor(d/10)}); //divide by 10(years)

var decades = tripsByAgeGroup.all();
    console.log("Trips separated by age group by decade ", decades)


    
    
    

}

var getDate= new Date(),
    getCurrentYear = getDate.getFullYear();

function parse(d){
    if(+d.duration<0) return;

    return {
        duration: +d.duration,
        startTime: parseDate(d.start_date),
        endTime: parseDate(d.end_date),
        startStation: d.strt_statn,
        endStation: d.end_statn,
        gender: d.gender,
//        gender: d['gender']!='..'?d['gender']:undefined,
        reg: d.subsc_type,
        age: getCurrentYear-(+d.birth_date),
    }
}
               
            

function parseDate(date){
    var day = date.split(' ')[0].split('/'),
        time = date.split(' ')[1].split(':');

    return new Date(+day[2],+day[0]-1, +day[1], +time[0], +time[1]);
}

