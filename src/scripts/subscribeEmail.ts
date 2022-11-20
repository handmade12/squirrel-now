import { onInit, addScript } from './_helpers';

// Add Google Recaptcha v3
const RECAPTCHA_PUBLIC_KEY = '6LffxHgiAAAAAIIEnl8fqftW3MjtcpsWmn87rwse';
addScript(`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_PUBLIC_KEY}`);

// Subscribe form
const subscribeEmailEls = {
  button: undefined,
  input: undefined,
  validation: undefined,
};
onInit(() => {
  subscribeEmailEls.button = document.querySelector('#subscribe-email-button');
  subscribeEmailEls.input = document.querySelector('#subscribe-email-input');
  subscribeEmailEls.validation = document.querySelector('#subscribe-email-validation');
  subscribeEmailEls.button.addEventListener('click', subscribeEmail);
  subscribeEmailEls.input.addEventListener('keyup', e => e.keyCode === 13 && subscribeEmail());
});

function subscribeEmail(): void {
  grecaptcha.ready(async () => {
    const recaptchaToken = await grecaptcha.execute(RECAPTCHA_PUBLIC_KEY, { action: 'subscribeEmail' });
    const email = document.querySelector('#subscribe-email-input').value.trim();
    const isValid = isEmailValid(email);
    displayErrorMessage(isValid ? undefined : 'Please enter a valid email');
    if (!isValid) {
      return;
    }
    updateButtonLoadingState('loading');
    try {
      const response = await fetch('/api/subscribe-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, recaptchaToken }),
      });
      const json = await response.json();
      if (response.status === 200) {
        updateButtonLoadingState('success');
      } else {
        updateButtonLoadingState('error');
        displayErrorMessage(json.message);
        console.error(json);
      }
    } catch (error) {
      console.error(error);
      displayErrorMessage(error.message);
    }
  });
}

function isEmailValid(email): boolean {
  const regex =
    /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  return regex.test(email);
}

function displayErrorMessage(message = ''): void {
  if (!message) {
    subscribeEmailEls.validation.style.display = 'none';
    return;
  }
  subscribeEmailEls.validation.innerText = message;
  subscribeEmailEls.validation.style.display = 'block';
}

function updateButtonLoadingState(state): void {
  switch (state) {
    case 'loading': {
      subscribeEmailEls.button.classList.add('loading--running');
      break;
    }
    case 'success': {
      subscribeEmailEls.button.classList.remove('loading--running');
      subscribeEmailEls.button.classList.add('loading--success');
      break;
    }
    case 'error': {
      subscribeEmailEls.button.classList.remove('loading--running');
      subscribeEmailEls.button.classList.add('loading--error');
      break;
    }
    default: {
      console.error(`Function "updateButtonLoadingState(state)" was invoked with incorrect argument "${state}".`);
    }
  }
}
