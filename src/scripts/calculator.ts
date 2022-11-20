import GuiDialog from './_dialog';
import { onInit } from './_helpers';

interface Values {
  lpa: number;
  papr: number;
  fee: number;
  psNumber: number;
  psRange: number;
  lvtNumber: number;
  lvtRange: number;
  lvtType: number;
}

const formatCurrency = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

onInit(() => {
  const calculatorEl = document.querySelector('#calculatorDialog');
  const form = calculatorEl.querySelector('form');
  const inputEls = {
    lpa: form.querySelector<HTMLInputElement>('input[name="lpa"]'),
    papr: form.querySelector<HTMLInputElement>('input[name="papr"]'),
    fee: form.querySelector<HTMLInputElement>('input[name="fee"]'),
    psNumber: form.querySelector<HTMLInputElement>('input[type="number"][name="ps"]'),
    psRange: form.querySelector<HTMLInputElement>('input[type="range"][name="ps"]'),
    lvtNumber: form.querySelector<HTMLInputElement>('input[type="number"][name="lvt"]'),
    lvtRange: form.querySelector<HTMLInputElement>('input[type="range"][name="lvt"]'),
    lvtType: form.querySelector<HTMLSelectElement>('select[name="lvtType"]'),
  };
  const resultEl = calculatorEl.querySelector('#calculatorResult');

  inputEls.psRange.addEventListener('input', () => {
    if (inputEls.psNumber.value !== inputEls.psRange.value) {
      inputEls.psNumber.value = inputEls.psRange.value;
    }
  });
  inputEls.psNumber.addEventListener('input', () => {
    if (inputEls.psRange.value !== inputEls.psNumber.value) {
      inputEls.psRange.value = inputEls.psNumber.value;
    }
  });
  inputEls.lvtRange.addEventListener('input', () => {
    if (inputEls.lvtNumber.value !== inputEls.lvtRange.value) {
      inputEls.lvtNumber.value = inputEls.lvtRange.value;
    }
  });
  inputEls.lvtNumber.addEventListener('input', () => {
    if (inputEls.lvtRange.value !== inputEls.lvtNumber.value) {
      inputEls.lvtRange.value = inputEls.lvtNumber.value;
    }
  });

  form.addEventListener('input', () => calculate());

  function calculate() {
    const values = Object.keys(inputEls).reduce((acc, cur) => {
      acc[cur] = +inputEls[cur].value;
      return acc;
    }, {}) as Values;
    const result =
      values.lpa *
      (values.papr / 100 / 365) *
      (values.fee / 100) *
      (values.psNumber / 100) *
      (values.lvtNumber * values.lvtType);
    resultEl.innerHTML = formatCurrency.format(result);
  }

  calculate();
});

document.querySelectorAll('dialog[modal-mode="mega"]').forEach(dialog => {
  GuiDialog(dialog);
});

document.querySelectorAll('dialog[modal-mode="mini"]').forEach(dialog => {
  GuiDialog(dialog);
});
