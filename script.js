let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
];

let winningCombination = null;

const winningPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Zeilen
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Spalten
    [0, 4, 8], [2, 4, 6]             // Diagonalen
];


function init() {
    render();
}

function render() {
    let content = document.getElementById('content');
    let table = '<table>';
    for (let i = 0; i < 3; i++) {
        table += '<tr>';
        for (let j = 0; j < 3; j++) {
            let index = i * 3 + j;
            let symbol = fields[index] === 'circle' ? generateCircleSVG() : (fields[index] === 'cross' ? generateCrossSVG() : '');
            table += `<td onclick="cellClicked(${index}, this)">${symbol}</td>`;
        }
        table += '</tr>';
    }
    table += '</table>';
    content.innerHTML = table;
}

function cellClicked(index, tdElement) {
    if (fields[index] === null) {
        fields[index] = (fields.filter(field => field === 'circle').length <= fields.filter(field => field === 'cross').length) ? 'circle' : 'cross';
        tdElement.innerHTML = fields[index] === 'circle' ? generateCircleSVG() : generateCrossSVG();
        tdElement.onclick = null; // Entferne das onclick-Attribut, um weitere Klicks zu verhindern
        
        if (isGameOver() && winningCombination) {
            drawWinningLine(winningCombination); // Hier wird zuerst die Linie gezeichnet
            removeClickHandlers(); // Keine weiteren Klicks erlauben
        }
    }
}

function getWinningCombination() {
    // Überprüfe für jedes Siegermuster, ob ein Spieler gewonnen hat
    for (const pattern of winningPatterns) {
        const [a, b, c] = pattern;
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            return pattern;
        }
    }
    
    return null; // Wenn kein Spieler gewonnen hat
}


function isGameOver() {
    if (winningCombination) {
        return true; // Das Spiel ist vorbei, wenn eine Gewinnkombination vorhanden ist
    }

    // Überprüfe für jedes Siegermuster, ob ein Spieler gewonnen hat
    winningCombination = getWinningCombination();
    if (winningCombination) {
        console.log('Spiel vorbei! Ein Spieler hat gewonnen!');
        return true;
    }

    // Überprüfe auf Unentschieden
    if (!fields.includes(null)) {
        console.log('Spiel vorbei! Unentschieden!');
        return true;
    }

    return false;
}

function drawWinningLine(combination) {
    const lineColor = '#ffffff';
    const lineWidth = 5;

    const cells = document.querySelectorAll('td');

    // Start- und Endzellen der Linie
    const startCell = cells[combination[0]];
    const endCell = cells[combination[2]];

    // Position der Startzelle relativ zum Dokument
    const startRect = startCell.getBoundingClientRect();
    const startX = startRect.left + startRect.width / 2 + window.scrollX;
    const startY = startRect.top + startRect.height / 2 + window.scrollY;

    // Position der Endzelle relativ zum Dokument
    const endRect = endCell.getBoundingClientRect();
    const endX = endRect.left + endRect.width / 2 + window.scrollX;
    const endY = endRect.top + endRect.height / 2 + window.scrollY;

    // Länge und Winkel der Linie
    const lineLength = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    const lineAngle = Math.atan2(endY - startY, endX - startX);

    // Erstellen und Positionieren der Linie
    const line = document.createElement('div');
    line.style.position = 'absolute';
    line.style.width = `${lineLength}px`;
    line.style.height = `${lineWidth}px`;
    line.style.backgroundColor = lineColor;
    line.style.top = `${startY - lineWidth / 2}px`; // Mittelpunkt der Zelle
    line.style.left = `${startX}px`; // Mittelpunkt der Zelle
    line.style.transformOrigin = '0 0'; // Ändern Sie die Transformationsursprung für die korrekte Drehung
    line.style.transform = `rotate(${lineAngle}rad)`;
    document.getElementById('content').appendChild(line);
}




function removeClickHandlers() {
    let tds = document.querySelectorAll('td');
    tds.forEach(td => {
        td.onclick = null;
    });
}

function generateCircleSVG() {
    // SVG-Element erstellen und Eigenschaften festlegen
    let svg = `<svg width="70" height="70" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
                <circle cx="35" cy="35" r="30" fill="none" stroke="#00B0EF" stroke-width="5">
                  <animate attributeName="r" from="0" to="30" dur="0.5s" begin="0s" fill="freeze" />
                </circle>
              </svg>`;
    
    return svg;
}


function generateCrossSVG() {
    // SVG-Element erstellen und Eigenschaften festlegen
    let svg = `<svg width="70" height="70" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
                <line x1="10" y1="10" x2="60" y2="60" stroke="#FFC000" stroke-width="5">
                  <animate attributeName="x2" from="10" to="60" dur="0.5s" begin="0s" fill="freeze" />
                  <animate attributeName="y2" from="10" to="60" dur="0.5s" begin="0s" fill="freeze" />
                </line>
                <line x1="60" y1="10" x2="10" y2="60" stroke="#FFC000" stroke-width="5">
                  <animate attributeName="x2" from="60" to="10" dur="0.5s" begin="0s" fill="freeze" />
                  <animate attributeName="y2" from="10" to="60" dur="0.5s" begin="0s" fill="freeze" />
                </line>
              </svg>`;
    
    return svg;
}

function restartGame() {
    fields = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
    ];

    winningCombination = null;
    render();
}


