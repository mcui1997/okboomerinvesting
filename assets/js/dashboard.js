function openTab(evt, tabName) {
  // Hide all tab content
  const tabContents = document.getElementsByClassName("tab-content");
  for (let i = 0; i < tabContents.length; i++) {
    tabContents[i].classList.remove("active");
  }

  // Remove active class from all tab buttons
  const tabButtons = document.getElementsByClassName("tab-button");
  for (let i = 0; i < tabButtons.length; i++) {
    tabButtons[i].classList.remove("active");
  }

  // Show the selected tab and mark button as active
  document.getElementById(tabName).classList.add("active");
  evt.currentTarget.classList.add("active");
}

// Real-time total calculation for allocation inputs
const allocationInputs = ["spy-target", "vxus-target", "vb-target"];

// Add event listeners when page loads
document.addEventListener("DOMContentLoaded", function () {
  allocationInputs.forEach((id) => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener("input", updateAllocationTotal);
    }
  });

  // IRA inputs
  const iraInputs = ["vti-target", "gld-target", "ibit-target"];
  iraInputs.forEach((id) => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener("input", updateIRATotal);
    }
  });

  // Taxable inputs
  const taxableInputs = ["taxable-gld-target", "taxable-ibit-target"];
  taxableInputs.forEach((id) => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener("input", updateTaxableTotal);
    }
  });
});

function updateAllocationTotal() {
  let total = 0;
  allocationInputs.forEach((id) => {
    const value = parseInt(document.getElementById(id).value) || 0;
    total += value;
  });

  const totalDisplay = document.getElementById("total-allocation");
  const errorDisplay = document.getElementById("allocation-error");

  totalDisplay.textContent = `Total Equity: ${total}%`;

  if (total > 100 || total < 50) {
    totalDisplay.style.color = "#ef4444";
    errorDisplay.style.display = "inline";
    errorDisplay.textContent = "Equity positions should be 50-100%";
  } else {
    totalDisplay.style.color = "#22c55e";
    errorDisplay.style.display = "none";
  }
}

function updateIRATotal() {
  const iraInputs = ["vti-target", "gld-target", "ibit-target"];
  let total = 0;
  iraInputs.forEach((id) => {
    const value = parseInt(document.getElementById(id).value) || 0;
    total += value;
  });

  const totalDisplay = document.getElementById("ira-total-allocation");
  const errorDisplay = document.getElementById("ira-allocation-error");

  totalDisplay.textContent = `Total Equity: ${total}%`;

  if (total > 100 || total < 50) {
    totalDisplay.style.color = "#ef4444";
    errorDisplay.style.display = "inline";
    errorDisplay.textContent = "Equity positions should be 50-100%";
  } else {
    totalDisplay.style.color = "#22c55e";
    errorDisplay.style.display = "none";
  }
}

function updateTaxableTotal() {
  const gld =
    parseInt(document.getElementById("taxable-gld-target").value) || 0;
  const ibit =
    parseInt(document.getElementById("taxable-ibit-target").value) || 0;
  const total = gld + ibit;

  const totalDisplay = document.getElementById("taxable-total-allocation");
  const errorDisplay = document.getElementById("taxable-allocation-error");

  totalDisplay.textContent = `Total Equity: ${total}%`;

  if (total > 100 || total < 50) {
    totalDisplay.style.color = "#ef4444";
    errorDisplay.style.display = "inline";
    errorDisplay.textContent = "Equity positions should be 50-100%";
  } else {
    totalDisplay.style.color = "#22c55e";
    errorDisplay.style.display = "none";
  }
}

