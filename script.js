// Functions for cookie handling
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function setCookie(name, value, days = 365) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
}

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
        const currentTheme = document.documentElement.classList.contains('dark-mode') ? 'dark' : 'light';
        toggleButton.textContent = currentTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';

        toggleButton.addEventListener('click', function() {
            document.documentElement.classList.toggle('dark-mode');
            const theme = document.documentElement.classList.contains('dark-mode') ? 'dark' : 'light';
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
    const headers = parseCSVLine(lines[0]);
    const rows = lines.slice(1).map(line => {
        const values = parseCSVLine(line);
        return headers.reduce((obj, header, index) => {
            obj[header] = values[index] || '';
            return obj;
        }, {});
    });
    return rows;
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++; // skip next
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}

function displayPublications(publications) {
    const list = document.getElementById('publications-list');
    list.innerHTML = '<ul>' + publications.map(pub => {
        let pdfLink = '';
        if (pub.Title.includes('Distributed ML Property Attestation')) {
            pdfLink = '<br><a href="Distributed_ML_Property_Attestation_using_TEEs-2.pdf" target="_blank" class="pdf-link">View PDF</a>';
        } else if (pub.Title.includes('A Study on Machine Learning-Based Network Intrusion Detection System')) {
            pdfLink = '<br><a href="A_Study_on_Machine_Learning_Based_Network_Intrusion_Detection_System.pdf" target="_blank" class="pdf-link">View PDF</a>';
        }
        return `<li><strong>${pub.Title}</strong> by ${pub.Authors} (${pub.Year}) - ${pub.Journal}${pdfLink}<br><p class="publication-description">${pub.Description}</p></li>`;
    }).join('') + '</ul>';
}
