let claimNumber = 20042047;

function incrementClaim() {
  claimNumber++;
  document.getElementById("claim-number").textContent = claimNumber;
}

// General add row function
function addRow(formId, bodyId, fieldIds) {
  document.getElementById(formId).addEventListener("submit", function (e) {
    e.preventDefault();
    const row = document.createElement("tr");
    fieldIds.forEach(id => {
      const val = document.getElementById(id).value;
      const cell = document.createElement("td");
      cell.textContent = val;
      row.appendChild(cell);
    });
    document.getElementById(bodyId).appendChild(row);
    e.target.reset();
    incrementClaim();
  });
}

// Attach all forms
addRow("prescription-form", "prescription-body", ["drugName", "drugDate", "provider", "amount"]);
addRow("otc-form", "otc-body", ["otcName", "otcDate", "otcAmount", "otcSeller", "otcReason"]);
addRow("supplies-form", "supplies-body", ["itemName", "itemDate", "prescribed", "supplyAmount", "supplySeller"]);
addRow("parking-form", "parking-body", ["parkingAddress", "parkingDate", "parkingAmount", "meterNumber"]);
addRow("mileage-form", "mileage-body", ["mileDate", "mileFrom", "mileTo", "mileKM"]);
addRow("fare-form", "fare-body", ["fareDate", "fareFrom", "fareTo", "fareMode", "fareAmount"]);

// ✅ User Name confirmation handling
document.getElementById("username-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("username").value;
  const text = document.getElementById("confirmation-text");

  text.textContent = `${name} requested reimbursement for the following medical and/or travel expenses:`;
  text.style.display = "block";

  e.target.style.display = "none"; // hide the name form
});

// ✅ PDF generation with forms hidden
document.getElementById("download-pdf").addEventListener("click", async () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: "a4"
  });

  const content = document.getElementById("pdf-content");

  // 🔒 Hide all forms before PDF capture
  const forms = document.querySelectorAll("form");
  forms.forEach(form => form.style.display = "none");

  await html2canvas(content, {
    scale: 2,
    useCORS: true
  }).then(canvas => {
    const imgData = canvas.toDataURL("image/png");
    const imgProps = doc.getImageProperties(imgData);
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    doc.addImage(imgData, "PNG", 20, 20, pdfWidth - 40, pdfHeight);
    doc.save("Medical_Travel_Expense_Request.pdf");
  });

  // ✅ Show forms back after PDF generation
  forms.forEach(form => form.style.display = "block");
});
