const URL = "https://tools.keycdn.com/geo.json?host=";

const HEADERS = new Headers({
    "Accept"       : "application/json",
    "Content-Type" : "application/json",
    "User-Agent"   : "keycdn-tools:https://ergo.codenode.hu"
});

var dataIn = [];
var dataOut = [];

async function get() {
    //perform IP lookup
    let req = dataIn.splice(0, 3);console.log(req);
    for(i in req) {
        await fetch(URL + req[i].address, {
        method  : "GET",
        mode: 'no-cors',
        credentials: 'include',
        headers : HEADERS 
        })
        .then(x => console.log(x))
        .then(res => res.json())
        .then(out => {
            dataOut[i].latitude = out.data.geo.latitude;
            dataOut[i].longitude = out.data.geo.longitude;
        })
        .catch(err => console.error(err));
    }
    
    //post
    postMessage(dataOut);
    setTimeout("get()", 5 * 1100);
}

self.addEventListener("message", function(event) {
    dataIn = event.data;
    get();
}, false);