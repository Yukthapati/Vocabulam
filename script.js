function displayWordData(word, definition, example) {
    document.getElementById('word').innerText = word;
    document.getElementById('definition').innerText = definition;
    document.getElementById('example').innerText = `Example: "${example}"`;
    document.getElementById('error').innerText = ''; // Clear any previous error
}

function handleError(message) {
    document.getElementById('error').innerText = message;
    document.getElementById('word').innerText = '---';
    document.getElementById('definition').innerText = 'Please try again.';
    document.getElementById('example').innerText = 'Example: ---';
}

async function searchWord() {
    const query = document.getElementById('search').value.trim();
    if (!query) {
        handleError('Please enter a word to search.');
        return;
    }
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`);
        if (!response.ok) throw new Error('Word not found');
        const data = await response.json();
        const word = data[0].word;
        const definition = data[0].meanings[0].definitions[0].definition;
        const example = data[0].meanings[0].definitions[0].example || 'No example available.';
        displayWordData(word, definition, example);
    } catch (error) {
        handleError('Word not found. Please try another.');
    }
}