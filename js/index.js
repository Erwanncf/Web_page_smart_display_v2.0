var myVar = setInterval(myTimer, 30000);
var newDataFlag = 1;
var temperatur = 'nc';
var Humidite='nc';
var PsAtmo= 'nc';
var Luminosite = 'nc';
var bruit = 'nc';
var Altitude = 'nc';
var tempCaf = 'nc';
var heure= 'nc';
var Message = 'nc';
var IP = 'nc';
var Box = 'nc';
var d= new Date();
var RSSI = 'nc';
var SourceRss = 'nc';
var Status = 'nc';

var h = 30;
var dateData;
var dateDataMemory ;
var etatCaf = "Eteinte";
var Occupation  = "Non occupée";
var c = false;
var timeOut = 0;
var EtatDisplay = "Connecté";
var clb;

// var msg = document.getElementById('msg');

  

   

	(function(w, d, s, id, n)
			{
				

				w[n] = w[n] || {q: [],

					init: function(o) {w[n].initOpts = o;},

					ready: function(c) {w[n].q.push(c);}};

				var js, fjs = d.getElementsByTagName(s)[0];

				if (d.getElementById(id)) {return;}

				js = d.createElement(s); js.id = id;

				js.src = "https://cdn.by.wonderpush.com/sdk/1.1/wonderpush-loader.min.js";

				fjs.parentNode.insertBefore(js, fjs);

			}(window, document, "script", "wonderpush-jssdk-loader", "WonderPush"));

			 

			WonderPush.init({

				webKey: "f8af2631e9bc3fede55d22dfa04bd264a2cba99f467e7dd3046295ae8a140b4c",

				optInOptions: {

					// You can modify or translate the following:

					modalBoxMessage: "We will send you personalized notifications.<br/>You can always unsubscribe at any time.",

					modalBoxButton: "Got it!",

					externalBoxProcessingMessage: "Subscribing...",

					externalBoxSuccessMessage: "Thanks for subscribing!",

					externalBoxFailureMessage: "Sorry, something went wrong.",

					externalBoxTooLongHint: "Poor connection or private browsing?",

					externalBoxCloseHint: "Close"

				}

			});
			


function displayMyVar (targetElementId)
  {
	 
	document.getElementById('target1').innerHTML = temperatur ;
	document.getElementById('target2').innerHTML = Humidite;
	document.getElementById('target3').innerHTML = PsAtmo;
	document.getElementById('target5').innerHTML = bruit;
	document.getElementById('target6').innerHTML = tempCaf;
	document.getElementById('target7').innerHTML = Message;
	document.getElementById('target8').innerHTML = IP;
    document.getElementById('target9').innerHTML = etatCaf;
	document.getElementById('target10').innerHTML = Occupation;
	document.getElementById('target11').innerHTML = EtatDisplay;
	document.getElementById('target13').innerHTML = Box;
	document.getElementById('target12').href= "http://" + IP + "/";
	document.getElementById('target14').innerHTML = RSSI;
	document.getElementById('target15').innerHTML = SourceRss;
	document.getElementById('target16').innerHTML = Status;


  }
   

