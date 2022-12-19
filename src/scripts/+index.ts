import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { onInit } from './_helpers';

const firebaseConfig = {
  apiKey: 'AIzaSyAAvFrmpa8SaUNLNiO2gJ0On-fFTxDxzlw',
  authDomain: 'squirrel-now.firebaseapp.com',
  projectId: 'squirrel-now',
  storageBucket: 'squirrel-now.appspot.com',
  messagingSenderId: '430865428430',
  appId: '1:430865428430:web:ed973e45143eecb389459f',
  measurementId: 'G-T4RYD1F7BM',
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

/**
 * When user clicks on the link with attribute [data-e2e]="link-to-survey-form" - track this event into Firebase Analytics
 */
function trackFormOpen() {
  const link = document.querySelector('[data-e2e="link-to-survey-form"]');
  link.addEventListener('click', () => {
    console.log('track analytics event');
    logEvent(analytics, 'survey_form_open');
  });
}

onInit(trackFormOpen);
