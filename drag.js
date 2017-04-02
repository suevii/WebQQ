//封装获取class元素的函数
//(document.getElementsByClassName在IE10浏览器之前不支持)
function getByClass(clsName, parent){	
	//parent的ID为可选参数，若有parent则是在该parent下获取clsName，否则则是从document中获取
	var oParent = parent ? document.getElementById(parent) : document,	//oParent为parent的ID而不是parent对象
		eles = [],
		elements = oParent.getElementsByTagName('*');	//父元素下所有元素

		for(var i = 0, l = elements.length; i < l; i ++){
			if(elements[i].className == clsName)
				eles.push(elements[i]);
		}
	return eles;
}
var oDrag = document.getElementById('loginPanel');
window.onload=drag;

/*
三步：
1.在标题区域按下
2.在页面中拖动
3.释放鼠标停止拖动
*/
function drag(){
	var oTitle = getByClass('login_logo_webqq','loginPanel')[0];//getByClass返回的是数组
	var close_btn = document.getElementById('ui_boxyClose');
	oTitle.onmousedown = fnDown;
	close_btn.onclick = function(){
		document.getElementById('loginPanel').style.display = 'none';
	}
	//切换状态
	var loginState = document.getElementById('loginState'),
		loginStateShow = document.getElementById('loginStateShow'),
		stateList = document.getElementById('loginStatePanel'),	//切换状态的面板
		lis = stateList.getElementsByTagName('li'),
		stateTxt = document.getElementById('login2qq_state_txt');
	//由于冒泡规则，点击loginState的同时会冒泡到document，而document使列表隐藏，所以这里要阻止冒泡
	loginState.onclick = function(e){
		stateList.style.display = 'block';
		e = e || window.event;
		if(e.stopPropagation){
			e.stopPropagation();
		}else{
			e.cancelBubble = true;
		}
	}
	//鼠标划过状态列表时
	for(var i = 0, l = lis.length; i < l; i ++){
		lis[i].onmouseover = function(){
			this.style.background = '#567';
		}
		lis[i].onmouseout = function(){
			this.style.background = '#fff';
		}
		lis[i].onclick = function(e){	
			//由于事件冒泡的规则，这里点击了lis[i]同时也点击了loginState，导致lis无法关闭，所以要阻止冒泡
			e = e || window.event;
			if(e.stopPropagation){	//浏览器兼容
				e.stopPropagation();
			}else{
				e.cancelBubble = true;
			}
			var id = this.id;
			stateTxt.innerHTML = getByClass('stateSelect_text', id)[0].innerHTML;
			loginStateShow.className = '';	//先置空
			loginStateShow.className = 'login-state-show ' + id;
			stateList.style.display = 'none';
		}
	}
	//点开状态列表后，点击页面空白处能关闭列表
	document.onclick = function(){
		stateList.style.display = 'none';
	}
}

//拖动原理：方框的坐标跟随鼠标坐标变化
function fnDown(){
	//所有浏览器都支持clientX和clientY属性，它们是event的属性
	//onmousemove：当鼠标指针在元素内部移动时重复触发
	//因为是在整个页面移动，所以是对象是document
	event = event || window.event;
	var oDrag = document.getElementById('loginPanel'),
		disX = event.clientX - oDrag.offsetLeft,	//光标按下时光标和面板左边的距离
		disY = event.clientY - oDrag.offsetTop;
	//鼠标拖动事件
	document.onmousemove = function(event){
		event = event || window.event;
		fnMove(event, disX, disY);
	}
	//鼠标释放事件：mouseup
	document.onmouseup = function(){
		//卸载事件
		document.onmousemove = null;
		//document.onmouseup = null;	//？？这句加了只有第一次拖是对的，第二次拖就放不开了
	}

}

function fnMove(e, posX, posY){
	var oDrag = document.getElementById('loginPanel'),
		l = e.clientX - posX,
		t = e.clientY - posY,
		winW = document.documentElement.clientWidth || document.body.clientWidth,
		winH = document.documentElement.clientHeight || document.body.clientHeight,
		maxW = winW - oDrag.offsetWidth - 10,
		maxH = winH - oDrag.offsetHeight;
	//限制拖动范围在页面内部，不能超出页面
	//拖动时边缘出现滚动条的原因：
	//关闭按钮有top:-10px,left:-10px，所以关闭按钮会溢出10px，所以这里t=10，l = maxW-10
	if(l < 0){
		l = 0;
	}else if(l > maxW){
		l = maxW;
	}
	if(t < 0){
		t = 10;
	}else if(t > maxH){
		t = maxH;
	}
	oDrag.style.left = l + 'px';
	oDrag.style.top = t + 'px';
}

function fnOut(){
	var oDrag = document.getElementById('loginPanel');
}
