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

let currentPlayer = 'circle';

function init() {
    render();
};

function render() {
    // Initialisiert den HTML-String für die Tabelle
    let tableHTML = "<table>";
    
    // Erste Schleife für die Zeilen der 3x3-Tabelle (es gibt 3 Zeilen insgesamt)
    for (let i = 0; i < 3; i++) {
        tableHTML += "<tr>"; // Fügt eine neue Tabellenzeile hinzu
        
        // Zweite Schleife für die Spalten in jeder Zeile (3 Spalten pro Zeile)
        for (let j = 0; j < 3; j++) {
            // Berechnet den Index für das aktuelle Feld im 1D-Array `fields`
            const index = i * 3 + j;
            // Holt den Inhalt des aktuellen Feldes aus dem `fields`-Array
            const cellContent = fields[index];
            
            // Wenn das aktuelle Feld ein "circle" enthält, wird die SVG-Grafik für den Kreis eingefügt
            if (cellContent === 'circle') {
                tableHTML += `<td class="circle">${generateCircleSVG()}</td>`;
                
            // Wenn das aktuelle Feld ein "cross" enthält, wird die SVG-Grafik für das Kreuz eingefügt
            } else if (cellContent === 'cross') {
                tableHTML += `<td class="cross">${generateCrossSVG()}</td>`;
                
            // Wenn das Feld leer ist (also `null`), wird ein leeres <td> erstellt
            // und eine onclick-Funktion hinzugefügt, um Klicks auf dieses Feld zu registrieren
            } else {
                tableHTML += `<td onclick="handleCellClick(${index})"></td>`;
            }
        }
        
        // Schließt die aktuelle Tabellenzeile
        tableHTML += "</tr>";
    }
    
    // Schließt die Tabelle ab
    tableHTML += "</table>";
    
    // Setzt den Inhalt des Elements mit der ID "content" auf den generierten HTML-Tabellenstring
    document.getElementById("content").innerHTML = tableHTML;
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
    render();
    const line = document.getElementById("winning-line");
    if (line) {
    line.remove(); // Entfernt die Linie, falls sie existiert
}
}

function handleCellClick(index) {
    if (!fields[index]) { // Wenn ein Feld noch keinen Index hat wird ausgeführt eine not Bedingung.
        fields[index] = currentPlayer; // Setzt das aktuelle Symbol in das Array
        
        // Findet die entsprechende Zelle und fügt das SVG ein
        const cell = document.querySelectorAll("td")[index];
        cell.innerHTML = currentPlayer === 'circle' ? generateCircleSVG() : generateCrossSVG(); // Gekürzte if else Anfrage. Wenn circle vorhanden dann circle Grafik ansonsten cross Grafik.
        
        // Entfernt das onclick-Attribut, damit das Feld nicht mehr verändert werden kann
        cell.onclick = null;

         // Überprüft nach jedem Zug, ob es einen Gewinner gibt
         if (checkWinner()) {
            return; // Spiel ist vorbei, kein weiterer Zug möglich
        }
        
        // Spieler wechseln Diese Zeile wechselt den aktuellen Spieler, der das nächste Symbol setzt, indem sie die Variable currentPlayer abwechselnd auf 'circle' oder 'cross' setzt.
        currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle'; // verkürzte if else die die Variable dann ändert auf circle oder cross.
    }
}

