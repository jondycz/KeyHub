// Get the attributes from the script tag
var scriptTag = document.querySelector('script[data-width][data-gid]');
var width = scriptTag.getAttribute('data-width');
var gid = scriptTag.getAttribute('data-gid');

// Create the iframe
var iframe = document.createElement('iframe');
iframe.src = 'https://key-hub.eu/giveaway/' + gid;

// Set the width of the iframe
iframe.style.width = width + 'px';

// Append the iframe to the current element
document.currentScript.parentNode.appendChild(iframe);

// Function to handle the height request
function handleMessage(event) {
  if (!isNaN(event.data)) {
	iframe.height = event.data + 5;
  }
}

// Add event listener for receiving height requests
window.addEventListener('message', handleMessage, false);
