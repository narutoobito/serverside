const express= require("express");
const app = express();
const fetch= require('node-fetch');
const datastore= require('nedb');
require('dotenv').config();
const port= process.env.PORT || 3000;
app.listen(port, ()=> {console.log("listening at "+port+".....")});
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));
const database=new datastore('database.db');
database.loadDatabase();

app.get('/api', (request,response)=>
{
//response.json({ test: 123});
database.find({},(err, data)=>
{ if(err){
response.end();
return;
}
response.json(data);
}
)
});
app.post('/api',(request,response)=>{
database.insert(request.body);
data=request.body;
const timestamp=Date.now();
data.timestamp=timestamp;
response.json({
status: 'success',
timestamp: timestamp,
latitude: data.lat,
name: data.inputname,
longitude: data.lon
});
});

app.get('/weather/:latlon', async (request,response)=>
{
   const latlon= request.params['latlon'].split(',');
   lat=latlon[0];
   lon=latlon[1];
   apikey= process.env.API_KEY;
   const weather_url="https://api.darksky.net/forecast/"+ apikey + "/"+lat+","+lon;

    const weather_response= await fetch(weather_url);
    const weather_data= await weather_response.json();
    console.log(lat,lon);

   const aq_url="https://api.openaq.org/v1/latest?coordinates="+lat+","+lon;
    const aq_response = await fetch(aq_url);
    const aq_data = await aq_response.json();

    const data={
    weather: weather_data,
    aq: aq_data
    };
    response.json(data);

 });