function checkWinner() {
    // Definiert alle möglichen Gewinnkombinationen
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontale Kombinationen
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertikale Kombinationen
        [0, 4, 8], [2, 4, 6]             // Diagonale Kombinationen
    ];
    
    // Geht durch jede Gewinnkombination
    for (let combination of winningCombinations) {
        // Entpackt die drei Indizes der aktuellen Gewinnkombination in die Variablen a, b und c
        const [a, b, c] = combination;
        
        // Überprüft, ob alle drei Felder der Kombination nicht leer sind und dasselbe Symbol enthalten
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            // Wenn die Bedingung erfüllt ist, gibt es einen Gewinner
            // Zeichnet eine weiße Linie, die die drei Felder der Gewinnkombination verbindet
            drawWinningLine(combination); 
            
            // Zeigt eine Meldung an, welcher Spieler gewonnen hat (circle oder cross)
            alert(`${fields[a]} hat gewonnen!`);
            
            // Gibt true zurück, um anzuzeigen, dass das Spiel vorbei ist
            return true;
        }
    }

    // Wenn keine Gewinnkombination gefunden wurde und alle Felder besetzt sind Wenn felder nicht null sind dann untenschieden.
    if (!fields.includes(null)) {
        // Wenn es keine leeren Felder (null) mehr gibt, aber niemand gewonnen hat, ist es ein Unentschieden
        alert("Unentschieden!");
        
        // Gibt true zurück, um anzuzeigen, dass das Spiel vorbei ist
        return true;
    }

    // Wenn keine Gewinnkombination gefunden wurde und noch leere Felder vorhanden sind
    // Gibt false zurück, um anzuzeigen, dass das Spiel noch weitergeht
    return false;
}

function drawWinningLine(winningCombination) {
    // Holt alle <td>-Elemente (alle Zellen der Tabelle) und speichert sie in "cells"
    const cells = document.querySelectorAll("td");

    // Holt die erste und die letzte Zelle der Gewinnkombination
    const startCell = cells[winningCombination[0]];
    const endCell = cells[winningCombination[2]];

    // Berechnet die Mittelpunkte der Start- und Endzellen
    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();

    const startX = startRect.left + startRect.width / 2 + window.scrollX;
    const startY = startRect.top + startRect.height / 2 + window.scrollY;
    const endX = endRect.left + endRect.width / 2 + window.scrollX;
    const endY = endRect.top + endRect.height / 2 + window.scrollY;

    // Erstellt ein neues <div>-Element, das als Linie dienen wird
    const line = document.createElement("div");
    line.style.position = "absolute";
    line.style.backgroundColor = "white";
    line.style.width = "5px";

    // Berechnet die Länge der Linie mithilfe des Satzes des Pythagoras
    const lineLength = Math.hypot(endX - startX, endY - startY);
    line.style.height = `${lineLength}px`;

    // Setzt die Linie auf die Startposition
    line.style.left = `${startX}px`;
    line.style.top = `${startY}px`;

    // Setzt den Ursprung für die Rotation am Anfang der Linie
    line.style.transformOrigin = "top left";

    // Rotiert die Linie, sodass sie genau zwischen Start- und Endpunkten liegt
    const angle = Math.atan2(endY - startY, endX - startX); // Berechnet den Winkel in Radians
    line.style.transform = `rotate(${angle}rad)`;

    line.id = "winning-line"; // Eindeutige ID für die Linie

    // (Hier kommen die restlichen Stile und Berechnungen für die Linie hin)

    document.body.appendChild(line);
}

function generateCircleSVG() {
    return `
        <svg width="120" height="120" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
            <circle 
                cx="35" cy="35" r="30" 
                stroke="#00B0EF" 
                stroke-width="5" 
                fill="none" 
                stroke-dasharray="188.4" 
                stroke-dashoffset="188.4"
                style="animation: fillCircle 1s forwards ease-out;"
            />
            <style>
                @keyframes fillCircle {
                    from {
                        stroke-dashoffset: 188.4;
                    }
                    to {
                        stroke-dashoffset: 0;
                    }
                }
            </style>
        </svg>
    `;
}

function generateCrossSVG() {
    return `
        <svg width="120" height="120" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
            <line x1="10" y1="10" x2="60" y2="60" 
                  stroke="#FFC000" stroke-width="5" 
                  stroke-dasharray="70" 
                  stroke-dashoffset="70"
                  style="animation: drawLine 1.5s forwards ease-out;" />
            <line x1="10" y1="60" x2="60" y2="10" 
                  stroke="#FFC000" stroke-width="5" 
                  stroke-dasharray="70" 
                  stroke-dashoffset="70"
                  style="animation: drawLine 1s forwards ease-out;" />
            <style>
                @keyframes drawLine {
                    from {
                        stroke-dashoffset: 70;
                    }
                    to {
                        stroke-dashoffset: 0;
                    }
                }
            </style>
        </svg>
    `;
}