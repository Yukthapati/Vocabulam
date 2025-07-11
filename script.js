// DOM Elements
const searchForm = document.getElementById('search-form');
const wordInput = document.getElementById('word-input');
const searchBtn = document.getElementById('search-btn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const errorMessage = document.getElementById('error-message');
const resultsContainer = document.getElementById('results-container');
const wordTitle = document.getElementById('word-title');
const pronunciationBtn = document.getElementById('pronunciation-btn');
const phoneticText = document.getElementById('phonetic-text');
const meaningsContainer = document.getElementById('meanings-container');
const retryBtn = document.getElementById('retry-btn');
const favoriteBtn = document.getElementById('favorite-btn');
const shareBtn = document.getElementById('share-btn');

// Grammar Assistant Elements
const grammarInput = document.getElementById('grammar-input');
const checkGrammarBtn = document.getElementById('check-grammar-btn');
const clearTextBtn = document.getElementById('clear-text-btn');
const sampleTextBtn = document.getElementById('sample-text-btn');
const grammarResults = document.getElementById('grammar-results');
const suggestionsContainer = document.getElementById('suggestions-container');
const wordCount = document.getElementById('word-count');
const charCount = document.getElementById('char-count');
const readabilityScore = document.getElementById('readability-score');
const overallScore = document.getElementById('overall-score');

// Content Generator Elements
const contentType = document.getElementById('content-type');
const contentTone = document.getElementById('content-tone');
const contentLength = document.getElementById('content-length');
const topicInput = document.getElementById('topic-input');
const generateBtn = document.getElementById('generate-btn');
const generatedContent = document.getElementById('generated-content');
const contentOutput = document.getElementById('content-output');
const copyContentBtn = document.getElementById('copy-content-btn');
const regenerateBtn = document.getElementById('regenerate-btn');

// Chatbot Elements
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotInput = document.getElementById('chatbot-input');
const sendMessageBtn = document.getElementById('send-message');
const chatNotification = document.getElementById('chat-notification');

// Tab Elements
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Category buttons
const categoryBtns = document.querySelectorAll('.category-btn');

// Insight tabs
const insightTabs = document.querySelectorAll('.insight-tab');
const insightPanels = document.querySelectorAll('.insight-panel');

// Result tabs
const resultTabs = document.querySelectorAll('.result-tab');

// Modal elements
const wordOfDayModal = document.getElementById('word-of-day-modal');
const modalClose = document.querySelector('.modal-close');

// Global Variables
let currentWord = '';
let lastSearchedWord = '';
let messageId = 1;
let favorites = JSON.parse(localStorage.getItem('vocabulam-favorites') || '[]');
let searchHistory = JSON.parse(localStorage.getItem('vocabulam-history') || '[]');

// Dictionary API Configuration
const DICTIONARY_API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

// Sample texts for grammar checking
const sampleTexts = [
    "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet and is commonly used for testing purposes. It's a pangram that has been used since the early 1900s.",
    "Their going to the store to buy there groceries. They're planning to get everything they need for the week. Its important to make a list so you dont forget anything.",
    "I could care less about what people think. For all intensive purposes, I'm going to do what I want. I should of listened to my mother's advise.",
    "The weather is beautiful today. The sun is shining brightly, and there's a gentle breeze blowing through the trees. It's the perfect day for a picnic in the park."
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeTabs();
    updateFavoriteButton();
});

function initializeEventListeners() {
    // Word search events
    searchForm.addEventListener('submit', handleWordSearch);
    wordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleWordSearch(e);
        }
    });
    pronunciationBtn.addEventListener('click', playPronunciation);
    retryBtn.addEventListener('click', () => {
        if (currentWord) {
            searchWord(currentWord);
        }
    });
    favoriteBtn.addEventListener('click', toggleFavorite);
    shareBtn.addEventListener('click', shareWord);
    
    // Category button events
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const word = btn.dataset.word;
            wordInput.value = word;
            searchWord(word);
        });
    });
    
    // Grammar assistant events
    checkGrammarBtn.addEventListener('click', checkGrammar);
    clearTextBtn.addEventListener('click', clearGrammarText);
    sampleTextBtn.addEventListener('click', loadSampleText);
    grammarInput.addEventListener('input', updateTextStats);
    
    // Content generator events
    generateBtn.addEventListener('click', generateContent);
    copyContentBtn.addEventListener('click', copyContent);
    regenerateBtn.addEventListener('click', regenerateContent);
    
    // Chatbot events
    chatbotToggle.addEventListener('click', toggleChatbot);
    chatbotClose.addEventListener('click', closeChatbot);
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    sendMessageBtn.addEventListener('click', sendMessage);
    
    // Tab events
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    
    // Insight tab events
    insightTabs.forEach(tab => {
        tab.addEventListener('click', () => switchInsightTab(tab.dataset.insight));
    });
    
    // Result tab events
    resultTabs.forEach(tab => {
        tab.addEventListener('click', () => switchResultTab(tab.dataset.result));
    });
    
    // Modal events
    modalClose.addEventListener('click', () => {
        wordOfDayModal.classList.add('hidden');
    });
    
    // Search suggestions
    wordInput.addEventListener('input', handleSearchSuggestions);
    
    // Auto-fill topic from last searched word
    wordInput.addEventListener('change', () => {
        if (wordInput.value.trim()) {
            topicInput.placeholder = `Generate content about "${wordInput.value.trim()}"...`;
        }
    });
}

