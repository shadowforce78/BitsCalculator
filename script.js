document.addEventListener('DOMContentLoaded', function () {
    // Code de démarrage pour le calculateur de bits
    console.log("Calculateur de Bits initialisé");
    
    const display = document.getElementById('display');
    const decimalDisplay = document.getElementById('decimalDisplay'); // nouveau
    const bitWidthSelect = document.getElementById('bitWidth');
    const negativeModeCheckbox = document.getElementById('negativeMode');
    const buttons = document.querySelectorAll('button');

    buttons.forEach(function(button) {
        button.addEventListener('click', calculate);
    });

    function calculateExpression(expr) {
        // Remplace les nombres binaires par du format 0bX
        const replaced = expr.replace(/\b[01]+\b/g, match => '0b' + match);
        try {
            let result = eval(replaced);
            const bitWidth = parseInt(bitWidthSelect.value);
            // Appliquer réduction modulo pour l'addition
            if (expr.includes('+')) {
                result = result % Math.pow(2, bitWidth);
            }
            // Appliquer le mode négatif si activé et en 8 bits
            if (bitWidth === 8 && negativeModeCheckbox.checked) {
                result = result % 256; // réduction modulo 256
                if(result >= 128) {
                    result = result - 256;
                }
            }
            return result.toString(2);
        } catch(err) {
            return "Err";
        }
    }

    function updateDecimal() {
        // Extrait l'opérande en cours (la séquence de 0 et 1 à la fin)
        let operandMatch = display.value.match(/[01]+$/);
        let currentOperand = operandMatch ? operandMatch[0] : "";
        const bitLimit = parseInt(bitWidthSelect.value);
        // Si l'opérande dépasse la largeur choisie, afficher l'erreur uniquement en décimal
        if(currentOperand.length > bitLimit) {
            decimalDisplay.value = "Err";
            return;
        }
        let dec = parseInt(currentOperand, 2);
        // Appliquer le mode négatif si activé et en 8 bits
        if(bitLimit === 8 && negativeModeCheckbox.checked) {
            if(dec >= Math.pow(2, bitLimit - 1)) {
                dec = dec - Math.pow(2, bitLimit);
            }
        }
        decimalDisplay.value = isNaN(dec) ? "Err" : dec;
    }

    function calculate(e) {
        let value = e.target.getAttribute('data-value');
        if (value === 'C') {
            display.value = "0";
        } else if (value === 'DEL') {
            // Supprimer le dernier caractère
            if(display.value.length > 1) {
                display.value = display.value.slice(0, -1);
            } else {
                display.value = "0";
            }
        } else if (value === '=') {
            display.value = calculateExpression(display.value);
        } else {
            // Pour "0" ou "1" on laisse l'utilisateur ajouter le chiffre même en cas d'overflow,
            // afin qu'il puisse corriger la valeur avec DEL
            if (display.value === "0") {
                display.value = value;
            } else {
                display.value += value;
            }
        }
        updateDecimal();
    }
});