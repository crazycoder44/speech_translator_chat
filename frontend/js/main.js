// Establish WebSocket connection
const socket = new WebSocket("ws://127.0.0.1:8000/ws/speech/");

// Fetch the list of supported languages when the page loads
window.onload = function() {
    fetchSupportedLanguages();
};

// Function to fetch supported languages
function fetchSupportedLanguages() {
    fetch('https://translate.flossboxin.org.in/languages')
        .then(response => response.json())
        .then(data => {
            populateLanguageDropdowns(data);
        })
        .catch(error => {
            console.error('Error fetching supported languages:', error);
        });
}

// Function to populate language dropdowns
function populateLanguageDropdowns(languages) {
    const speechLanguageSelect = document.getElementById('speechLanguage');
    const translateToSelect = document.getElementById('translateTo');

    speechLanguageSelect.innerHTML = '';
    translateToSelect.innerHTML = '';

    languages.forEach(language => {
        const option = document.createElement('option');
        option.value = language.code;
        option.textContent = language.name;
        speechLanguageSelect.appendChild(option);
    });

    speechLanguageSelect.addEventListener('change', () => {
        updateTranslateToDropdown(speechLanguageSelect.value, languages);
    });

    updateTranslateToDropdown(speechLanguageSelect.value, languages);
}

function updateTranslateToDropdown(selectedLanguageCode, languages) {
    const translateToSelect = document.getElementById('translateTo');
    translateToSelect.innerHTML = '';
    
    const selectedLanguage = languages.find(lang => lang.code === selectedLanguageCode);
    if (selectedLanguage) {
        selectedLanguage.targets.forEach(targetCode => {
            const option = document.createElement('option');
            option.value = targetCode;
            option.textContent = getLanguageNameByCode(targetCode, languages);
            translateToSelect.appendChild(option);
        });
    }
}

function getLanguageNameByCode(code, languages) {
    const language = languages.find(lang => lang.code === code);
    return language ? language.name : code;
}

// Speech recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
    alert("Speech Recognition API not supported in this browser.");
}
const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.maxAlternatives = 1;

// Get elements
const submitButton = document.getElementById('submitButton');
const recognizedTextElement = document.getElementById('recognizedText');
const translatedTextElement = document.getElementById('translatedText');
const speakButton = document.getElementById('speakButton');
const microphoneContainer = document.getElementById('microphoneContainer');

let speechLanguage = '';
let translateToLanguage = '';

// Handle speech recognition trigger
submitButton.addEventListener('click', () => {
    speechLanguage = document.getElementById('speechLanguage').value;
    translateToLanguage = document.getElementById('translateTo').value;
    recognition.lang = speechLanguage;
    microphoneContainer.style.display = 'block';
    recognition.start();
});

recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    recognizedTextElement.textContent = transcript;

    // Send only the transcript to WebSocket so others can see it
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
            type: "transcript_message",
            text: transcript
        }));
    } else {
        console.error("WebSocket is not open.");
    }

    // Now translate the text using the external API
    translateText(transcript, speechLanguage, translateToLanguage);
};

recognition.onerror = function(event) {
    console.error("Speech recognition error:", event.error);
};

// Function to send text to an external API for translation
function translateText(text, fromLang, toLang) {
    const apiUrl = 'https://translate.flossboxin.org.in/translate';

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            q: text,
            source: fromLang,
            target: toLang,
            format: 'text'
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Translation API response:', data);
        const translatedText = data.translatedText; // Assuming the API returns this field
        translatedTextElement.textContent = translatedText;

        // Display the speak button and add functionality
        speakButton.style.display = 'block';
        speakButton.onclick = () => speakText(translatedText);

        // Send the translated text to WebSocket so others can see it
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: "translation",
                text: translatedText
            }));
        }
    })
    .catch(error => {
        console.error('Error translating text:', error);
    });
}

// WebSocket message handling
socket.onmessage = function(event) {
    const data = JSON.parse(event.data);

    if (data.type === "transcript_message") {
        recognizedTextElement.textContent = data.text;
    }

    if (data.type === "translation") {
        translatedTextElement.textContent = data.text;
        speakButton.style.display = 'block';
        speakButton.onclick = () => speakText(data.text);
    }
};

socket.onclose = function(event) {
    console.warn("WebSocket closed. Attempting to reconnect...");
    setTimeout(() => {
        window.location.reload();
    }, 3000);
};

// Function to speak translated text
function speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = translateToLanguage;
    window.speechSynthesis.speak(utterance);
}