function initializeTabs() {
    // Show first tab by default
    switchTab('word-search');
}

function switchTab(tabName) {
    // Update tab buttons
    tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    // Update tab content
    tabContents.forEach(content => {
        content.classList.toggle('active', content.id === tabName);
    });
}

function switchInsightTab(insightName) {
    insightTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.insight === insightName);
    });
    
    insightPanels.forEach(panel => {
        panel.classList.toggle('active', panel.id === `${insightName}-content`);
    });
}

function switchResultTab(resultName) {
    resultTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.result === resultName);
    });
    
    // Update suggestions container based on selected tab
    updateResultsDisplay(resultName);
}

// Word Search Functions
async function handleWordSearch(e) {
    e.preventDefault();
    const word = wordInput.value.trim().toLowerCase();
    
    if (!word) {
        showNotification('Please enter a word to search');
        return;
    }
    
    await searchWord(word);
}

async function searchWord(word) {
    console.log('Searching for word:', word); // Debug log
    showLoading();
    hideError();
    hideResults();
    
    currentWord = word;
    lastSearchedWord = word;
    
    // Update topic input placeholder
    if (topicInput) {
        topicInput.placeholder = `Generate content about "${word}"...`;
    }
    
    try {
        const response = await fetch(`${DICTIONARY_API_URL}${word}`);
        console.log('API Response status:', response.status); // Debug log
        
        if (!response.ok) {
            throw new Error('Word not found');
        }
        
        const data = await response.json();
        console.log('API Response data:', data); // Debug log
        const wordData = data[0];
        
        displayWordResult(wordData);
        addToSearchHistory(word);
        
    } catch (err) {
        console.error('Search error:', err); // Debug log
        showError(`Sorry, we couldn't find the word "${word}". Please check the spelling and try again.`);
    } finally {
        hideLoading();
    }
}

function displayWordResult(wordData) {
    console.log('Displaying word result:', wordData); // Debug log
    wordTitle.textContent = wordData.word;
    
    // Handle pronunciation
    const phonetic = wordData.phonetic || 
                    (wordData.phonetics && wordData.phonetics[0] && wordData.phonetics[0].text) || 
                    '';
    
    if (phonetic) {
        phoneticText.textContent = phonetic;
        pronunciationBtn.style.display = 'flex';
    } else {
        pronunciationBtn.style.display = 'none';
    }
    
    // Update word metadata
    updateWordMetadata(wordData);
    
    // Clear previous meanings
    meaningsContainer.innerHTML = '';
    
    // Display meanings
    wordData.meanings.forEach((meaning, index) => {
        const meaningElement = createMeaningElement(meaning, index);
        meaningsContainer.appendChild(meaningElement);
    });
    
    // Update word insights
    updateWordInsights(wordData);
    
    // Update difficulty meter
    updateDifficultyMeter(wordData);
    
    showResults();
    updateFavoriteButton();
}

