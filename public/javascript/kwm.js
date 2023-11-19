document.addEventListener('DOMContentLoaded', () => {
    const toggleButtonKwm = document.getElementById('toggleButtonKwm');
    toggleButtonKwm.textContent = '5';

    const calculate = () => {
        const factor = toggleButtonKwm.textContent === '5' ? [2.65, 0.38] : [1.77, 0.56];
        document.getElementById('ftOutput').value = (document.getElementById('lbInput').value * factor[0]).toFixed(2) || '';
        document.getElementById('lbOutput').value = (document.getElementById('ftInput').value * factor[1]).toFixed(2) || '';
    };

    toggleButtonKwm.addEventListener('click', () => {
        toggleButtonKwm.textContent = toggleButtonKwm.textContent === '5' ? '6' : '5';
        calculate();
    });

    ['lbInput', 'ftInput'].forEach(id => document.getElementById(id).addEventListener('input', calculate));
});