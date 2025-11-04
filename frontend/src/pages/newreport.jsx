import React, { useState, useEffect } from "react";
import { API_BASE } from "../config";

export default function NewReport() {
  const [policeStation, setPoliceStation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [report, setReport] = useState(null);
  const [stationsList, setStationsList] = useState([]);

  useEffect(() => {
    async function fetchStations() {
      try {
        const res = await fetch(`${API_BASE}/thefts-by-ps`);
        const json = await res.json();
        if (json.data) setStationsList(json.data.map((d) => d.locality));
      } catch (e) {
        console.warn("Could not fetch stations list", e);
      }
    }
    fetchStations();
  }, []);

  const handleGenerate = async () => {
    setError(null);
    setReport(null);

    if (!startDate || !endDate) return setError("Please select both start and end dates.");
    if (new Date(startDate) > new Date(endDate)) return setError("Start date cannot be after end date.");

    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (policeStation) qs.append("police_station", policeStation);
      qs.append("start_date", startDate);
      qs.append("end_date", endDate);

      const res = await fetch(`${API_BASE}/generate-report?${qs.toString()}`, {
        method: "POST",
        headers: { accept: "application/json" },
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      data.message ? setError(data.message) : setReport(data);
    } catch (e) {
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
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
  <div className="p-6 bg-gray-50 min-h-screen">
    <h1 className="text-3xl font-semibold mb-8 text-center text-indigo-700">
      Generate Bike Theft Report
    </h1>

    {/* Filters Section */}
    <div className="max-w-5xl mx-auto bg-white shadow-md rounded-xl p-6 mb-10 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Police Station</label>
          <input
            list="ps-list"
            value={policeStation}
            onChange={(e) => setPoliceStation(e.target.value)}
            placeholder="Type or select"
            className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-indigo-500"
          />
          <datalist id="ps-list">
            {stationsList.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="mt-5 flex justify-center gap-4">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          {loading ? "Generating..." : "Generate Report"}
        </button>
        <button
          onClick={() => {
            setPoliceStation("");
            setStartDate("");
            setEndDate("");
            setReport(null);
            setError(null);
          }}
          className="px-6 py-2 border rounded-lg hover:bg-gray-100 transition"
        >
          Reset
        </button>
      </div>

      {error && <p className="text-red-600 mt-3 text-center">{error}</p>}
    </div>

    {/* Report Display */}
    {report && (
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-6 border-b pb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{report.Report_Title || "Bike Theft Analysis Report"}</h2>
          <p className="text-gray-600 text-sm mb-1">
            <span className="font-medium">Date Range:</span> {report.Date_Range}
          </p>
          <p className="text-gray-600 text-sm mb-4">
            <span className="font-medium">Generated On:</span> {report.Generated_On}
          </p>

          <button
            onClick={handleDownloadPDF}
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition shadow-sm"
          >
            Download Report
          </button>
        </div>

        {/* Summary Table */}
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider">
                  Metric
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              <tr><td className="px-6 py-4">Total Thefts</td><td className="px-6 py-4">{report.Total_Thefts}</td></tr>
              <tr><td className="px-6 py-4">Average per Day</td><td className="px-6 py-4">{report.Average_Per_Day ?? "—"}</td></tr>
              <tr><td className="px-6 py-4">Highest Theft Day</td><td className="px-6 py-4">{report.Highest_Theft_Day}</td></tr>
              <tr><td className="px-6 py-4">Most Targeted Station</td><td className="px-6 py-4">{report.Most_Targeted_Station}</td></tr>
              <tr><td className="px-6 py-4">Most Common Time</td><td className="px-6 py-4">{report.Most_Common_Time}</td></tr>
              <tr><td className="px-6 py-4">Most Stolen Bike Model</td><td className="px-6 py-4">{report.Most_Stolen_Model}</td></tr>
            </tbody>
          </table>
        </div>

        {/* Summary Text */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
          <h3 className="font-semibold text-lg text-indigo-700 mb-2">Summary</h3>
          <p className="text-gray-700 leading-relaxed">{report.Summary}</p>
        </div>
      </div>
    )}
  </div>
);
}

