(function () {
// Get the attributes from the script tag
var scriptTag = document.querySelector('script[data-width][data-gid]');
var width = scriptTag.getAttribute('data-width');
var classes = scriptTag.getAttribute('data-class');
var styles = scriptTag.getAttribute('data-style');
var gid = scriptTag.getAttribute('data-gid');

// Create the iframe
var iframe = document.createElement('iframe');
iframe.src = 'https://key-hub.eu/giveaway/' + gid;

// Set the width of the iframe
iframe.width = width;

// Set the height of the iframe
iframe.height = '0';

// Append the iframe to the current element
scriptTag.insertAdjacentElement('afterend', iframe);

// Function to handle the height request
function handleMessage(event) {
  if (!isNaN(event.data)) {
	// Apply classes and styles
	iframe.style.cssText += styles;
	iframe.classList.add(...(classes || "khembed").split(' '));
	iframe.height = event.data;
  }
}

// Add event listener for receiving height requests
window.addEventListener('message', handleMessage, false);
})();