function createMeaningElement(meaning, index) {
    const meaningDiv = document.createElement('div');
    meaningDiv.className = 'meaning';
    meaningDiv.style.animationDelay = `${index * 0.1}s`;
    
    const partOfSpeech = document.createElement('h4');
    partOfSpeech.className = 'part-of-speech';
    partOfSpeech.textContent = meaning.partOfSpeech;
    meaningDiv.appendChild(partOfSpeech);
    
    // Display up to 3 definitions
    const definitionsToShow = meaning.definitions.slice(0, 3);
    
    definitionsToShow.forEach((def, defIndex) => {
        const definitionDiv = document.createElement('div');
        definitionDiv.className = 'definition';
        definitionDiv.innerHTML = `<strong>${defIndex + 1}.</strong> ${def.definition}`;
        meaningDiv.appendChild(definitionDiv);
        
        // Add example if available
        if (def.example) {
            const exampleDiv = document.createElement('div');
            exampleDiv.className = 'example';
            exampleDiv.innerHTML = `<strong>Example:</strong> "${def.example}"`;
            meaningDiv.appendChild(exampleDiv);
        }
        
        // Add synonyms if available
        if (def.synonyms && def.synonyms.length > 0) {
            const synonymsContainer = document.createElement('div');
            synonymsContainer.innerHTML = '<strong>Synonyms:</strong>';
            
            const synonymsDiv = document.createElement('div');
            synonymsDiv.className = 'synonyms';
            
            const synonymsToShow = def.synonyms.slice(0, 5);
            synonymsToShow.forEach(synonym => {
                const synonymSpan = document.createElement('span');
                synonymSpan.className = 'synonym';
                synonymSpan.textContent = synonym;
                synonymSpan.addEventListener('click', () => {
                    wordInput.value = synonym;
                    searchWord(synonym);
                });
                synonymsDiv.appendChild(synonymSpan);
            });
            
            meaningDiv.appendChild(synonymsContainer);
            meaningDiv.appendChild(synonymsDiv);
        }
        
        // Add antonyms if available
        if (def.antonyms && def.antonyms.length > 0) {
            const antonymsContainer = document.createElement('div');
            antonymsContainer.innerHTML = '<strong>Antonyms:</strong>';
            
            const antonymsDiv = document.createElement('div');
            antonymsDiv.className = 'synonyms';
            
            const antonymsToShow = def.antonyms.slice(0, 3);
            antonymsToShow.forEach(antonym => {
                const antonymSpan = document.createElement('span');
                antonymSpan.className = 'synonym';
                antonymSpan.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
                antonymSpan.textContent = antonym;
                antonymSpan.addEventListener('click', () => {
                    wordInput.value = antonym;
                    searchWord(antonym);
                });
                antonymsDiv.appendChild(antonymSpan);
            });
            
            meaningDiv.appendChild(antonymsContainer);
            meaningDiv.appendChild(antonymsDiv);
        }
    });
    
    return meaningDiv;
}

function updateWordMetadata(wordData) {
    const originElement = document.getElementById('word-origin');
    const frequencyElement = document.getElementById('word-frequency');
    
    // Simulate word origin (in a real app, this would come from etymology API)
    const origins = ['Latin', 'Greek', 'French', 'Germanic', 'Old English', 'Sanskrit'];
    const randomOrigin = origins[Math.floor(Math.random() * origins.length)];
    originElement.textContent = `Origin: ${randomOrigin}`;
    
    // Simulate frequency (in a real app, this would come from frequency data)
    const frequencies = ['Common', 'Uncommon', 'Rare', 'Very Common'];
    const randomFreq = frequencies[Math.floor(Math.random() * frequencies.length)];
    frequencyElement.textContent = `Usage: ${randomFreq}`;
}

function updateWordInsights(wordData) {
    // Update etymology
    const etymologyText = document.getElementById('etymology-text');
    const etymologies = [
        `The word "${wordData.word}" has fascinating historical roots that trace back through centuries of linguistic evolution.`,
        `"${wordData.word}" entered English through a complex journey of cultural exchange and linguistic borrowing.`,
        `The etymology of "${wordData.word}" reveals interesting connections to ancient languages and civilizations.`,
        `"${wordData.word}" has evolved significantly from its original meaning, reflecting changes in society and culture.`
    ];
    etymologyText.textContent = etymologies[Math.floor(Math.random() * etymologies.length)];
    
    // Update related words
    updateRelatedWords(wordData);
}

function updateRelatedWords(wordData) {
    const relatedWordsContainer = document.getElementById('related-words');
    relatedWordsContainer.innerHTML = '';
    
    // Generate related words based on the current word
    const relatedWords = generateRelatedWords(wordData.word);
    
    relatedWords.forEach(word => {
        const wordElement = document.createElement('div');
        wordElement.className = 'related-word';
        wordElement.textContent = word;
        wordElement.addEventListener('click', () => {
            wordInput.value = word;
            searchWord(word);
        });
        relatedWordsContainer.appendChild(wordElement);
    });
}

function generateRelatedWords(word) {
    // This is a simplified version. In a real app, you'd use a thesaurus API
    const wordSets = {
        'serendipity': ['fortune', 'luck', 'chance', 'destiny', 'fate', 'coincidence'],
        'eloquent': ['articulate', 'fluent', 'expressive', 'persuasive', 'graceful', 'refined'],
        'ephemeral': ['temporary', 'fleeting', 'transient', 'momentary', 'brief', 'short-lived'],
        'ubiquitous': ['omnipresent', 'pervasive', 'widespread', 'universal', 'common', 'everywhere'],
        'mellifluous': ['melodious', 'harmonious', 'sweet', 'musical', 'flowing', 'smooth']
    };
    
    return wordSets[word.toLowerCase()] || ['related', 'similar', 'connected', 'associated', 'linked', 'corresponding'];
}

