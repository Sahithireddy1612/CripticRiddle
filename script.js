const encryptedTextElement = document.getElementById('encrypted-text');
const decryptionKeyElement = document.getElementById('decryption-key');
const decryptedTextElement = document.getElementById('decrypted-text');
const fetchEncryptedButton = document.getElementById('fetch-encrypted');
const submitDecryptedButton = document.getElementById('submit-decrypted');

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');

let encryptedText = '';
let decryptionKey = '';


function caesarCipherDecrypt(text, shift) {
    let decryptedText = '';
    for (let char of text) {
        if (char.match(/[a-z]/i)) {
            const base = char.charCodeAt(0) <= 90 ? 65 : 97;
            decryptedText += String.fromCharCode(((char.charCodeAt(0) - base - shift + 26) % 26) + base);
        } else {
            decryptedText += char;
        }
    }
    return decryptedText;
}


fetchEncryptedButton.addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:3000/encryptedData');  
        const data = await response.json();

        
        encryptedText = data.encrypted_text;
        decryptionKey = data.key;

        
        encryptedTextElement.textContent = encryptedText;
        decryptionKeyElement.textContent = decryptionKey;

        
        const decryptedMessage = caesarCipherDecrypt(encryptedText, parseInt(decryptionKey));
        decryptedTextElement.textContent = decryptedMessage;

    } catch (error) {
        console.error('Error fetching encrypted data:', error);
    }
});


submitDecryptedButton.addEventListener('click', async () => {
    const decryptedMessage = decryptedTextElement.textContent;
    const userName = nameInput.value;
    const userEmail = emailInput.value;
    const userPhone = phoneInput.value;

    const payload = {
        "decrypted_text": decryptedMessage,  
        "email": userEmail,
        "phone_number": userPhone,
        "name": userName,
        "user_submitted_code": "cryptic-riddle-solution-001"

    };

    try {
        const response = await fetch('http://localhost:3000/decryptedData', {  
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        alert(result.message || 'Decrypted text submitted successfully!');  

    } catch (error) {
        console.error('Error submitting decrypted text:', error);
    }
});
