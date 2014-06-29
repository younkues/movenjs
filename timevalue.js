(function(animation) {
	var dimensionType = ["px", "em", "%"];
	function _dot(a1,a2,b1,b2) {
		if(b1 + b2 === 0)
			return a1;
		return a1 * b2 / (b1 + b2) + a2 * b1 / (b1 + b2);
	}
	function _abspx(a, p100) {
		var v = parseFloat(a);
		if(p100 && a.indexOf("%") > -1)
			return v * p100 / 100;
		else
			return v;
	}
	function _percentage(a, p100) {
		var v = parseFloat(a);
		if(p100 && a.indexOf("%") === -1)
			return v * 100 / p100;
		else
			return v;		
	}
	function _getDimensionType(a) {
		var length = dimensionType.length;
		for(var i = 0; i < length; ++i) {
			if(a.indexOf(dimensionType[i]) != -1)
				return dimensionType[i];
			}
		return "";
	}
	function hexToRGB(h) {
		h = cutHex(h);
		var r = parseInt(h.substring(0,2), 16);
		var g = parseInt(h.substring(2,4), 16);
		var b = parseInt(h.substring(4,6), 16);
		return [r, g, b];
	}
	//function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
	//function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
	//function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
	function cutHex(h) {return (h.charAt(0)==="#") ? h.substring(1,7):h}
	function hex4to6(h) {
		var r = h.charAt(1);
		var g = h.charAt(2);
		var b = h.charAt(3);
		var arr = [r, r, g, g, b, b];
		
		return arr.join("");
	}
	function getRGB(v) {
		var rgb = [];
		if(v.charAt(0) === "#")  {
			if(v.length === 4) {
				rgb = hexToRGB(hex4to6(v));
			} else if(v.length === 7) {
				rgb = hexToRGB(v);
			}
		} else if(v.indexOf("rgb(") === 0 || v.indexOf("rgba(") === 0) {
			v = v.replace("rgb(", "");
			v = v.replace("rgba(", "");			
			v = v.replace(")", "");
			v = v.replaceAll(" ", "");
			rgb = v.split(",");
			var length = rgb.length;
			for(var i = 0; i < length; ++i) {
				rgb[i] = parseInt(rgb[i]);
			}
		}
		return rgb;
			
	}
	function color(value1, value2, time1, time2) {
		var rgb = [];
		var rgb1 = getRGB(value1);
		var rgb2 = getRGB(value2);
		
		console.log(rgb1, rgb2);
		var length1 = rgb1.length;
		var length2 = rgb2.length;
		if(length1 !== length2) {
			if(length1 === 4)
				rgb2[3] = 1;
			if(length2 === 4)
				rgb1[3] = 1;
			
			length1 = length2 = 4;
		}
		for(var i = 0; i < length1; ++i) {
			rgb[i] = parseInt(_dot(rgb1[i], rgb2[i], time1, time2));
		}
		if(length1 === 3)
			return "rgb(" + rgb.join(",") + ")";
		if(length2 === 4)
			return "rgba(" + rgb.join(",") + ")";
		
		return "rgb(0, 0, 0)";
	}
	function margin(element, value1, value2, time1, time2) {
		var v1 = value1.split(" "), v2 = value2.split(" ");
		var length1 = v1.length;
		var length2 = v2.length;
		var i;
		var width = element.parent().innerWidth();
		var height = element.parent().innerHeight();
		var margin = [];
		var m1, m2, t1, t2;
		if(length1 === length2) {
			if(length1 === 1) {
				t1 = _getDimensionType(v1[0]);
				t2 = _getDimensionType(v2[0]);
				m1 = _abspx(v1[0]);
				m2 = _abspx(v2[0]);
				if(t1 === t2)
					return _dot(m1, m2, time1, time2) + t1;

				v1 = [v1[0], v1[0]];
				v2 = [v2[0], v2[0]];
				length1 = 2;
				length2 = 2;
			}
			for(i = 0; i < length1; ++i) {
				m1 = v1[i];
				m2 = v2[i];
				if(i % 2 === 0) {
					m1 = _abspx(m1, width);
				} else {
					m1 = _abspx(m1, height);
				}
				margin.push(_dot(m1, m2, time1, time2) + "px");
			}
		}
	}
	function origin(element, value1, value2, time1, time2) {
		if(!value1)
			value1 = "50% 50%";
		
		if(!value2)
			value2 = "50% 50%";
		var v1 = value1.split(" ");
		var v2 = value2.split(" ");
		var length1 = v1.length;
		var length2 = v2.length;
		var origin = [];
		var width = element.innerWidth();
		var height = element.innerHeight();
		var m1, m2;
		for(var i = 0; i < length1; ++i) {
			m1 = _percentage(v1[i], width);
			m2 = _percentage(v2[i], height);
			origin.push(_dot(m1, m2, time1, time2) + "%");
		}
		return origin.join(" ");
	}
	/**
	*
	* @param {number} time 애니메이션이 재생되고 있는 시간의 위치
	* @param {string} property 찾고 싶은 CSS 속성
	* @param {object} prevMotion time 이전의 property를 가지고 있는 모션.
	* @param {object} nextvMotion time 이후의 property를 가지고 있는 모션.
	* @return {string | number} 이전 시간과 이후 시간을 현재시간에 비례하여 내적을 한 값을 반환한다.
	* @desc  이전 시간과 이후 시간을 현재시간에 비례하는 값을 찾아준다.
	*/
	animation.Layer.prototype.getTimeValue = function(time, property, prev, next) {
		var prevMotion = prev.hasOwnProperty(property) ? prev[property] : prev[property + sAuto] ;
		var nextMotion = next.hasOwnProperty(property) ? next[property] : next[property + sAuto];
		var dimension = "";
		
		if(prevMotion === nextMotion)
			return prevMotion;
			
		var value = prevMotion;
		if(lrtype.indexOf(property) !== -1)
			dimension =  "width";
		else if(tbtype.indexOf(property) !== -1)
			dimension = "height";
		else if(dtype.indexOf(property) !== -1)
			dimension = "dimension";
		
		var prevTime = time - prev.time;
		prevTime = prevTime >= 0 ? prevTime : 0;
		var nextTime = next.time - time;
	
		try {
			if(dimension === "width" || dimension === "height") {
				var p100 = this.dl_object.dimension(dimension);//100퍼센트 기준으로 수치
		
				prevMotion = _abspx(prevMotion, p100);
				nextMotion = _abspx(nextMotion, p100);
				value = _dot(prevMotion, nextMotion, nextTime, prevTime) +"px";
			} else if(dimension === "dimension") {
	
				var oprevMotion;
				prevMotion = _abspx(prevMotion);
				nextMotion = _abspx(nextMotion);
				
				if(prevMotion === nextMotion)
					return oprevMotion;
				
				//console.log(prevMotion, nextMotion);
				value = _dot(prevMotion, nextMotion, nextTime, prevTime);
				//console.log(property, value, prevMotion, nextMotion);
				switch(property) {
				case "rotate":
					value = value + "deg";
					break;
				case "tx":
				case "ty":
				case "tz":
				case "gtop":
				case "gleft":
					value = value + "px";
					break;
				}
			} else {
				switch(property) {
				case "scale":
					var fromScale = prevMotion.split(",");
					var toScale = nextMotion.split(",");
					var xScale = _dot(parseFloat(fromScale[0]), parseFloat(toScale[0]), nextTime, prevTime);
					var yScale = _dot(parseFloat(fromScale[1]), parseFloat(toScale[1]), nextTime, prevTime);
					return xScale +", " + yScale;
				}		
				var dlElement = this.dl_object;
				switch(property) {
					case "margin":
					case "padding":
						return margin(dlElement, prevMotion, nextMotion, prevTime, nextTime);
						break;
					case "origin":
						return origin(dlElement, prevMotion, nextMotion, prevTime, nextTime);
						break;
					case "color":
					case "background-color":
						return color(prevMotion, nextMotion, prevTime, nextTime);
						break;
					default:
						return "transition";
				}
			}
		} catch(e) {
			console.error("time :" + time, "property : " + property, "value : " + value, e);
		}
		return value;
	}
})(daylight.animation);