function updateDifficultyMeter(wordData) {
    const difficultyFill = document.getElementById('difficulty-fill');
    const readingTime = document.getElementById('reading-time');
    
    // Calculate difficulty based on word length and complexity
    const wordLength = wordData.word.length;
    const meaningCount = wordData.meanings.length;
    const difficulty = Math.min(100, (wordLength * 5) + (meaningCount * 10));
    
    difficultyFill.style.width = `${difficulty}%`;
    
    // Calculate reading time
    const totalDefinitions = wordData.meanings.reduce((acc, meaning) => acc + meaning.definitions.length, 0);
    const estimatedTime = Math.max(1, Math.ceil(totalDefinitions * 0.5));
    readingTime.textContent = `${estimatedTime} min`;
}

function playPronunciation() {
    if (currentWord) {
        const utterance = new SpeechSynthesisUtterance(currentWord);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        speechSynthesis.speak(utterance);
        
        // Visual feedback
        pronunciationBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            pronunciationBtn.style.transform = 'scale(1)';
        }, 150);
    }
}

function toggleFavorite() {
    if (!currentWord) return;
    
    const index = favorites.indexOf(currentWord);
    if (index > -1) {
        favorites.splice(index, 1);
        favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
    } else {
        favorites.push(currentWord);
        favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';
    }
    
    localStorage.setItem('vocabulam-favorites', JSON.stringify(favorites));
    updateFavoriteButton();
}

function updateFavoriteButton() {
    if (favorites.includes(currentWord)) {
        favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';
        favoriteBtn.style.color = '#ef4444';
    } else {
        favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
        favoriteBtn.style.color = '#6b7280';
    }
}

function shareWord() {
    if (!currentWord) return;
    
    const shareData = {
        title: `Vocabulam - ${currentWord}`,
        text: `Check out the word "${currentWord}" on Vocabulam!`,
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData);
    } else {
        // Fallback: copy to clipboard
        const shareText = `${shareData.text} ${shareData.url}`;
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('Link copied to clipboard!');
        });
    }
}

function addToSearchHistory(word) {
    if (!searchHistory.includes(word)) {
        searchHistory.unshift(word);
        if (searchHistory.length > 50) {
            searchHistory.pop();
        }
        localStorage.setItem('vocabulam-history', JSON.stringify(searchHistory));
    }
}

function handleSearchSuggestions() {
    const query = wordInput.value.trim().toLowerCase();
    const suggestionsContainer = document.getElementById('search-suggestions');
    
    if (query.length < 2) {
        suggestionsContainer.style.display = 'none';
        return;
    }
    
    const suggestions = searchHistory.filter(word => 
        word.toLowerCase().includes(query) && word.toLowerCase() !== query
    ).slice(0, 5);
    
    if (suggestions.length === 0) {
        suggestionsContainer.style.display = 'none';
        return;
    }
    
    suggestionsContainer.innerHTML = '';
    suggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.textContent = suggestion;
        item.addEventListener('click', () => {
            wordInput.value = suggestion;
            searchWord(suggestion);
            suggestionsContainer.style.display = 'none';
        });
        suggestionsContainer.appendChild(item);
    });
    
    suggestionsContainer.style.display = 'block';
}

// Grammar Assistant Functions
function updateTextStats() {
    const text = grammarInput.value;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    
    wordCount.textContent = `${words} words`;
    charCount.textContent = `${chars} characters`;
    
    // Calculate readability score (simplified Flesch Reading Ease)
    if (words > 0) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
        const avgWordsPerSentence = words / Math.max(sentences, 1);
        const avgSyllablesPerWord = estimateSyllables(text) / words;
        
        const fleschScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
        const normalizedScore = Math.max(0, Math.min(100, Math.round(fleschScore)));
        
        readabilityScore.textContent = `Readability: ${normalizedScore}`;
    } else {
        readabilityScore.textContent = 'Readability: -';
    }
}

function estimateSyllables(text) {
    const words = text.toLowerCase().match(/[a-z]+/g) || [];
    return words.reduce((total, word) => {
        const syllables = word.match(/[aeiouy]+/g) || [];
        return total + Math.max(1, syllables.length);
    }, 0);
}

function checkGrammar() {
    const text = grammarInput.value.trim();
    
    if (!text) {
        showNotification('Please enter some text to analyze');
        return;
    }
    
    const suggestions = analyzeText(text);
    displayGrammarSuggestions(suggestions);
    
    // Calculate overall score
    const score = Math.max(0, 100 - (suggestions.filter(s => s.type !== 'Great Job!').length * 10));
    overallScore.textContent = score;
    
    showGrammarResults();
}

