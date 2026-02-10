// Function to get cookie value
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Function to set cookie
function setCookie(name, value, days = 365) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
}

// Apply saved theme immediately to avoid flash
const savedTheme = getCookie('theme') || 'light';
document.body.classList.toggle('dark-mode', savedTheme === 'dark');

// Placeholder for JavaScript functionality
// Later, this can be used to load data from CSV files

document.addEventListener('DOMContentLoaded', function() {
    console.log('Academic Portfolio loaded');
    if (document.getElementById('publications-list')) {
        loadPublications();
    }

    // Dark mode toggle
    const toggleButton = document.getElementById('dark-mode-toggle');
    if (toggleButton) {
        toggleButton.textContent = savedTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';

        toggleButton.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            setCookie('theme', theme);
            toggleButton.textContent = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
        });
    }
});

function loadPublications() {
    fetch('publications.csv')
        .then(response => response.text())
        .then(data => {
            const publications = parseCSV(data);
            displayPublications(publications);
        })
        .catch(error => console.error('Error loading publications:', error));
}

function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    const rows = lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index].trim();
            return obj;
        }, {});
    });
    return rows;
}

function displayPublications(publications) {
    const list = document.getElementById('publications-list');
    list.innerHTML = '<ul>' + publications.map(pub => 
        `<li><strong>${pub.Title}</strong> by ${pub.Authors} (${pub.Year}) - ${pub.Journal}</li>`
    ).join('') + '</ul>';
}
