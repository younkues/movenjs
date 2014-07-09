(function(daylight) {
	var animation = daylight.animation;
	function errorMessage(message) {
		console.error(message);
		alert(message);
		return;
	}
	
	
	function getStyle(styles, ignores) {
		var style = "";
		if(!ignores.hasOwnProperty("position")) {
			styles.position = styles.position || "relative";
			console.debug(ignores);
		}
		for(var property in styles) {
			if(ignores.hasOwnProperty(property))
				continue;
			
			style += property +":" + styles[property] +";";
		}
		return style;
	}
	function createLayer(timeline, element, json) {
		var motions = json.ms || json.motions || 0;
		
		if(!motions)
			return;
			
		var layer = timeline.createLayer(element);
		var totalTime = json.tt || json.totalTime || 0;
		var properties = json.p || json.properties || [];
		var style = json.s || json.style || {};

		
		layer.properties = properties;
		layer.motions = motions;
		
		
		if(json.position && timeline.dl_object.equal(element)) {
			style.position = json.position;
			layer.applyAll("position", json.position);
		}

		layer.totalTime = totalTime < timeline.totalTime ? timeline.totalTime : totalTime;
		
		if(timeline.totalTime < layer.totalTime) {
			timeline.totalTime = layer.totalTime;
		}
		
		if(style) {
			var motions = {
				time: 0,
				fill: "add"
			}
			for(var property in style) {
				motions[property] = style[property];
			}
			layer.addMotion(motions);
		}

	}

	function createElement(json) {
		
		var name = json.n || json.name;
		var motions = json.ms || json.motions || [];
		var layerName = json.ln || json.layerName || -1;
		var is_fold = json.f;//프로젝트용
			
		if(!name)
			return errorMessage("Nonamed 잘못된 형식입니다.");
		
		var id = json.i || json.id;
		var className = json.cn || json.className;
		var style = json.s || json.style || {};
		
		var element = daylight.createElement(name, {id:id, class:className});
		style = getStyle(style, motions[0] || {});
		
		element.setAttribute("style", style);
		element.setAttribute("data-style", style);

		if(is_fold)
			element.setAttribute("fold", "fold");
			
		if(layerName !== -1)
			element.setAttribute("layer-name", layerName);	
		return element;
	}
	function create(json, timeline) {
		if(!timeline)
			return;
					
		var element = createElement(json);
		
		createLayer(timeline, element, json);
		if(daylight.hasClass(element, "day-text-editable")) {
			element.innerHTML = json.cns.join("");
		} else {
			createchildNodes(json, element, timeline);
		}
		
		return element;
	}
	function createchildNodes(json, element, timeline) {
		var childNodes = json.cns || json.childNodes || 0;
		var childLength = childNodes.length;
		var value = "";
		
		for(var i = 0; i < childLength; ++i) {
			value = childNodes[i];
			if(typeof value !== "object")
				element.insertAdjacentHTML("beforeend", value);
			else
				element.appendChild(create(childNodes[i], timeline));
		}	
	}
	
	animation.Timeline.import = function(json, position) {
		
		var name = json.n || json.name;
		if(!name)
			return errorMessage("NoNamed 잘못된 형식입니다.");
			

		var scenes = json.ss || json.scenes || [0];
		
		var element = createElement(json);
		

		var timeline = new animation.Timeline(element);
		timeline.scenes = scenes;
		json.position = position || "";
		createLayer(timeline, element, json);
		
		createchildNodes(json, element, timeline);
		return timeline;
	}
	animation.Timeline.load = function(element, json, position) {
		var dlElement = $(element);
		var timeline = this.import(json, position);
		dlElement.append(timeline.dl_object);
		
		return timeline;
	}
})(daylight);