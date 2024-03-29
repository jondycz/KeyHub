//START: Front page code
function fragmentURL(url){
	return new URL(url).pathname.split('/').filter(segment => segment !== '');
}
function getPageName(url){
	return fragmentURL(url)[0];
}
function getGiveawayId(url){
	return fragmentURL(url)[1];
}
async function paintContributors() {
	let wrapper = document.querySelectorAll(".githubcontributors");
	if (!wrapper.length) return;
	fetch('https://api.github.com/repos/jondycz/keyhub/contributors?page=1&per_page=250')
	.then(response => response.json())
	.then(data => {
		data.forEach(val => {
			wrapper.forEach(element => {
				element.insertAdjacentHTML('beforeend', '<a href="' + val.html_url + '" target="_blank" title="' + val.login + '"><img src="' + val.avatar_url + '&s=64" alt="' + val.login + '" width="64" height="64" style="margin:5px;" loading="lazy" /></a>');
			});
		});
	});
}
async function paintSeasonalLogo() {
	let logoUrl = '/img/logos/' + (new Date()).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }).replace('/', '') + ".svg";
	fetch(logoUrl)
	.then((response) => {
		if (response.ok) {
			document.querySelector(".logo-img > a > img").src = logoUrl;
		}
	});
}
async function loadMainMenu(){
	document.querySelectorAll(".nav-item.dropdown > .dropdown-menu").forEach(x => {
		if(x.children.length > 0){
			x.previousElementSibling.addEventListener("click", function(e){e.target.nextElementSibling.classList.toggle('show')});
			x.previousElementSibling.removeAttribute("href");
		}
	});	
}
function loginWithSteam(){
	var loginLink = '/connect/steam?return=' + encodeURIComponent(location.pathname);
	if (window.self !== window.top) {
		window.open(loginLink + '&embed=true');
	}else{
		location.href = loginLink;
	}
}
function isLoggedIn(){
	return (document.querySelector("#logout") !== null);
}
function redeemSteamKey(key){
	window.open('https://store.steampowered.com/account/registerkey?key='+key, '_blank');
}
//END: Front page code

//START: Giveaway page code
function VerifyTasks(link, token = 0){
	document.getElementById("verify").style.display = "none";
	document.getElementById("VerifLoad").style.display = "block";
	fetch('/verify?data=' + link + '&token=' + token)
	.then(response => response.json())
	.then(data => {
			if (data['error'] != "exhausted") {
				//server resources exhausted
				document.getElementById("verify").title = "Wait 30 seconds to verify again";
				document.getElementById("verify").disabled = true;
				setTimeout(function() {
					document.getElementById("verify").disabled = false;
					document.getElementById("verify")?.removeAttribute("title");
					grecaptcha.reset();
				}, 30000);
				if (data['code'] != 1) {
					document.querySelectorAll(".task-result").forEach(taskResult => (taskResult.style.display = "flex", taskResult.classList.remove("fa-times-circle"), taskResult.classList.add("fa-check-circle")));
					document.querySelectorAll(".taskErrors").forEach(taskError => (taskError.style.display = "none"));
				}
				if (data['success'] != null) {
					if (data['success'] == true) {
						document.getElementById("keybox").setAttribute("value", data["message"]);
						document.getElementById("keygroup").style.display = "contents";
						document.getElementById("verifybox").style.display = "none";
						document.getElementById('keysleft').textContent -= 1;
					} else {
						document.getElementById("error").style.display = "flex";
						document.getElementById("errormsg").textContent = data["message"];
					}
				} else {
					//take indexes
					document.getElementById("error").style.display = "none";
					document.querySelectorAll(".taskErrors").forEach(taskError => (taskError.style.display = "none"));
					Object.keys(data).forEach(function(index) {
						const taskElement = document.getElementById("task-" + index);
						const reasonElement = document.getElementById("task-" + index + "-reason");

						if (taskElement) {
							taskElement.classList.remove("fa-check-circle");
							taskElement.classList.add("fa-times-circle");
						}

						if (reasonElement) {
							reasonElement.style.display = "block";
							reasonElement.textContent = data[index];
						}
					});
				}
				document.getElementById("VerifLoad").style.display = "none";
				document.getElementById("verify").style.display = "initial";
			} else {
				setTimeout(function() {
					VerifyTasks(link, token);
				}, 2000);
			}
		}
	)
	.catch(response => {
		alert("We have experienced an error here! Please wait for a while to try verifying again.");
		document.getElementById("verify").style.display = "initial";
		document.getElementById("VerifLoad").style.display = "none";
		grecaptcha.reset();
	});	
}

function keysleft() {
	fetch('https://api.key-hub.eu/?type=giveawaycount&data=' + parseInt(getGiveawayId(window.location.href)))
	.then(response => response.json())
	.then(data => {
		let countWrapper = document.getElementById('keysleft');
		if (Number(countWrapper.innerHTML) > data.data){
			countWrapper.innerHTML = data.data;
		}
		if (data !== 0) {
			setTimeout(keysleft, 5000);
		}
	});
}

if(getPageName(window.location.href) === "giveaway"){
	setTimeout(function(){ keysleft(); }, 5000);
	if(isLoggedIn() && typeof VPNcheck == 'function'){
		VPNcheck();
	}
}

function videoTask(videoid, data){
	if(videoid != '' && data != ''){
		window.data = data;
		document.body.insertAdjacentHTML('beforeend', '<div class="video-underlay"></div><div class="video-overlay"><div id="countdown" style="text-align: right;"></div><div class="video-container"><div id="player" name="player"></div></div></div>');
		window.videoid = videoid;
		playvideo();
	}
}