// Helper function to get allocation percentage based on RSI and risk profile
function getAllocationRange(rsi, targetPercent, profile) {
  let multiplier;

  // Determine multiplier based on RSI zones
  if (rsi < 30) {
    multiplier = 1.0; // 100%
  } else if (rsi >= 30 && rsi < 40) {
    multiplier = 0.95; // 90-100%, use midpoint
  } else if (rsi >= 40 && rsi < 60) {
    multiplier = 0.85; // 80-90%, use midpoint
  } else if (rsi >= 60 && rsi < 70) {
    multiplier = 0.75; // 70-80%, use midpoint
  } else if (rsi >= 70 && rsi < 80) {
    multiplier = 0.65; // 60-70%, use midpoint
  } else {
    // RSI >= 80
    multiplier = 0.55; // 50-60%, use midpoint
  }

  // Adjust multiplier based on risk profile
  if (profile === "conservative") {
    multiplier -= 0.1; // More aggressive trimming
  } else if (profile === "aggressive") {
    multiplier += 0.1; // Less trimming
  }

  // Ensure multiplier stays within bounds
  multiplier = Math.max(0.4, Math.min(1.0, multiplier));

  return Math.round(targetPercent * multiplier);
}

function calculateEmployerAllocations() {
  // Get user inputs
  const spyTarget = parseInt(document.getElementById("spy-target").value) || 0;
  const vxusTarget =
    parseInt(document.getElementById("vxus-target").value) || 0;
  const vbTarget = parseInt(document.getElementById("vb-target").value) || 0;

  const total = spyTarget + vxusTarget + vbTarget;

  // Validate total is reasonable (50-100% equity)
  if (total < 50 || total > 100) {
    alert(
      "Your equity allocations should be between 50-100%. Currently: " +
        total +
        "%"
    );
    return;
  }

  // Get RSI values
  const spyRSI = parseInt(document.getElementById("spy-rsi").value);
  const vxusRSI = parseInt(document.getElementById("vxus-rsi").value);
  const vbRSI = parseInt(document.getElementById("vb-rsi").value);

  // Validate RSI inputs
  if (isNaN(spyRSI) || isNaN(vxusRSI) || isNaN(vbRSI)) {
    alert("Please enter RSI values for all assets before calculating.");
    return;
  }

  if (
    spyRSI < 0 ||
    spyRSI > 100 ||
    vxusRSI < 0 ||
    vxusRSI > 100 ||
    vbRSI < 0 ||
    vbRSI > 100
  ) {
    alert("RSI values must be between 0 and 100.");
    return;
  }

  // Calculate allocations for all three profiles
  const results = [
    {
      asset: "S&P 500 Fund",
      rsi: spyRSI,
      conservative: getAllocationRange(spyRSI, spyTarget, "conservative"),
      moderate: getAllocationRange(spyRSI, spyTarget, "moderate"),
      aggressive: getAllocationRange(spyRSI, spyTarget, "aggressive"),
    },
    {
      asset: "International Fund",
      rsi: vxusRSI,
      conservative: getAllocationRange(vxusRSI, vxusTarget, "conservative"),
      moderate: getAllocationRange(vxusRSI, vxusTarget, "moderate"),
      aggressive: getAllocationRange(vxusRSI, vxusTarget, "aggressive"),
    },
    {
      asset: "Small Cap Fund",
      rsi: vbRSI,
      conservative: getAllocationRange(vbRSI, vbTarget, "conservative"),
      moderate: getAllocationRange(vbRSI, vbTarget, "moderate"),
      aggressive: getAllocationRange(vbRSI, vbTarget, "aggressive"),
    },
  ];

  // Calculate cash (what's left after RSI-adjusted equity positions)
  const conservativeCash =
    100 - results.reduce((sum, r) => sum + r.conservative, 0);
  const moderateCash = 100 - results.reduce((sum, r) => sum + r.moderate, 0);
  const aggressiveCash =
    100 - results.reduce((sum, r) => sum + r.aggressive, 0);

  // Build results table
  const resultsDiv = document.getElementById("employer-results");
  resultsDiv.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Asset</th>
          <th>Current RSI</th>
          <th>Conservative</th>
          <th>Moderate</th>
          <th>Aggressive</th>
        </tr>
      </thead>
      <tbody>
        ${results
          .map(
            (r) => `
          <tr>
            <td class="asset-name">${r.asset}</td>
            <td class="rsi-value">${r.rsi}</td>
            <td>${r.conservative}%</td>
            <td>${r.moderate}%</td>
            <td>${r.aggressive}%</td>
          </tr>
        `
          )
          .join("")}
        <tr>
          <td class="asset-name">Cash/Stable Value</td>
          <td>-</td>
          <td>${conservativeCash}%</td>
          <td>${moderateCash}%</td>
          <td>${aggressiveCash}%</td>
        </tr>
        <tr class="note-row">
          <td colspan="5">💡 Cash position adjusts automatically based on market valuations. Low RSI = more invested, High RSI = more cash. Choose the profile that matches your risk tolerance.</td>
        </tr>
      </tbody>
    </table>
  `;
  resultsDiv.classList.add("show");

  // Scroll to results
  resultsDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function calculateIRAAllocations() {
  // Get user inputs
  const vtiTarget = parseInt(document.getElementById("vti-target").value) || 0;
  const gldTarget = parseInt(document.getElementById("gld-target").value) || 0;
  const ibitTarget =
    parseInt(document.getElementById("ibit-target").value) || 0;

  const total = vtiTarget + gldTarget + ibitTarget;

  // Validate total is reasonable (50-100% equity)
  if (total < 50 || total > 100) {
    alert(
      "Your equity allocations should be between 50-100%. Currently: " +
        total +
        "%"
    );
    return;
  }

  // Get RSI values
  const vtiRSI = parseInt(document.getElementById("vti-rsi").value);
  const gldRSI = parseInt(document.getElementById("gld-rsi").value);
  const ibitRSI = parseInt(document.getElementById("ibit-rsi").value);

  // Validate RSI inputs
  if (isNaN(vtiRSI) || isNaN(gldRSI) || isNaN(ibitRSI)) {
    alert("Please enter RSI values for all assets before calculating.");
    return;
  }

  if (
    vtiRSI < 0 ||
    vtiRSI > 100 ||
    gldRSI < 0 ||
    gldRSI > 100 ||
    ibitRSI < 0 ||
    ibitRSI > 100
  ) {
    alert("RSI values must be between 0 and 100.");
    return;
  }

  // Calculate allocations for all three profiles
  const results = [
    {
      asset: "VTI (Stocks)",
      rsi: vtiRSI,
      conservative: getAllocationRange(vtiRSI, vtiTarget, "conservative"),
      moderate: getAllocationRange(vtiRSI, vtiTarget, "moderate"),
      aggressive: getAllocationRange(vtiRSI, vtiTarget, "aggressive"),
    },
    {
      asset: "GLD (Gold)",
      rsi: gldRSI,
      conservative: getAllocationRange(gldRSI, gldTarget, "conservative"),
      moderate: getAllocationRange(gldRSI, gldTarget, "moderate"),
      aggressive: getAllocationRange(gldRSI, gldTarget, "aggressive"),
    },
    {
      asset: "IBIT (Bitcoin)",
      rsi: ibitRSI,
      conservative: getAllocationRange(ibitRSI, ibitTarget, "conservative"),
      moderate: getAllocationRange(ibitRSI, ibitTarget, "moderate"),
      aggressive: getAllocationRange(ibitRSI, ibitTarget, "aggressive"),
    },
  ];

  // Calculate cash (what's left after RSI-adjusted equity positions)
  const conservativeCash =
    100 - results.reduce((sum, r) => sum + r.conservative, 0);
  const moderateCash = 100 - results.reduce((sum, r) => sum + r.moderate, 0);
  const aggressiveCash =
    100 - results.reduce((sum, r) => sum + r.aggressive, 0);

  // Build results table
  const resultsDiv = document.getElementById("ira-results");
  resultsDiv.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Asset</th>
          <th>Current RSI</th>
          <th>Conservative</th>
          <th>Moderate</th>
          <th>Aggressive</th>
        </tr>
      </thead>
      <tbody>
        ${results
          .map(
            (r) => `
          <tr>
            <td class="asset-name">${r.asset}</td>
            <td class="rsi-value">${r.rsi}</td>
            <td>${r.conservative}%</td>
            <td>${r.moderate}%</td>
            <td>${r.aggressive}%</td>
          </tr>
        `
          )
          .join("")}
        <tr>
          <td class="asset-name">Cash</td>
          <td>-</td>
          <td>${conservativeCash}%</td>
          <td>${moderateCash}%</td>
          <td>${aggressiveCash}%</td>
        </tr>
        <tr class="note-row">
          <td colspan="5">💡 Cash position adjusts automatically based on market valuations. ⚠️ Bitcoin is highly volatile - use partial trimming. Choose the profile that matches your risk tolerance.</td>
        </tr>
      </tbody>
    </table>
  `;
  resultsDiv.classList.add("show");

  // Scroll to results
  resultsDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function calculateTaxableAllocations() {
  // Get user inputs
  const gldTarget =
    parseInt(document.getElementById("taxable-gld-target").value) || 0;
  const ibitTarget =
    parseInt(document.getElementById("taxable-ibit-target").value) || 0;

  const total = gldTarget + ibitTarget;

  // Validate total is reasonable (50-100% equity)
  if (total < 50 || total > 100) {
    alert(
      "Your equity allocations should be between 50-100%. Currently: " +
        total +
        "%"
    );
    return;
  }

  // Get RSI values
  const gldRSI = parseInt(document.getElementById("taxable-gld-rsi").value);
  const ibitRSI = parseInt(document.getElementById("taxable-ibit-rsi").value);

  // Validate RSI inputs
  if (isNaN(gldRSI) || isNaN(ibitRSI)) {
    alert("Please enter RSI values for all assets before calculating.");
    return;
  }

  if (gldRSI < 0 || gldRSI > 100 || ibitRSI < 0 || ibitRSI > 100) {
    alert("RSI values must be between 0 and 100.");
    return;
  }

  // Calculate allocations for all three profiles
  const results = [
    {
      asset: "GLD (Gold)",
      rsi: gldRSI,
      conservative: getAllocationRange(gldRSI, gldTarget, "conservative"),
      moderate: getAllocationRange(gldRSI, gldTarget, "moderate"),
      aggressive: getAllocationRange(gldRSI, gldTarget, "aggressive"),
    },
    {
      asset: "IBIT (Bitcoin)",
      rsi: ibitRSI,
      conservative: getAllocationRange(ibitRSI, ibitTarget, "conservative"),
      moderate: getAllocationRange(ibitRSI, ibitTarget, "moderate"),
      aggressive: getAllocationRange(ibitRSI, ibitTarget, "aggressive"),
    },
  ];

  // Calculate cash (what's left after RSI-adjusted equity positions)
  const conservativeCash =
    100 - results.reduce((sum, r) => sum + r.conservative, 0);
  const moderateCash = 100 - results.reduce((sum, r) => sum + r.moderate, 0);
  const aggressiveCash =
    100 - results.reduce((sum, r) => sum + r.aggressive, 0);

  // Build results table
  const resultsDiv = document.getElementById("taxable-results");
  resultsDiv.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Asset</th>
          <th>Current RSI</th>
          <th>Conservative</th>
          <th>Moderate</th>
          <th>Aggressive</th>
        </tr>
      </thead>
      <tbody>
        ${results
          .map(
            (r) => `
          <tr>
            <td class="asset-name">${r.asset}</td>
            <td class="rsi-value">${r.rsi}</td>
            <td>${r.conservative}%</td>
            <td>${r.moderate}%</td>
            <td>${r.aggressive}%</td>
          </tr>
        `
          )
          .join("")}
        <tr>
          <td class="asset-name">Cash</td>
          <td>-</td>
          <td>${conservativeCash}%</td>
          <td>${moderateCash}%</td>
          <td>${aggressiveCash}%</td>
        </tr>
        <tr class="note-row">
          <td colspan="5">💡 Cash position adjusts automatically based on market valuations. ⚠️ Remember: Selling in taxable accounts triggers capital gains taxes. Use strategic DCA (adjust contributions) rather than frequent rebalancing.</td>
        </tr>
      </tbody>
    </table>
  `;
  resultsDiv.classList.add("show");

  // Scroll to results
  resultsDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
}