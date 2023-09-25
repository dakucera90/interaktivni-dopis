const data = './data/scene.json';


function insertHTML() {
    return `
        <div id="wrapper">

            <div id="main_box">

				<div id="scene_box">
					<div id="image_box" class="image_box">
						<img src="">
					</div>
				</div>

				<div id="name_box">
					<span></span>
				</div>

                <div id="text_box" class="box">

					<p class="text"></p>

					<div id="options_box">
						<p class="options"></p>
					</div>

					<div id="next" class='button' />

				</div>

            </div>
        </div>
    `
}

const htmlData = insertHTML();
document.getElementById('engine').insertAdjacentHTML("beforebegin", htmlData);

const $main_box = document.querySelector("#main_box");
const $scene_box = document.querySelector("#scene_box");
const $name_box = document.querySelector("#name_box span");
const $text_box = document.querySelector("#text_box p");
const $next = document.querySelector("#next");
const $image_box = document.querySelector("#image_box img");
const $options_box = document.querySelector("#options_box p");
const $options_item = document.querySelector("#options_item div");

let json, to;

let pageNum = 0;
let currentPage;

async function grabData() {
    const resp = await fetch(data);
    json = await resp.json();
    currentPage = Object.keys(json.Scene1.Pages)[pageNum];
    initialize(json);
    handleOptions(json);
}

async function initialize(data) {
	$scene_box.src = "";
	$text_box.src = "";
	$name_box.src = "";
    $image_box.src = "";

    $scene_box.style.backgroundImage = "url(" + data.Scene1.Background + ")";
    $name_box.innerText = data.Scene1.Pages[currentPage].Character;
	$image_box.src = data.Scene1.Pages[currentPage].Picture;
	$next.innerHTML = "Další ➔";

	typeWriter(data.Scene1.Pages[currentPage].Text);
}

function handleOptions(data) {
    $options_box.src = "";
	if (data.Scene1.Pages[currentPage].hasOwnProperty("Options")) {
		$name_box.style.visibility = "hidden";
		$image_box.style.visibility = "hidden";
		var o = data.Scene1.Pages[currentPage].Options;
		var str = Object.keys(o).forEach(k => {
			const item = document.createElement("div");
			item.innerHTML = "<div class='options_item button'>" + `${k}` + "</div>"
			$options_box.appendChild(item);
			item.addEventListener("click", () => { 
				currentPage = (o[k]);
				pageNum = Object.keys(json.Scene1.Pages).indexOf(currentPage);
				initialize(json);
				$options_box.innerHTML = "";
				$name_box.style.visibility = "visible";
				$image_box.style.visibility = "visible";
			})
		})
	}
}

function typeWriter(txt, i) {
	i = i || 0;
	if (!i) {
		$text_box.innerHTML = "";
		clearTimeout(to);
	}
	var speed = 30;
	if (i < txt.length) {
		$next.style.visibility = "hidden";
		var c = txt.charAt(i++);
		if (c === " ")
		c = "&nbsp;";
	    $text_box.innerHTML += c;
	    to = setTimeout(function() {
	    	typeWriter(txt, i)
	    }, speed);
	}
	else if (json.Scene1.Pages[currentPage].hasOwnProperty('Options')) {
		$next.style.visibility = "hidden";
	}
	else if (json.Scene1.Pages[currentPage].hasOwnProperty('NextPage')) {
		$next.style.visibility = "hidden";
	}
	else {
		$next.style.visibility = "visible";
	}
}

function checkPage(data) {
	if (data.Scene1.Pages[currentPage].hasOwnProperty('Options')) {
		$name_box.style.visibility = "hidden";
		$image_box.style.visibility = "hidden";
	return false;
	}
	if (data.Scene1.Pages[currentPage].hasOwnProperty('NextPage')) {
		if(data.Scene1.Pages[currentPage].NextPage == "End")
		return false;
	}
	return true;
}

$next.addEventListener('mouseup', (e) => {
	if(!json) return;
	if(e.button == 0 && checkPage(json)) {
		
		if (json.Scene1.Pages[currentPage].hasOwnProperty('NextPage')) {
			currentPage = json.Scene1.Pages[currentPage].NextPage;
		}
		else {
			pageNum++;
			currentPage = Object.keys(json.Scene1.Pages)[pageNum];
		}
		
		initialize(json);
		handleOptions(json);
	}
	else return;
	
})

grabData();
