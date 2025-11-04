import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";

const TheftByCompanyChart = ({ filters }) => {
  const [activeTab, setActiveTab] = useState("compare");

  const buildQueryString = () => {
    const params = new URLSearchParams();
    if (filters.localities?.length > 0)
      params.append("localities", filters.localities.join(","));
    if (filters.places?.length > 0)
      params.append("places", filters.places.join(","));
    if (filters.company) params.append("company", filters.company);
    if (filters.categories?.length > 0)
      params.append("categories", filters.categories.join(","));
    if (filters.timeOfDay && filters.timeOfDay !== "All")
      params.append("time_of_day", filters.timeOfDay);
    if (filters.days?.length > 0) params.append("days", filters.days.join(","));
    if (filters.spotTypes?.length > 0)
      params.append("spot_types", filters.spotTypes.join(","));
    return params.toString();
  };

  useEffect(() => {
    const queryString = buildQueryString();

     
    const endpoint =
      activeTab === "compare"
        ? "http://127.0.0.1:8000/api/thefts-company"
        : "http://127.0.0.1:8000/api/most-model";

    fetch(`${endpoint}?${queryString}`)
      .then((res) => res.json())
      .then((response) => {
        
        const chartData =
          response.data?.map((item) => ({
            name: activeTab === "compare" ? item.company : item.model,
            y: item.count,
          })) || [];

     
        (function (H) {
  H.seriesTypes.pie.prototype.animate = function (init) {
    const series = this,
      chart = series.chart,
      points = series.points,
      { animation } = series.options,
      { startAngleRad } = series;

    function fanAnimate(point, startAngleRad) {
      const graphic = point.graphic,
        args = point.shapeArgs;
      if (graphic && args) {
        graphic
          .attr({
            start: startAngleRad,
            end: startAngleRad,
            opacity: 1,
          })
          .animate(
            { start: args.start, end: args.end },
            { duration: animation.duration / points.length },
            function () {
              if (points[point.index + 1]) {
                fanAnimate(points[point.index + 1], args.end);
              }
              if (point.index === series.points.length - 1) {
                series.dataLabelsGroup.animate({ opacity: 1 }, undefined, function () {
                  points.forEach((p) => (p.opacity = 1));
                  series.update({ enableMouseTracking: true }, false);
                  chart.update({
                    plotOptions: {
                      pie: { innerSize: "40%", borderRadius: 8 },
                    },
                  });
                });
              }
            }
          );
      }
    }

    if (init) {
      points.forEach((point) => (point.opacity = 0));
    } else {
      fanAnimate(points[0], startAngleRad);
    }
  };
})(Highcharts);

 
Highcharts.chart("theft-chart-container", {
  chart: {
    type: "pie",
    backgroundColor: "transparent",
  },
  title: { text: "" },  
  tooltip: {
    headerFormat: "",
    pointFormat:
      '<span style="color:{point.color}">●</span> {point.name}: <b>{point.percentage:.1f}%</b>',
  },
  credits: {
    enabled: false
  },
  legend: { enabled: false },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      borderWidth: 2,
      cursor: "pointer",
      size: '70%',
      innerSize: '40%',
      dataLabels: {
        enabled: true,
        format: "<b>{point.name}</b><br>{point.percentage:.1f}%",
        distance: 5,
      },
    },
  },
  series: [
    {
      enableMouseTracking: false,
      animation: { duration: 2000 },
      colorByPoint: true,
      data: chartData,
    },
  ],
});
      })
      .catch((err) => console.error("Error fetching chart data:", err));
  }, [filters, activeTab]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="font-semibold text-lg mb-4">Thefts Analysis</h3>

      {/* Tabs */}
      <div className="mb-4 flex border-b">
        {["compare", "daynight"].map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 text-sm font-medium rounded-t-md ${
              activeTab === tab
                ? "text-white bg-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "compare" ? "By Company" : "By Model"}
          </button>
        ))}
      </div>

      {/* Chart Container */}
      <div id="theft-chart-container" style={{ height: "400" }}></div>
    </div>
  );
};

export default TheftByCompanyChart;
