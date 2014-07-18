timelinePrototype.export = timelinePrototype.exportToJSON = function(is_object, has_style) {
	var id = "";
	var dl_object = this.dl_object;
	var element = dl_object.get(0);
	this.stop();
	var layers = this.layers;
	var layerLength = layers.length;
	for(var i = 0; i < layerLength; ++i)
		layers[i].timer(0);
	if(has_style === undefined)
		has_style = true;



	var json = this._exportToJSON(element, has_style);
	json.ss = this.scenes;
	json.tt = this.totalTime;
	if(is_object)
		return json;
	return JSON.stringify(json);
	
};
(function() {
	var browserPrefix = CONSTANT.browserPrefix;
	var NO_CHILD = ["IMG"];
	var EXPORT_PROPERTIES = {"opacity":1, "box-sizing":"content-box", width:"0px", height:"0px" , "border-radius":"0px", "color":"rgb(255, 255, 255)", position:"static"};
	var POS = ["left","top", "right", "bottom"];
	var BACKGROUND = "background-";
	EXPORT_PROPERTIES[BACKGROUND + "color"] = "rgba(0, 0, 0, 0)";
	EXPORT_PROPERTIES[BACKGROUND + "image"] = "none";
	EXPORT_PROPERTIES[BACKGROUND + "size"] = "auto";
	EXPORT_PROPERTIES[BACKGROUND + "position"] = "0% 0%";

	EXPORT_PROPERTIES["margin"] = "0px";
	EXPORT_PROPERTIES["padding"] = "0px";
	EXPORT_PROPERTIES["border"] = "0px none rgb(0, 0, 0)";
	for(var i = 0; i < 4; ++i) {
		//EXPORT_PROPERTIES["border-"+ POS[i]] = {has:"0px"};
		//EXPORT_PROPERTIES["padding-"+ POS[i]] = "0px";
		//EXPORT_PROPERTIES["margin-"+ POS[i]] = "0px";
		EXPORT_PROPERTIES[POS[i]] = "auto";
	}
	var prefix;
	for(var i = 0; i < browserPrefix.length; ++i) {
		prefix = browserPrefix[i];
		//EXPORT_PROPERTIES[prefix + "transform"] = "none";
		//EXPORT_PROPERTIES[prefix + "transform-origin"] = "";
	}
	var _lengthObject = function(obj) {
		var count = 0;
		for(var i in obj) {++count;}
		return count;
	}
	var _exportStyle = function(element) {
		var exportStyle = {};
		var styles = window.getComputedStyle(element);
		try {		
			for(var property in EXPORT_PROPERTIES) {
	
				var propertyValue = styles[property];
				var propertyDefaultValue = EXPORT_PROPERTIES[property];
				if(typeof propertyValue === "undefined" || propertyValue === "" || propertyValue == propertyDefaultValue)
					continue;
				
				exportStyle[property] = propertyValue;
			}
			if(!exportStyle.position || exportStyle.postion === "static")
				exportStyle.position = "absolute";
		} catch (e){
			console.log(element, "type : " + element.nodeType, property);
		}			
		return exportStyle;
	}
	var _exportCheckRepeatStyle = function(style, motion) {
		for(var property in style) {
			if(motion[property] === style[property])
				delete style[property];
				
			if(property.indexOf("transform-origin") != -1) {
				if(!motion.hasOwnProperty("motion")) {
					motion.origin = style[property];
				}
				delete style[property];
			}
		}
	}
	timelinePrototype._exportToJSON = function(element, has_style) {
		var className = element.className;
		className = className.replace("daylightAnimationLayer", "");
		className = className.trim();
		//n name
		//i id
		//ln layer-name
		//ms motions
		//p properties
		//tt totalTime
		//cn childNodes
		//s style
		//f fold
		
		var json = {n:element.nodeName, i:element.id, cn:className, f:(element.getAttribute("fold") === "fold") ? 1 : 0};
		var layerName = element.getAttribute("layer-name");
		if(layerName !== null && layerName !== "")
			json.ln = layerName;
		var node, value;
		switch(json.name) {
		case "IMG": json.src = element.src;break;
		}
		
		var layer = this.getLayer(element);

		if(layer) {
			json.ms = layer.motions;
			json.tt = layer.totalTime;
			json.p = layer.properties;
			layer.optimize();
		}
	
		var childNodes = element.childNodes;
		var length = childNodes && childNodes.length || 0; 
		
		if(length !== 0)
			json.cns = [];
		
		if(daylight.hasClass(element, "day-text-editable")) {
			json.cns = [element.innerHTML];
		} else {
			for(var i = 0; i < length; ++i) {
				node = childNodes[i];
				//주석
				if(node.nodeType === 8)
					continue;
				if(node.nodeType === 3)
					continue;
				value = this._exportToJSON(childNodes[i], has_style);
				if(value) json.cns.push(value)
			}
		}
		json.s = has_style ?_exportStyle(element) : {};
		if(json.ms && json.ms[0] && json.ms[0].time === 0) {
			_exportCheckRepeatStyle(json.s, json.ms[0]);
		}
		if(_lengthObject(json.s) === 0)
			delete json.s;
			
		
		return json;
	}
}());
