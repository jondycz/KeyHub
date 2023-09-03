(function() {
  // Get the attributes from the script tag
  var scriptTag = document.querySelector('script[data-gid]');
  var width = scriptTag.getAttribute('data-width') || 500;
  var classes = scriptTag.getAttribute('data-class');
  var styles = scriptTag.getAttribute('data-style');
  var attributes = scriptTag.getAttribute('data-attributes');
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
      if (iframe.classList.length === 0) {
        //set styles of the iframe
        iframe.style.cssText += styles;

        //append classes of the iframe
        iframe.classList.add(...(classes || "khembed").split(' '));

        //append attributes to the iframe
        attributes.split(',').forEach((pair) => {
          const [attribute, value] = pair.split(':');
          if (attribute.trim().length === 0) return;
          iframe.setAttribute(attribute, value || "");
        });
      }
      iframe.height = event.data;
    }
  }

  // Add event listener for receiving height requests
  window.addEventListener('message', handleMessage, false);
})();
