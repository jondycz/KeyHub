(() => {
  // Get the attributes from the script tag
  let scriptTag = document.currentScript;
  let gid = scriptTag.attributes['data-gid']?.value;
  let width = scriptTag.attributes['data-width']?.value || 500;
  let classes = scriptTag.attributes['data-class']?.value || "khembed";
  let styles = scriptTag.attributes['data-style']?.value || "";
  let attributes = scriptTag.attributes['data-attributes']?.value || "";

  // Create the iframe
  let iframe = document.createElement('iframe');
  iframe.src = 'https://key-hub.eu/giveaway/' + gid;

  // Set the width of the iframe
  iframe.width = width;

  // Set the height of the iframe
  iframe.height = '0';

  // Set max width to 100% of available container
  iframe.style.maxWidth = "100%";

  // Append the iframe to the current element
  scriptTag.insertAdjacentElement('afterend', iframe);

  // Function to handle the height request
  function handleMessage(event) {
    if (!isNaN(event.data)) {
      if (iframe.classList.length === 0) {
        //set styles of the iframe
        iframe.style.cssText += styles;

        //append classes of the iframe
        iframe.classList.add(...classes.split(' '));

        //append attributes to the iframe
        attributes.split(',').forEach((pair) => {
          const [attribute, value] = pair.split(':');
          if (attribute.trim().length === 0) return;
          iframe.setAttribute(attribute, value || "");
        });
      }
      if(iframe.height !== event.data){
        iframe.height = event.data;
      }
    }
  }

  // Add event listener for receiving height requests
  window.addEventListener('message', handleMessage, false);
})();
