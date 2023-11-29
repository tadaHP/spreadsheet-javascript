const spreadSheetContainer =
    document.querySelector("#spreadsheet-container")
const exportBtn = document.querySelector("#export-btn");
const ROWS = 10
const COLS = 10
const spreadsheet = []
const alphabets = ["","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O"]
class Cell {
    constructor(isHeader, disabled, data, row, column,rowName ,columnName,active = false) {
        this.isHeader = isHeader;
        this.disabled = disabled;
        this.data = data;
        this.row = row;
        this.column = column;
        this.rowName = rowName;
        this.columnName = columnName;
        this.active = active;
    }
}

exportBtn.onclick = function (e) {
    let data = "";
    for (let i = 1; i < spreadsheet.length; i++) {
        data += spreadsheet[i]
            .filter((item) => !item.isHeader)
            .map((item) => item.data)
            .join(",") + "\r\n";
    }
    const csv = new Blob([data]);
    const csvUrl = URL.createObjectURL(csv);
    const a = document.createElement("a");
    a.href = csvUrl;
    a.download = "FileName.csv";
    a.click();
};


initSpreadsheet();
function initSpreadsheet(){
    for (let i = 0; i < ROWS; i++) {
        let spreadsheetRow = [];
        for (let j = 0; j < COLS; j++) {
            let cellData = "";
            let isHeader = false;
            let disabled = false;

            if (j === 0) {
                cellData = i;
                isHeader = true;
                disabled = true;
            }

            if (i === 0) {
                cellData = alphabets[j];
                isHeader = true;
                disabled = true;
            }

            const cell = new Cell(isHeader, disabled, cellData, i, j, i, alphabets[j], false);
            spreadsheetRow.push(cell);
        }
        spreadsheet.push(spreadsheetRow);
    }
    drawSheet();
    console.log("spreadsheet", spreadsheet);
}

function createCellEl(cell) {
    const cellEl = document.createElement("input");
    cellEl.className = "cell";
    cellEl.id = "cell_" + cell.row + cell.column;
    cellEl.value = cell.data;
    cellEl.disabled = cell.disabled;
    if (cell.isHeader) {
        cellEl.classList.add("header");
    }
    cellEl.onclick = () => handleCellClick(cell);
    cellEl.onchange = (e) => handleOnChange(e.target.value, cell);
    return cellEl;
}

function handleOnChange(data, cell) {
    cell.data = data;
}

function handleCellClick(cell) {
    clearHeaderActiveStates();
    const columnHeader = spreadsheet[0][cell.column];
    const rowHeader = spreadsheet[cell.row][0];
    const columnHeaderEl = getElFromRowCol(columnHeader.row, columnHeader.column);
    const rowHeaderEl = getElFromRowCol(rowHeader.row, rowHeader.column);
    columnHeaderEl.classList.add("active");
    rowHeaderEl.classList.add("active");
    document.querySelector("#cell-status").innerHTML = cell.columnName + "" + cell.rowName;
}

function getElFromRowCol(row, col) {
    return document.querySelector("#cell_" + row + col);
}

function clearHeaderActiveStates() {
    const headers = document.querySelectorAll(".header");
    headers.forEach((header) => {
        header.classList.remove("active");
    });

}

function drawSheet() {
    for (let i = 0; i < spreadsheet.length; i++) {
        const rowContainerEl = document.createElement("div");
        rowContainerEl.className = "cell-row";
        for (let j = 0; j < spreadsheet[i].length; j++) {
            const cell = spreadsheet[i][j];
            rowContainerEl.append(createCellEl(cell));
        }
        spreadSheetContainer.append(rowContainerEl);
    }
}



