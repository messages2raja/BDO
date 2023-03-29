// Get the DOM elements
const fileUpload = document.getElementById("file");
const columnNameSelect = document.getElementById("columnNameSelect");
const startRowInput = document.getElementById("startRowInput");
const endRowInput = document.getElementById("endRowInput");
const displayFilteredData = document.getElementById("displayFilteredData");
const downloadCsvButton = document.getElementById("downloadCsv");

// CSV download functionality
function download_csv(csv, filename) {
  const csvFile = new Blob([csv], { type: "text/csv" });
  const downloadLink = document.createElement("a");
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  downloadLink.click();
}

// CSV download functionality
function export_table_to_csv(filename) {
  const csv = [];
  const rows = document.querySelectorAll("table tr");

  for (let i = 0; i < rows.length; i++) {
    const row = [];
    const cols = rows[i].querySelectorAll("td, th");

    for (let j = 0; j < cols.length; j++) {
      row.push(cols[j].innerText);
    }

    csv.push(row.join(","));
  }
  download_csv(csv.join("\n"), filename);
}

downloadCsvButton.addEventListener("click", function () {
  export_table_to_csv("filtered_salesdata.csv");
});

// Upload form submit functionality
function handleSubmit(event) {
  event.preventDefault();
  const file = fileUpload.files[0];
  const regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/i;
  if (regex.test(file.name)) {
    const reader = new FileReader();
    reader.onload = function (e) {
      let table = document.createElement("table");
      let rows = e.target.result.split("\n");
      const columnName = columnNameSelect.value;
      const columnIndex = rows[0].split(",").indexOf(columnName);
      const startRow = parseInt(startRowInput.value);
      const endRow = parseInt(endRowInput.value);
      for (let i = startRow; i < endRow; i++) {
        const cells = rows[i].split(",");
        const row = table.insertRow(-1);
        const cell0 = row.insertCell(0);
        const cell1 = row.insertCell(1);
        cell0.textContent = i;
        cell1.textContent = cells[columnIndex];
      }
      const headerRow = table.insertRow(0);
      headerRow.insertCell(0).textContent = "S.No";
      headerRow.insertCell(1).textContent = columnName;
      displayFilteredData.innerHTML = "";
      displayFilteredData.appendChild(table);
    };
    reader.readAsText(file);
    downloadCsvButton.disabled = false;
  } else {
    alert("Please upload a valid CSV file.");
  }
}

// Fileupload change functionality
const fileUploader = document.getElementById("file");
fileUploader.addEventListener("change", () => {
  const fileReader = new FileReader();
  fileReader.onloadend = (e) => {
    let r = fileReader.result.split("\n");
    let rowHeader = r[0].split(",");
    console.log(r[0]);

    for (var i = 1; i <= rowHeader.length - 1; i++) {
      var opt = document.createElement("option");
      opt.value = rowHeader[i];
      opt.innerHTML = rowHeader[i];
      columnNameSelect.appendChild(opt);
    }
    document.getElementById("fileName").textContent =
      fileUploader.files[0].name;
  };
  fileReader.readAsText(fileUploader.files[0]);
});
