import React, { useState, useEffect } from "react";
import { API_BASE } from "../config";

/**
 * Reports page
 * - Filter: police station (text or select), start_date, end_date
 * - Generate -> POST /api/generate-report?police_station=...&start_date=...&end_date=...
 * - Display header, summary table, paragraph, and Download PDF button (placeholder)
 */

export default function NewReport() {
  const [policeStation, setPoliceStation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [report, setReport] = useState(null);
  const [stationsList, setStationsList] = useState([]);

  // Optional: fetch list of police stations for the dropdown
  useEffect(() => {
    async function fetchStations() {
      try {
        const res = await fetch(`${API_BASE}/thefts-by-ps`);
        const json = await res.json();
        if (json.data) {
          // json.data is [{locality, count}, ...]
          setStationsList(json.data.map((d) => d.locality));
        }
      } catch (e) {
        // silently ignore (we'll allow free text input)
        console.warn("Could not fetch stations list", e);
      }
    }
    fetchStations();
  }, []);

  const handleGenerate = async () => {
    setError(null);
    setReport(null);

    if (!startDate || !endDate) {
      setError("Please select both start date and end date.");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError("Start date cannot be after end date.");
      return;
    }

    setLoading(true);
    try {
      // Build query string (backend expects POST with query params)
      const qs = new URLSearchParams();
      if (policeStation) qs.append("police_station", policeStation);
      qs.append("start_date", startDate);
      qs.append("end_date", endDate);

      const url = `${API_BASE}/generate-report?${qs.toString()}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { accept: "application/json" },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error: ${res.status} ${text}`);
      }
      const data = await res.json();

      if (data.message) {
        setError(data.message);
        setReport(null);
      } else {
        setReport(data);
      }
    } catch (e) {
      console.error(e);
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    // Placeholder: we'll implement real PDF generation later.
    // For now, allow user to download JSON as a file to test.
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report_${report.Date_Range ? report.Date_Range.replace(/\s+/g, "_") : Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Generate Report</h1>

      {/* Filters */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Police Station</label>
            <div className="mt-1">
              <input
                list="ps-list"
                value={policeStation}
                onChange={(e) => setPoliceStation(e.target.value)}
                placeholder="Type or select police station"
                className="w-full border rounded p-2"
              />
              <datalist id="ps-list">
                {stationsList.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border rounded p-2 mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border rounded p-2 mt-1"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleGenerate}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Report"}
          </button>

          <button
            onClick={() => { setPoliceStation(""); setStartDate(""); setEndDate(""); setReport(null); setError(null); }}
            className="px-4 py-2 border rounded"
          >
            Reset
          </button>
        </div>

        {error && <p className="text-red-600 mt-3">{error}</p>}
      </div>

      {/* Report Display */}
      {report && (
        <div className="bg-white shadow rounded p-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">{report.Report_Title || "Bike Theft Analysis Report"}</h2>
              <p className="text-sm text-gray-600">
                Date Range: <span className="font-medium">{report.Date_Range}</span>
              </p>
              <p className="text-sm text-gray-600">Generated On: {report.Generated_On}</p>
            </div>

            <div className="mt-3 md:mt-0">
              <button
                onClick={handleDownloadPDF}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Download (JSON placeholder)
              </button>
            </div>
          </div>

          {/* Summary Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 mb-4">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Total Thefts</td>
                  <td className="px-6 py-4 whitespace-nowrap">{report.Total_Thefts}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Average per Day</td>
                  <td className="px-6 py-4 whitespace-nowrap">{report.Average_Per_Day ?? report.Average_per_day ?? report.AveragePerDay ?? "—"}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Highest Theft Day</td>
                  <td className="px-6 py-4 whitespace-nowrap">{report.Highest_Theft_Day}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Most Targeted Police Station</td>
                  <td className="px-6 py-4 whitespace-nowrap">{report.Most_Targeted_Station}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Most Common Time</td>
                  <td className="px-6 py-4 whitespace-nowrap">{report.Most_Common_Time}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Most Stolen Bike Model</td>
                  <td className="px-6 py-4 whitespace-nowrap">{report.Most_Stolen_Model}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Text Summary */}
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Summary</h3>
            <p className="text-gray-700">{report.Summary}</p>
          </div>
        </div>
      )}
    </div>
  );
}
