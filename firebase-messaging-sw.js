// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.18.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.18.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyBzcRk2TOoZ3rag4pWoC3NAGoSfGlr_m3s",
    authDomain: "key-hub.firebaseapp.com",
    projectId: "key-hub",
    storageBucket: "key-hub.appspot.com",
    messagingSenderId: "230922921013",
    appId: "1:230922921013:web:2a80db37e5129af96dbd7c"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
	click_action: payload.data.click_action
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});