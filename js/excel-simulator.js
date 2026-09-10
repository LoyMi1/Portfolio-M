/**
 * Miels Flores Portfolio - Live Excel Lab & Interactive Dashboard Simulator
 * Demonstrates real-time spreadsheet computation, lookup logic, and KPI aggregation
 */

(function () {
  let currentDatasetKey = "sales";
  let activeFilters = {
    region: "All Regions",
    quarter: "All Quarters",
    category: "All Categories",
    status: "All Statuses"
  };
  let selectedCell = { col: 1, row: 1, text: "", formula: "" };

  const container = document.getElementById("excel-simulator-container");
  if (!container) return;

  function formatCurrency(num) {
    return "$" + Number(num).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  function formatDecimal(num) {
    return Number(num).toFixed(2);
  }

  function formatPercent(num) {
    if (typeof num === "string" && num.includes("%")) return num;
    return (Number(num) * 100).toFixed(1) + "%";
  }

  function getColLetter(index) {
    return String.fromCharCode(65 + index);
  }

  function getFilteredRows() {
    const data = excelSimulatorData[currentDatasetKey];
    if (!data) return [];

    return data.rows.filter(row => {
      if (currentDatasetKey === "sales") {
        const regionMatch = activeFilters.region === "All Regions" || row[2] === activeFilters.region;
        const qtrMatch = activeFilters.quarter === "All Quarters" || row[3] === activeFilters.quarter;
        return regionMatch && qtrMatch;
      } else if (currentDatasetKey === "academic") {
        const catMatch = activeFilters.category === "All Categories" || row[2] === activeFilters.category;
        return catMatch;
      } else if (currentDatasetKey === "inventory") {
        const catMatch = activeFilters.category === "All Categories" || row[2] === activeFilters.category;
        const statusMatch = activeFilters.status === "All Statuses" || row[8] === activeFilters.status;
        return catMatch && statusMatch;
      }
      return true;
    });
  }

  function computeMetrics(filteredRows) {
    if (currentDatasetKey === "sales") {
      if (filteredRows.length === 0) {
        return { totalRev: "$0", totalComm: "$0", avgMargin: "0.0%", topRep: "N/A" };
      }
      const totalRev = filteredRows.reduce((acc, r) => acc + (Number(r[5]) || 0), 0);
      const totalComm = filteredRows.reduce((acc, r) => acc + (Number(r[7]) || 0), 0);
      
      const marginSum = filteredRows.reduce((acc, r) => {
        const m = parseFloat(String(r[6]).replace("%", "")) || 0;
        return acc + m;
      }, 0);
      const avgMargin = (marginSum / filteredRows.length).toFixed(1) + "%";

      const repTotals = {};
      filteredRows.forEach(r => {
        const rep = r[1];
        repTotals[rep] = (repTotals[rep] || 0) + (Number(r[5]) || 0);
      });
      let topRep = "None";
      let maxRev = -1;
      for (const [rep, rev] of Object.entries(repTotals)) {
        if (rev > maxRev) {
          maxRev = rev;
          topRep = rep;
        }
      }

      return {
        totalRev: formatCurrency(totalRev),
        totalComm: formatCurrency(totalComm),
        avgMargin: avgMargin,
        topRep: topRep
      };
    } else if (currentDatasetKey === "academic") {
      if (filteredRows.length === 0) {
        return { gpa: "0.00", totalUnits: 0, topGrade: "N/A", academicStanding: "N/A" };
      }
      let sumProduct = 0;
      let sumUnits = 0;
      let bestGrade = 5.0;
      let bestSubject = "N/A";

      filteredRows.forEach(r => {
        const units = Number(r[3]) || 0;
        const gp = Number(r[6]) || 0;
        sumProduct += units * gp;
        sumUnits += units;
        if (gp < bestGrade) { // in Philippine 1.0 - 5.0 scale, 1.0 is highest
          bestGrade = gp;
          bestSubject = `${r[0]} (${gp.toFixed(2)})`;
        }
      });

      const gpa = sumUnits > 0 ? (sumProduct / sumUnits).toFixed(2) : "0.00";
      let standing = "Good Standing";
      if (Number(gpa) <= 1.25) standing = "President's List (Honors)";
      else if (Number(gpa) <= 1.50) standing = "Dean's List (Distinction)";

      return {
        gpa: gpa,
        totalUnits: sumUnits,
        topGrade: bestSubject,
        academicStanding: standing
      };
    } else if (currentDatasetKey === "inventory") {
      if (filteredRows.length === 0) {
        return { totalValuation: "$0", reorderAlerts: 0, stockHealth: "0%", totalInStock: 0 };
      }
      let totalVal = 0;
      let reorderCount = 0;
      let totalStock = 0;

      filteredRows.forEach(r => {
        const inStock = Number(r[3]) || 0;
        const val = Number(r[7]) || (inStock * Number(r[6]));
        totalVal += val;
        totalStock += inStock;
        if (r[8] === "REORDER NOW") reorderCount++;
      });

      const optimalRate = (((filteredRows.length - reorderCount) / filteredRows.length) * 100).toFixed(0) + "%";

      return {
        totalValuation: formatCurrency(totalVal),
        reorderAlerts: reorderCount,
        stockHealth: optimalRate,
        totalInStock: totalStock
      };
    }
  }

  function render() {
    const dataset = excelSimulatorData[currentDatasetKey];
    const filteredRows = getFilteredRows();
    const metrics = computeMetrics(filteredRows);

    let html = `
      <div class="excel-sim-wrapper">
        <!-- Excel Window Title Bar -->
        <div class="excel-window-bar">
          <div class="excel-window-dots">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>
          <div class="excel-window-title">
            <svg class="excel-icon-svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#38bdf8"/>
              <polyline points="14 2 14 8 20 8" stroke="#38bdf8"/>
              <line x1="8" y1="13" x2="16" y2="13" stroke="#8b5cf6"/>
              <line x1="8" y1="17" x2="16" y2="17" stroke="#8b5cf6"/>
              <polyline points="10 9 9 9 8 9" stroke="#8b5cf6"/>
            </svg>
            <span class="excel-title-text">${dataset.title}</span>
            <span class="excel-mode-pill">Interactive Live Demo</span>
          </div>
          <div class="excel-window-actions">
            <button type="button" class="excel-reset-btn" id="sim-reset-btn" title="Reset All Filters">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
              <span>Reset</span>
            </button>
          </div>
        </div>

        <!-- Sheet Tabs (Top/Subheader) -->
        <div class="excel-tabs-bar">
          <div class="excel-tabs-group">
            <button class="excel-tab ${currentDatasetKey === 'sales' ? 'active' : ''}" data-sheet="sales">
              <span class="excel-tab-indicator"></span>
              <span class="excel-tab-title">My Clients</span>
            </button>
            <button class="excel-tab ${currentDatasetKey === 'academic' ? 'active' : ''}" data-sheet="academic">
              <span class="excel-tab-indicator"></span>
              <span class="excel-tab-title">Academic GPA Matrix</span>
            </button>
            <button class="excel-tab ${currentDatasetKey === 'inventory' ? 'active' : ''}" data-sheet="inventory">
              <span class="excel-tab-indicator"></span>
              <span class="excel-tab-title">Project Tracker</span>
            </button>
          </div>
        </div>

        <!-- Excel Formula Bar -->
        <div class="excel-formula-bar">
          <div class="excel-name-box" id="sim-cell-coord">
            ${selectedCell.coord || "fx D4"}
          </div>
          <div class="excel-fx-label">fx</div>
          <div class="excel-formula-input" id="sim-formula-display">
            ${selectedCell.formula || dataset.formula}
          </div>
        </div>

        <!-- Live Interactive Slicers / Filters -->
        <div class="excel-filters-bar">
          <div class="filter-label">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            <span>Interactive Slicers:</span>
          </div>
          <div class="filter-controls-group">
    `;

    if (currentDatasetKey === "sales") {
      html += `
        <div class="filter-select-wrapper">
          <label for="filter-region">Region:</label>
          <select id="filter-region" class="excel-select">
            ${dataset.filterOptions.regions.map(r => `<option value="${r}" ${activeFilters.region === r ? 'selected' : ''}>${r}</option>`).join('')}
          </select>
        </div>
        <div class="filter-select-wrapper">
          <label for="filter-quarter">Quarter:</label>
          <select id="filter-quarter" class="excel-select">
            ${dataset.filterOptions.quarters.map(q => `<option value="${q}" ${activeFilters.quarter === q ? 'selected' : ''}>${q}</option>`).join('')}
          </select>
        </div>
      `;
    } else if (currentDatasetKey === "academic") {
      html += `
        <div class="filter-select-wrapper">
          <label for="filter-cat">Course Category:</label>
          <select id="filter-cat" class="excel-select">
            ${dataset.filterOptions.categories.map(c => `<option value="${c}" ${activeFilters.category === c ? 'selected' : ''}>${c}</option>`).join('')}
          </select>
        </div>
      `;
    } else if (currentDatasetKey === "inventory") {
      html += `
        <div class="filter-select-wrapper">
          <label for="filter-inv-cat">Category:</label>
          <select id="filter-inv-cat" class="excel-select">
            ${dataset.filterOptions.categories.map(c => `<option value="${c}" ${activeFilters.category === c ? 'selected' : ''}>${c}</option>`).join('')}
          </select>
        </div>
        <div class="filter-select-wrapper">
          <label for="filter-inv-status">Status Alert:</label>
          <select id="filter-inv-status" class="excel-select">
            ${dataset.filterOptions.statuses.map(s => `<option value="${s}" ${activeFilters.status === s ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </div>
      `;
    }

    html += `
            <div class="filter-count-badge">
              <span>Showing ${filteredRows.length} of ${dataset.rows.length} records</span>
            </div>
          </div>
        </div>

        <!-- Calculated Summary KPI Cluster (Horizontal Gradient Cards) -->
        <div class="excel-kpi-grid">
    `;

    dataset.summaryCards.forEach(card => {
      const val = metrics[card.key];
      html += `
        <div class="excel-kpi-card">
          <div class="kpi-label">${card.label}</div>
          <div class="kpi-value ${card.key === 'reorderAlerts' && val > 0 ? 'alert-danger' : ''}">${val}</div>
          <div class="kpi-accent-bar"></div>
        </div>
      `;
    });

    html += `
        </div>

        <!-- Spreadsheet Grid Table -->
        <div class="excel-table-scroll-container">
          <table class="excel-grid-table">
            <thead>
              <tr class="excel-col-coords-row">
                <th class="excel-corner-cell">#</th>
                ${dataset.headers.map((h, i) => `<th class="excel-col-header" data-col="${i}">${getColLetter(i)}<span class="col-title">${h}</span></th>`).join('')}
              </tr>
            </thead>
            <tbody>
    `;

    if (filteredRows.length === 0) {
      html += `
        <tr>
          <td colspan="${dataset.headers.length + 1}" class="excel-empty-state">
            No rows match the current slicer criteria. Try resetting or selecting "All".
          </td>
        </tr>
      `;
    } else {
      filteredRows.forEach((row, rowIndex) => {
        html += `<tr class="excel-data-row">`;
        html += `<td class="excel-row-num">${rowIndex + 1}</td>`;
        row.forEach((val, colIndex) => {
          let cellClass = "excel-cell";
          let cellContent = val;
          const colName = dataset.headers[colIndex];

          if (colName.includes("Revenue") || colName.includes("Commission") || colName.includes("Value") || colName.includes("Cost")) {
            cellClass += " text-right font-mono";
            cellContent = formatCurrency(val);
          } else if (colName.includes("Margin") || colName.includes("Margin (%)")) {
            cellClass += " text-right font-mono";
          } else if (colName === "Status" || colName === "Action Status") {
            cellClass += " text-center";
            if (val === "Exceeded" || val === "Optimal") {
              cellContent = `<span class="badge-status-optimal">${val}</span>`;
            } else if (val === "REORDER NOW") {
              cellContent = `<span class="badge-status-warning">${val}</span>`;
            } else {
              cellContent = `<span class="badge-status-neutral">${val}</span>`;
            }
          } else if (colName === "Grade Pt") {
            cellClass += " text-center font-mono font-bold";
            cellContent = Number(val).toFixed(2);
          } else if (colName === "Remark") {
            cellClass += " text-left";
            cellContent = `<span class="badge-status-optimal">${val}</span>`;
          }

          html += `
            <td class="${cellClass}" 
                data-row="${rowIndex + 1}" 
                data-col="${colIndex}" 
                data-coord="${getColLetter(colIndex)}${rowIndex + 1}"
                data-raw="${val}">
              ${cellContent}
            </td>
          `;
        });
        html += `</tr>`;
      });
    }

    html += `
            </tbody>
          </table>
        </div>

        <!-- Excel Bottom Status Bar -->
        <div class="excel-status-bar">
          <div class="status-left">
            <span class="status-indicator">READY</span>
            <span class="status-calc">CALC: AUTOMATIC (100%)</span>
          </div>
          <div class="status-right">
            <span class="status-tip">💡 Click any table cell to inspect formula and dynamic values</span>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
    attachEvents();
  }

  function attachEvents() {
    // Sheet tabs
    const tabs = container.querySelectorAll(".excel-tab");
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const sheet = tab.getAttribute("data-sheet");
        if (sheet && sheet !== currentDatasetKey) {
          currentDatasetKey = sheet;
          activeFilters = {
            region: "All Regions",
            quarter: "All Quarters",
            category: "All Categories",
            status: "All Statuses"
          };
          selectedCell = { coord: "fx", formula: excelSimulatorData[sheet].formula };
          render();
        }
      });
    });

    // Reset button
    const resetBtn = container.querySelector("#sim-reset-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        activeFilters = {
          region: "All Regions",
          quarter: "All Quarters",
          category: "All Categories",
          status: "All Statuses"
        };
        render();
      });
    }

    // Filter selects
    const regionSelect = container.querySelector("#filter-region");
    if (regionSelect) {
      regionSelect.addEventListener("change", (e) => {
        activeFilters.region = e.target.value;
        render();
      });
    }

    const qtrSelect = container.querySelector("#filter-quarter");
    if (qtrSelect) {
      qtrSelect.addEventListener("change", (e) => {
        activeFilters.quarter = e.target.value;
        render();
      });
    }

    const catSelect = container.querySelector("#filter-cat") || container.querySelector("#filter-inv-cat");
    if (catSelect) {
      catSelect.addEventListener("change", (e) => {
        activeFilters.category = e.target.value;
        render();
      });
    }

    const statusSelect = container.querySelector("#filter-inv-status");
    if (statusSelect) {
      statusSelect.addEventListener("change", (e) => {
        activeFilters.status = e.target.value;
        render();
      });
    }

    // Cell clicks
    const cells = container.querySelectorAll(".excel-cell");
    cells.forEach(cell => {
      cell.addEventListener("click", () => {
        cells.forEach(c => c.classList.remove("selected-cell"));
        cell.classList.add("selected-cell");

        const coord = cell.getAttribute("data-coord");
        const raw = cell.getAttribute("data-raw");
        const colIdx = parseInt(cell.getAttribute("data-col"), 10);
        const dataset = excelSimulatorData[currentDatasetKey];
        const header = dataset.headers[colIdx];

        let formulaText = raw;
        if (header.includes("Commission")) {
          formulaText = `=XLOOKUP(E${cell.dataset.row}, Targets!A:A, Rates!B:B) * Revenue`;
        } else if (header.includes("Revenue")) {
          formulaText = `=UnitsSold * UnitPrice * (1 - PromoDiscount)`;
        } else if (header.includes("Grade Pt")) {
          formulaText = `=VLOOKUP(Midterm*0.4 + Finals*0.6, GradeScale, 2, TRUE)`;
        } else if (header.includes("Action Status")) {
          formulaText = `=IF(InStock <= ReorderPoint, "REORDER NOW", "Optimal")`;
        } else if (header.includes("Inventory Value")) {
          formulaText = `=InStock * UnitCost`;
        }

        selectedCell = {
          coord: coord,
          formula: formulaText
        };

        const coordDisplay = container.querySelector("#sim-cell-coord");
        const formulaDisplay = container.querySelector("#sim-formula-display");
        if (coordDisplay) coordDisplay.textContent = coord;
        if (formulaDisplay) formulaDisplay.textContent = formulaText;
      });
    });
  }

  // Initial render when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();