function analyzeText(text) {
    const suggestions = [];
    
    // Enhanced grammar and style checks
    const checks = [
        {
            pattern: /\b(there|their|they're)\b/gi,
            type: 'Commonly Confused Words',
            message: 'Check if you\'re using "there" (location), "their" (possessive), or "they\'re" (contraction) correctly.',
            severity: 'medium'
        },
        {
            pattern: /\b(your|you're)\b/gi,
            type: 'Commonly Confused Words',
            message: 'Make sure you\'re using "your" (possessive) or "you\'re" (contraction) correctly.',
            severity: 'medium'
        },
        {
            pattern: /\b(its|it's)\b/gi,
            type: 'Commonly Confused Words',
            message: 'Check if you need "its" (possessive) or "it\'s" (contraction).',
            severity: 'medium'
        },
        {
            pattern: /\b(affect|effect)\b/gi,
            type: 'Commonly Confused Words',
            message: 'Remember: "affect" is usually a verb, "effect" is usually a noun.',
            severity: 'medium'
        },
        {
            pattern: /[.!?]\s*[a-z]/g,
            type: 'Capitalization',
            message: 'Consider capitalizing the first letter after sentence-ending punctuation.',
            severity: 'low'
        },
        {
            pattern: /\bi\b/g,
            type: 'Capitalization',
            message: 'The pronoun "I" should always be capitalized.',
            severity: 'high'
        },
        {
            pattern: /\s{2,}/g,
            type: 'Spacing',
            message: 'Consider using single spaces between words.',
            severity: 'low'
        },
        {
            pattern: /[.!?]{2,}/g,
            type: 'Punctuation',
            message: 'Multiple punctuation marks may be unnecessary.',
            severity: 'low'
        },
        {
            pattern: /\b(could care less)\b/gi,
            type: 'Common Mistakes',
            message: 'The correct phrase is "couldn\'t care less".',
            severity: 'medium'
        },
        {
            pattern: /\b(for all intensive purposes)\b/gi,
            type: 'Common Mistakes',
            message: 'The correct phrase is "for all intents and purposes".',
            severity: 'medium'
        },
        {
            pattern: /\b(should of|could of|would of)\b/gi,
            type: 'Common Mistakes',
            message: 'Use "should have", "could have", or "would have" instead.',
            severity: 'high'
        }
    ];
    
    checks.forEach(check => {
        if (check.pattern.test(text)) {
            suggestions.push({
                type: check.type,
                message: check.message,
                severity: check.severity
            });
        }
    });
    
    // Check for passive voice
    const passivePatterns = [
        /\b(was|were|been|being)\s+\w+ed\b/gi,
        /\b(is|are|am)\s+\w+ed\b/gi
    ];
    
    passivePatterns.forEach(pattern => {
        if (pattern.test(text)) {
            suggestions.push({
                type: 'Voice',
                message: 'Consider using active voice instead of passive voice for clearer writing.',
                severity: 'medium'
            });
        }
    });
    
    // Check sentence length
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const longSentences = sentences.filter(s => s.trim().split(/\s+/).length > 25);
    
    if (longSentences.length > 0) {
        suggestions.push({
            type: 'Readability',
            message: 'Some sentences are quite long. Consider breaking them into shorter sentences for better readability.',
            severity: 'medium'
        });
    }
    
    // Check for repetitive words
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const wordCount = {};
    words.forEach(word => {
        if (word.length > 3) {
            wordCount[word] = (wordCount[word] || 0) + 1;
        }
    });
    
    const repetitiveWords = Object.entries(wordCount).filter(([word, count]) => count > 3);
    if (repetitiveWords.length > 0) {
        suggestions.push({
            type: 'Style',
            message: `Consider varying your vocabulary. The word "${repetitiveWords[0][0]}" appears ${repetitiveWords[0][1]} times.`,
            severity: 'low'
        });
    }
    
    // If no issues found
    if (suggestions.length === 0) {
        suggestions.push({
            type: 'Great Job!',
            message: 'Your text looks excellent! No obvious grammar or style issues detected.',
            severity: 'none'
        });
    }
    
    return suggestions;
}

function displayGrammarSuggestions(suggestions) {
    suggestionsContainer.innerHTML = '';
    
    suggestions.forEach((suggestion, index) => {
        const suggestionDiv = document.createElement('div');
        suggestionDiv.className = 'suggestion';
        suggestionDiv.style.animationDelay = `${index * 0.1}s`;
        
        // Add severity indicator
        const severityColor = {
            'high': '#ef4444',
            'medium': '#f59e0b',
            'low': '#10b981',
            'none': '#10b981'
        };
        
        suggestionDiv.style.borderLeftColor = severityColor[suggestion.severity] || '#f59e0b';
        
        const typeDiv = document.createElement('div');
        typeDiv.className = 'suggestion-type';
        typeDiv.textContent = suggestion.type;
        typeDiv.style.color = severityColor[suggestion.severity] || '#f59e0b';
        
        const textDiv = document.createElement('div');
        textDiv.className = 'suggestion-text';
        textDiv.textContent = suggestion.message;
        
        suggestionDiv.appendChild(typeDiv);
        suggestionDiv.appendChild(textDiv);
        suggestionsContainer.appendChild(suggestionDiv);
    });
}

function clearGrammarText() {
    grammarInput.value = '';
    hideGrammarResults();
    updateTextStats();
}

function loadSampleText() {
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    grammarInput.value = randomText;
    updateTextStats();
}

function updateResultsDisplay(resultType) {
    // This function would update the display based on the selected result tab
    // For now, we'll just show the suggestions container
    // In a full implementation, you'd have different containers for each tab
}

// Content Generator Functions
function generateContent() {
    const topic = topicInput.value.trim() || lastSearchedWord || 'creativity';
    const type = contentType.value;
    const tone = contentTone.value;
    const length = contentLength.value;
    
    if (!topic) {
        showNotification('Please enter a topic or search for a word first');
        return;
    }
    
    const content = createGeneratedContent(topic, type, tone, length);
    contentOutput.innerHTML = content;
    showGeneratedContent();
}

function createGeneratedContent(topic, type, tone, length) {
    // This is a simplified content generator. In a real app, you'd use AI APIs
    const templates = {
        story: {
            formal: `In the realm of {topic}, there existed a profound understanding that transcended ordinary comprehension. The narrative unfolds with meticulous attention to detail, exploring the intricate relationships between cause and effect. Through careful observation and analysis, one discovers that {topic} serves as a catalyst for transformation, inspiring individuals to pursue excellence in their endeavors.`,
            casual: `So there I was, thinking about {topic}, when it hit me - this stuff is actually pretty amazing! You know how sometimes you stumble upon something that just changes your whole perspective? That's exactly what happened when I really started diving into {topic}. It's like discovering a hidden treasure that was right there all along.`,
            creative: `In a world where {topic} danced through the corridors of imagination, whispers of possibility echoed through time. The very essence of {topic} painted colors that had no names, creating symphonies that only the heart could hear. Each moment spent exploring {topic} was like catching stardust in a bottle.`,
            humorous: `Let me tell you about {topic} - it's like trying to explain quantum physics to a goldfish, except the goldfish is actually paying attention! I mean, who would have thought that {topic} could be so entertaining? It's the kind of thing that makes you laugh, cry, and question your life choices all at the same time.`,
            dramatic: `The weight of {topic} pressed down upon the world like an unstoppable force of nature. In the darkness of uncertainty, {topic} emerged as both salvation and destruction, a double-edged sword that could either elevate humanity to new heights or plunge it into the depths of despair.`
        },
        poem: {
            formal: `Upon the subject of {topic}, I reflect,\nWith measured verse and careful thought,\nEach line composed with deep respect,\nFor wisdom that cannot be bought.\n\nIn structured form, these words take flight,\nTo capture essence, pure and true,\nOf {topic}'s everlasting light,\nThat guides us in all that we do.`,
            casual: `{topic} is pretty cool, I have to say,\nIt brightens up my everyday,\nLike sunshine breaking through the clouds,\nIt makes me want to sing out loud.\n\nSo here's to {topic}, hip hooray!\nIt makes everything okay.`,
            creative: `{topic} whispers secrets to the wind,\nIn languages that flowers understand,\nWhere time and space become rescinded,\nAnd dreams take shape by magic's hand.\n\nThrough kaleidoscope eyes we see,\nThe truth that {topic} sets free.`,
            humorous: `There once was a thing called {topic},\nThat made people quite philanthropic,\nThey'd laugh and they'd play,\nEvery night and each day,\nUntil they became quite myopic!`,
            dramatic: `In the shadows of eternity,\n{topic} stands alone,\nA monument to what we've lost,\nA seed that we have sown.\n\nThrough fire and storm it endures,\nOur {topic}, forever pure.`
        },
        essay: {
            formal: `The significance of {topic} in contemporary discourse cannot be overstated. Through rigorous examination and scholarly analysis, we can observe that {topic} represents a fundamental aspect of human experience that demands careful consideration. This essay will explore the multifaceted nature of {topic}, examining its implications for society, culture, and individual development.`,
            casual: `Let's talk about {topic} for a minute. I think it's one of those things that we don't really think about enough, but when you do start thinking about it, you realize how important it actually is. I mean, {topic} affects pretty much everything we do, whether we realize it or not.`,
            creative: `Imagine {topic} as a living, breathing entity that weaves itself through the fabric of our existence. It's not just a concept or an idea - it's a force that shapes our reality in ways both subtle and profound. When we truly understand {topic}, we begin to see the world through different eyes.`,
            humorous: `So, {topic}. What's the deal with that, right? I mean, seriously, who came up with this stuff? It's like someone sat down one day and thought, "You know what the world needs? More {topic}!" And here we are, trying to make sense of it all while pretending we know what we're talking about.`,
            dramatic: `In the annals of human history, few concepts have wielded as much power as {topic}. It has toppled empires, inspired revolutions, and changed the very course of civilization. To understand {topic} is to understand the human condition itself - with all its beauty, tragedy, and infinite complexity.`
        },
        dialogue: {
            formal: `"I believe we must consider the implications of {topic} most carefully," said Dr. Harrison, adjusting his glasses thoughtfully.\n\n"Indeed," replied Professor Chen, "the research clearly indicates that {topic} plays a crucial role in our understanding of the subject matter."\n\n"Precisely. We cannot afford to overlook the significance of {topic} in our analysis."`,
            casual: `"Hey, have you ever thought about {topic}?" Sarah asked, taking a sip of her coffee.\n\n"Actually, yeah! I was just reading about it yesterday," Mike replied. "It's pretty fascinating stuff."\n\n"Right? I had no idea it was so complex. Makes you think, doesn't it?"`,
            creative: `"The stars whisper of {topic}," the old sage murmured, his eyes reflecting ancient wisdom.\n\n"What do they say?" the young apprentice asked, leaning forward eagerly.\n\n"They speak of mysteries beyond mortal comprehension, child. {topic} is but one thread in the cosmic tapestry."`,
            humorous: `"So, {topic}," Bob said, scratching his head. "That's a thing, apparently."\n\n"Yep," Alice nodded sagely. "Definitely a thing."\n\n"Should we be worried about it?"\n\n"Probably. But let's worry about it tomorrow."`,
            dramatic: `"You don't understand!" Elena cried, her voice echoing through the empty hall. "Everything depends on {topic}!"\n\n"I understand more than you know," Marcus replied grimly. "But some prices are too high to pay."\n\n"Then we are all doomed."`
        },
        description: {
            formal: `{topic} presents itself as a complex phenomenon worthy of detailed examination. Its characteristics include a multifaceted nature that encompasses various dimensions of analysis. The systematic study of {topic} reveals intricate patterns and relationships that contribute to our broader understanding of the subject matter.`,
            casual: `{topic} is one of those things that's hard to describe but you know it when you see it. It's got this quality that just draws you in and makes you want to learn more. There's something really special about {topic} that sets it apart from everything else.`,
            creative: `{topic} emerges like a phoenix from the ashes of ordinary understanding, its essence shimmering with possibilities yet unexplored. It carries within itself the seeds of transformation, waiting to bloom in the garden of consciousness. To witness {topic} is to glimpse the infinite potential that lies dormant within the mundane.`,
            humorous: `{topic} is like that friend who shows up to the party uninvited but somehow makes everything more interesting. It's quirky, unpredictable, and has a tendency to make you question everything you thought you knew. You can't help but love it, even when it drives you absolutely crazy.`,
            dramatic: `{topic} stands before us like a colossus, casting its shadow across the landscape of human experience. It is both beautiful and terrible, inspiring awe and fear in equal measure. In its presence, we are reminded of our own mortality and the fleeting nature of all things.`
        }
    };
    
    const template = templates[type][tone];
    return template.replace(/{topic}/g, topic);
}

function copyContent() {
    const content = contentOutput.textContent;
    navigator.clipboard.writeText(content).then(() => {
        showNotification('Content copied to clipboard!');
    });
}

function regenerateContent() {
    generateContent();
}

function showGeneratedContent() {
    generatedContent.classList.remove('hidden');
}

// Chatbot Functions
function toggleChatbot() {
    chatbotWindow.classList.toggle('hidden');
    if (!chatbotWindow.classList.contains('hidden')) {
        chatbotInput.focus();
        chatNotification.style.display = 'none';
    }
}

function closeChatbot() {
    chatbotWindow.classList.add('hidden');
}

function sendMessage() {
    const message = chatbotInput.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage(message, true);
    
    // Clear input
    chatbotInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Generate bot response
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateBotResponse(message);
        addMessage(response, false);
    }, 1000 + Math.random() * 1000);
}

function addMessage(text, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = isUser ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    if (text.includes('\n')) {
        const lines = text.split('\n');
        lines.forEach(line => {
            if (line.trim().startsWith('•')) {
                const ul = content.querySelector('ul') || document.createElement('ul');
                const li = document.createElement('li');
                li.textContent = line.trim().substring(1).trim();
                ul.appendChild(li);
                if (!content.querySelector('ul')) {
                    content.appendChild(ul);
                }
            } else {
                const p = document.createElement('p');
                p.textContent = line;
                content.appendChild(p);
            }
        });
    } else {
        const p = document.createElement('p');
        p.textContent = text;
        content.appendChild(p);
    }
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    chatbotMessages.appendChild(typingDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = chatbotMessages.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function generateBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Enhanced pattern matching for responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return 'Hello! I\'m VocaBot, your intelligent language companion. I can help you with grammar, vocabulary, writing tips, and content creation. What would you like to explore today?';
    }
    
    if (message.includes('grammar') || message.includes('check')) {
        return 'I\'d be happy to help with grammar! You can use the Grammar Assistant tab to analyze your text for:\n• Grammar errors and corrections\n• Style improvements\n• Readability analysis\n• Common mistake detection\n\nJust paste your text and click "Analyze Text"!';
    }
    
    if (message.includes('word') || message.includes('vocabulary') || message.includes('definition')) {
        return 'Great choice! The Word Explorer is perfect for expanding your vocabulary. You can:\n• Search for detailed word definitions\n• Discover synonyms and antonyms\n• Learn pronunciation and etymology\n• Explore related words\n\nTry searching for words like "serendipity" or "eloquent"!';
    }
    
    if (message.includes('content') || message.includes('generate') || message.includes('write')) {
        return 'The Content Generator can help you create various types of content! You can generate:\n• Short stories and narratives\n• Poems in different styles\n• Essays and articles\n• Dialogues and descriptions\n\nJust choose your content type, tone, and topic to get started!';
    }
    
    if (message.includes('help') || message.includes('how')) {
        return 'I\'m here to help! Here\'s what I can assist you with:\n• Grammar checking and corrections\n• Vocabulary building and word exploration\n• Content generation and creative writing\n• Writing tips and style improvements\n• Language learning guidance\n\nWhat specific area would you like to focus on?';
    }
    
    if (message.includes('thank')) {
        return 'You\'re very welcome! I\'m always here to help you improve your language skills. Feel free to ask me anything about grammar, vocabulary, or writing. Keep up the excellent work!';
    }
    
    if (message.includes('favorite') || message.includes('best')) {
        return 'I love helping people discover new words! Some of my favorite features include:\n• The etymology insights that show word origins\n• The difficulty meter for vocabulary building\n• The content generator for creative inspiration\n\nWhat\'s your favorite word you\'ve discovered recently?';
    }
    
    // Context-aware responses based on current word
    if (currentWord && message.includes(currentWord)) {
        return `I see you\'re interested in "${currentWord}"! That\'s a fascinating word. You can explore its synonyms, learn about its etymology, or even generate creative content using it as inspiration. Would you like me to suggest some related words?`;
    }
    
    // Grammar tips and writing advice
    const grammarTips = [
        'Writing tip: Use active voice when possible. Instead of "The ball was thrown by John," try "John threw the ball." It\'s more direct and engaging!',
        'Grammar reminder: "Who" is for subjects, "whom" is for objects. Ask yourself: would you say "he" or "him"? If "he," use "who." If "him," use "whom."',
        'Style tip: Vary your sentence length for better flow. Mix short, punchy sentences with longer, more detailed ones to keep readers engaged.',
        'Vocabulary tip: Instead of "very + adjective," try a stronger single word. "Very tired" becomes "exhausted," "very happy" becomes "elated."',
        'Punctuation tip: Use the Oxford comma for clarity in lists. "I bought apples, oranges, and bananas" is clearer than "I bought apples, oranges and bananas."',
        'Writing advice: Read your work aloud. If you stumble while reading, your readers probably will too. Smooth flow is key to good writing.',
        'Grammar note: "Its" is possessive (the dog wagged its tail), while "it\'s" is a contraction (it\'s raining). No apostrophe for possession with "its"!'
    ];
    
    const randomTip = grammarTips[Math.floor(Math.random() * grammarTips.length)];
    return randomTip;
}

// Utility Functions
function showLoading() {
    loading.classList.remove('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    error.classList.remove('hidden');
}

function hideError() {
    error.classList.add('hidden');
}

function showResults() {
    resultsContainer.classList.remove('hidden');
}

function hideResults() {
    resultsContainer.classList.add('hidden');
}

function showGrammarResults() {
    grammarResults.classList.remove('hidden');
}

function hideGrammarResults() {
    grammarResults.classList.add('hidden');
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for typing indicator and notifications
const additionalStyles = `
.typing-dots {
    display: flex;
    gap: 4px;
    padding: 8px 0;
}

.typing-dots span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--text-secondary);
    animation: typing 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(1) { animation-delay: 0s; }
.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing {
    0%, 60%, 100% {
        transform: translateY(0);
        opacity: 0.4;
    }
    30% {
        transform: translateY(-10px);
        opacity: 1;
    }
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOut {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}
`;

// Add the additional styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
