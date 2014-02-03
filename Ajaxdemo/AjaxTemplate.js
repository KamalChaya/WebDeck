AJAXTemplate = function(x,alertsZZ,varsZZ,MethodZZ,targetZZ,AJAXZZ){
	if(alertsZZ == "on"){
		alert("Function accessed");
	}
	
	if(window.XMLHttpRequest){
		a[x][0] = new XMLHttpRequest();
	}else{
		a[x][0] = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	if(alertsZZ == "on"){
		alert("Request was generated");
		alert(a[x][0]);
	}
	
	a[x][0].open(MethodZZ,targetZZ,AJAXZZ);
	if(alertsZZ == "on"){
		alert("Call was made");
	}
	if(MethodZZ == "POST"){
		a[x][0].setRequestHeader("Content-type","application/x-www-form-urlencoded");
		if(alertsZZ == "on"){
			alert("Header was set");
		}
	}
	var holder = '';
	holder += varsZZ[0];
	for(var i = 1; i<(varsZZ.length); i++){
		holder += '&';
		holder += varsZZ[i];
	}
	
	if(alertsZZ == "on"){
		alert("Variables stringed. Output: "+holder);
	}

	a[x][0].send(holder);
	
	if(AJAXZZ == false){
		return a[x][0].responseText;
	}else{}
}


AJAXTemplateS = function(x,varsZZ,MethodZZ,targetZZ,AJAXZZ){
	a[x] = new Array(2);
	if(window.XMLHttpRequest){
		a[x][0] = new XMLHttpRequest();
	}else{
		a[x][0] = new ActiveXObject("Microsoft.XMLHTTP");
	}
	a[x][0].open(MethodZZ[0],targetZZ,AJAXZZ);
	if(MethodZZ[0] == "POST"){
		a[x][0].setRequestHeader(MethodZZ[1],MethodZZ[2]);
	}
	var holder = '';
	holder += varsZZ[0];
	for(var i = 1; i<(varsZZ.length); i++){
		holder += '&';
		holder += varsZZ[i];
	}
	a[x][0].send(holder);
	if(AJAXZZ == false){
		return a[x][0].responseText;
	}else{}
}
