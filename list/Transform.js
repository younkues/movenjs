(function(anim) {
	var transform = anim.Transform = function Transform(oOrder) {
		this.list = {};
		this.oOrder = oOrder || {};
		
	}
	var transformList = transform.list = {"gleft":"translateX(?)","tx":"translateX(?)", "gtop":"translateY(?)","ty":"translateY(?)","tz":"translateZ(?)", "rotate":"rotate(?)", "scale" : "scale(?)", "rotateX":"rotateX(?)", "rotateY":"rotateY(?)"};
	transform.has = function(name) {
		return transformList.hasOwnProperty(name);
	}
	daylight.extend(true, transform.prototype, $CSSList.prototype);
/*
if(action === "tx" || action === "ty" || action === "tz") {
	index = transformList.indexOf("rotate");
	if(index !== -1) {
		transformList.splice(index, 0, action);
		continue;
	}
}
*/
	transform.prototype.get = function(prefix) {
		var list = this.list;
		var value;
		var transform;
		var sStyle = "{prefix}transform:";
		var length = 0;
		var aOrder = [], aOrderLength = 0;
		var nOrderIndex = 0;
		var ret = [];
		var nOrder;
		for(var name in list) {
			value = list[name];
			if(!transformList.hasOwnProperty(name))
				continue;
				
			transform = transformList[name];
			nOrder = this.oOrder[name] || 20;
			
			value = transform.replace("?", list[name]);
			if(!this.oOrder.hasOwnProperty(name)) {
				ret.push(value);
			} else {
				nOrder = this.oOrder[name];
				nOrderIndex = 0;
				for(var i = 0; i < aOrderLength; ++i) {
					if(nOrder > aOrder[i])
						nOrderIndex = i + 1;
				}
				aOrder.splice(nOrderIndex, 0, nOrder);
				ret.splice(nOrderIndex, 0, value);
			}
			++length;
		}
		if(length === 0)
			return "";
		
		sStyle += ret.join(" ") + ";";
		return anim.prefixToBrowser(sStyle, prefix);
	};
	
	
	daylight.defineGlobal("$Transform", transform);
	
})(daylight.animation);
