(function(anim) {
	var filterPrefix = ["", "-webkit-", "-ms-"];
	var Filter = anim.Filter = function Filter() {
		this.list = {};
	}
	
	var FilterList = Filter.list = {};
	var filterKeys = ["brightness", "blur", "grayscale", "contrast", "hue-rotate", "opacity", "saturate"];
	var length = filterKeys, filter;
	for(var i = 0; i < length; ++i) {
		filter = filterKeys[i];
		Filter.list[filter] = filter + "(?)";
	}
	Filter.has = function(name) {
		return FilterList.hasOwnProperty(name);
	}
	daylight.extend(true, Filter.prototype, $CSSList.prototype);

	Filter.prototype.get = function(prefix) {
		var list = this.list;
		var value;
		var filter;
		var sStyle = "{prefix}filter:";
		var length = 0;
		for(var name in list) {
			value = list[name];
			if(!FilterList.hasOwnProperty(name))
				continue;
				
			filter = FilterList[name];
			sStyle += " " +  filter.replace("?", list[name]);
			++length;
		}
		if(length === 0)
			return "";
		
		sStyle += ";";
		return anim.prefixToBrowser(sStyle, prefix, filterPrefix);
	};
	
	
	daylight.defineGlobal("$Filter", Filter);
	
})(daylight.animation);