window.playcount = 0;
function playvideo(videoid){
  // 2. This code loads the IFrame Player API code asynchronously.
  var tag = document.createElement('script');

  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  var player;
  var videotime = 0;
  if(window.playcount != 0){
	  onYouTubeIframeAPIReady();
  }
}
function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		videoId: videoid,
		playerVars: {
			controls: 0,
			disablekb: 1,
			loop: 1,
			fs: 0
			
		},
		events: {
			'onReady': onPlayerReady
		}
	});
  window.playcount++;
}

function onPlayerReady(event) {
	(function(){
		//temporarily disabling autoplay
		//event.target.playVideo();
		//document.getElementsByClassName('video-stream html5-main-video')[0].loop = true;
		var checkvid = setInterval(function(){
			videoCheck();
		}, 200)
		var countdown = setInterval(function(){
			if(player.getDuration() > 120){var duration = 120;}else{var duration = player.getDuration();}
			var duration = (duration - player.getCurrentTime()).toFixed(0);
			if(duration > 59){
				duration = Math.floor((duration/60)).toFixed(0)+":"+('0' + duration%60).slice(-2);
			}
			document.getElementById("countdown").innerHTML = duration;
		}, 1000)					
		var last = 0;
		function videoCheck(){
			if(player.playerInfo.playerState != -1){
				if(player.getCurrentTime()-1.2 < last){
					if(player.getDuration() > 120){var duration = 120;}else{var duration = player.getDuration();}
					if((duration-1) < player.getCurrentTime()){
						clearInterval(checkvid);
						clearInterval(countdown);
						if(player){
							player.stopVideo();
							player.destroy();
							player = null;				
						}
						document.querySelectorAll(".video-overlay, .video-underlay").forEach(el => el.remove());
						fetch('/away?data=' + window.data);
					}else{
						last = player.getCurrentTime();
					}
				}else{
					player.seekTo(last);
				}
			}else{
				/*clearInterval(checkvid);
				clearInterval(countdown);
				if(player){
					player.stopVideo();
					player.destroy();
					player = null;				
				}
				document.querySelectorAll(".video-overlay, .video-underlay").forEach(el => el.remove());
				console.log("Error loading video");*/
			}
		}
	}());
}
//END: Giveaway page code

//START: Drops page code
function paintDropsAlert(data){
	document.getElementById("skeymsg").innerText = data["success"] ?? data["error"];
	document.getElementById("skeymsg").style.backgroundColor = (data["success"]) ? "green" : "red";
	document.getElementById("skeymsg").style.display = "block";	
}
function sendFormData(url, dataObject) {
    return fetch(url, {
        method: 'POST',
        body: Object.entries(dataObject).reduce((formData, [key, value]) => (formData.append(key, value), formData), new FormData())
    })
    .then(response => response.json());
}
function Donate(token){
	var key = document.getElementById('Donkey').value;
	sendFormData('/drops', {donate: '1',key})
  	.then(data => {
    		paintDropsAlert(data);
  	});
	window.scrollTo(0, 0);						 
}
function ClaimKeyDrop(event){
	if(event.isTrusted){
		document.getElementById("skeyc").disabled = true;
		sendFormData('/drops', {claim: '1'})
		.then(data => {
			paintDropsAlert(data);
			if(data["error"] != null){
				if (typeof window.keyClaimed === 'undefined') {
					if(data["error"] != "Sorry Drop isnt yet active, click fast!"){
						setTimeout(function(){ location.reload(); }, 3000);
					}
				}
			}
			if(data["skey"] != null){
				document.getElementById("skey").innerText = data["skey"];
				document.getElementById("feedbackalert").style.display = "block";
				document.getElementById("skeyc").style.display = "none";
				window.keyClaimed = true;
				clearInterval(ts);
			}
			document.getElementById("skeyc").disabled = false;
		});
	}else{
		document.getElementById("skeymsg").innerText = "Something went wrong. Maybe update to a newer browser?";
		document.getElementById("skeymsg").style.backgroundColor = "red";
		document.getElementById("skeymsg").style.display = "block";								
	}
}
function remainingTime(timestamp2){
	return (timestamp2 - Math.floor(Date.now() / 1000));
}
function timestamptotime(timestamp, ts){
	var hour, minute, second;
	hour = minute = second = 0;
	if(timestamp >= 0){
		hour = Math.floor(timestamp/3600);
		minute = Math.floor((timestamp % 3600)/60);
		second = Math.floor((timestamp % 3600)%60);
		document.getElementById("countdown").innerText = hour + " : " + ('0' + minute).slice(-2) + " : " + ('0' + second).slice(-2);	
	}else{
		if(typeof ts !== 'undefined'){
			clearInterval(ts);
		}
	}
	if(timestamp <= 5){
		if(document.getElementById("skey").innerText != "Sorry, no keys left, check back later"){
			document.getElementById("skeyc").style.display = "inline-block";
		}
	}
	document.getElementById("countdown").innerText = hour + " : " + ('0' + minute).slice(-2) + " : " + ('0' + second).slice(-2);
}
function updateDropsClock(timestamp){
	timestamp = Math.round(timestamp - (document.timeline.currentTime / 1000));
	var timestamp2 = Math.floor(Date.now() / 1000) + timestamp;
	timestamptotime(timestamp);
	var ts = setInterval(function(){
		if(timestamp != remainingTime(timestamp2)){
			timestamp = remainingTime(timestamp2);
			timestamptotime(timestamp, ts);								
		}
	}, 100)
}
function KeyFeedback(option){
	sendFormData('/drops', {postStatus: option})
  	.then(data => {
    		paintDropsAlert(data);
  	});
	setTimeout(function(){ window.location.href = "/drops"; }, 1500);
}
//END: Drops page code

//Code executed on full page load
document.addEventListener("DOMContentLoaded", function(){
	loadMainMenu();
	paintContributors();
	paintSeasonalLogo();
});
