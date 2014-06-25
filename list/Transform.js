(function(anim) {

	var transform = anim.Transform = function Transform() {
		this.list = {};
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
		for(var name in list) {
			value = list[name];
			if(!transformList.hasOwnProperty(name))
				continue;
				
			transform = transformList[name];
			sStyle += " " +  transform.replace("?", list[name]);
			++length;
		}
		if(length === 0)
			return "";
		
		sStyle += ";";
		return anim.prefixToBrowser(sStyle, prefix);
	};
	
	
	daylight.defineGlobal("$Transform", transform);
	
})(daylight.animation);