function getSensors(clb)
{
	 
	var urlSensors = 'https://liveobjects.orange-business.com/api/v0/data/streams/urn%3Alo%3Ansid%3AsmartDisplay%3A1856745!Data?limit=100';
	var req = new XMLHttpRequest();
	req.onreadystatechange = function (aEvt) 
	{  
	  if (req.readyState == 4) 
	  {
			//console.log(req.readyState);
			//console.log(req.status);
			if(req.status == 200)
			{
			
				var ArrData = JSON.parse(req.responseText);
				var LastData= ArrData[0];				
				//console.log(LastData);
				
				var AllValue = LastData.value;
				//console.log(AllValue);
				
				
				dateData = LastData.timestamp;
				//console.log(dateData);
				document.getElementById("demo").innerHTML = new Date(dateData);
				
								
				heure = d.getHours();
				// console.log(heure);
				
				if (dateData != dateDataMemory)
				{	if(tempCaf >50 | bruit > 10  )
					{
						document.getElementById('xyz').play();
					}
					h = 30;
					dateDataMemory = dateData;
				}
				
				temperatur = AllValue.Temp;
				Humidite = AllValue.Hygro;
				PsAtmo = AllValue.PsAt;
				Luminosite = AllValue.Lum;
				bruit = AllValue.Bruit;
				Altitude = AllValue.Alt;
				tempCaf = AllValue.tempCaf;
				Message = AllValue.Message;
				IP = AllValue.IP;
				Box = AllValue.Box;
				RSSI = AllValue.RSSI;
				SourceRss = AllValue.SourceRss;
				Status = AllValue.Status
				
				if (tempCaf > 50)
				{
					etatCaf = "Allumée"
					c = true;
				}
				else 
				{
					etatCaf = "Éteinte"
					c = false;
				}
				
				if (bruit > 10)
				{
					Occupation = "Occupée"
				}
				else 
				{
					Occupation  = "Non occupée"
				}
				
				if(c== true) 
				{
				  document.getElementById("img").setAttribute("src","café.gif"); 
				}
				
				if (timeOut <30)
				{
					EtatDisplay = "Connecté";
				}
				else
				{
					EtatDisplay = "Déconnecté";
				}
				ajax('http://crossorigin.kmt.orange.com/' + SourceRss, function (str)
				{
					var datas = []
					var parser = new DOMParser();
					items = parser.parseFromString(str, "application/xml").querySelectorAll('item')
					Array.prototype.forEach.call(items, function (item) 
					{
						var data = 
						{
							title:item.querySelector('title').textContent,
							description:item.querySelector('description').textContent,
							link: item.querySelector('link').textContent,
							date: new Date(item.querySelector('pubDate').textContent)
						}
						datas.push(data)
						//console.log(data);
					});
					clb(datas)
				})
				displayMyVar ();	
			}
			else
			{
				console.log("Erreur pendant le chargement de la page.\n");
			}

	  }
	};
	req.open('GET', urlSensors , true);
	req.setRequestHeader("X-API-KEY", '7ef7949fb37c454aa3087f63c276573d');
	req.send(null);	
}

function myTimer(setTime) 
{
	if ( h>setTime ) {
		//l'incrémenter 
		h--;
		//inserer la nouvelle heure 
		document.getElementById("heure").innerHTML = h;
		timeOut = 0;
      }
	  else
	  {
		getSensors();  
		timeOut=timeOut+1;
	  }
	  
}

function ajax(url, fn) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.onload = function() { 
    if (request.status >= 200 && request.status < 400)
      fn(request.responseText);
  };
  request.send();
}




getSensors(function(datas)
{
	var ul = document.querySelector('.rssData')
	for (var i = 0; i < 5; i++) {
		var date  =   datas[i].date.getHours() + ':' + datas[i].date.getMinutes() + '  ' + datas[i].date.getDate() + '/' + (datas[i].date.getMonth()+1) + '/' + datas[i].date.getFullYear()
		ul.innerHTML += '<li><a href="' + datas[i].link + '" target="_blank" > <p class="title">' + datas[i].title + '</p><p>' + datas[i].description + '</p> <span> ' + date + '</span></a>'
	}
})

function loadDoc() 
{
	
	var x = document.getElementById("frm1");
	console.log(x.elements[0]);
	var text = "";
	var i;
	for (i = 0; i < x.length ;i++) 
	{
		text += x.elements[i].value;
	}
	alert(text);
					
					 
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() 
	{
		if (this.readyState == 4 && this.status == 200) 
		{
			document.getElementById("demo").innerHTML = this.responseText;
		}
	};
    xhttp.open("POST", "https://liveobjects.orange-business.com/api/v0/data/streams/urn:lo:nsid:smartDisplay:WebPage!Msg", true);
	xhttp.setRequestHeader("Content-Type",'application/json');
	xhttp.setRequestHeader("Accept", 'application/json');
	xhttp.setRequestHeader("X-API-KEY", '7ef7949fb37c454aa3087f63c276573d');
	xhttp.send("{\"model\": \"MyModelSettingName\",\"value\": {\"Msg\":"+ '"' + text + '"' + "},\"tags\": [\"Erwann\"],\"metadata\": {\"source\": \"Smart Display Web page\"}}");
}




//déclencher la fonction toutes les secondes
window.setInterval("myTimer(0)", 1000); 
