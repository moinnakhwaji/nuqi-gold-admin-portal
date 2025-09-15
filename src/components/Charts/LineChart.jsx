import React from "react";
import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  LineSeries,
  DateTime,
  Legend,
  Tooltip,
} from "@syncfusion/ej2-react-charts";

// Sample data for line chart
const lineCustomSeries = [
  {
    dataSource: [
      { x: new Date(2005, 0, 1), y: 21 },
      { x: new Date(2006, 0, 1), y: 24 },
      { x: new Date(2007, 0, 1), y: 36 },
      { x: new Date(2008, 0, 1), y: 38 },
      { x: new Date(2009, 0, 1), y: 54 },
      { x: new Date(2010, 0, 1), y: 57 },
      { x: new Date(2011, 0, 1), y: 70 },
    ],
    xName: "x",
    yName: "y",
    name: "Germany",
    width: "2",
    marker: { visible: true, width: 10, height: 10 },
    type: "Line",
  },
  {
    dataSource: [
      { x: new Date(2005, 0, 1), y: 28 },
      { x: new Date(2006, 0, 1), y: 44 },
      { x: new Date(2007, 0, 1), y: 48 },
      { x: new Date(2008, 0, 1), y: 50 },
      { x: new Date(2009, 0, 1), y: 66 },
      { x: new Date(2010, 0, 1), y: 78 },
      { x: new Date(2011, 0, 1), y: 84 },
    ],
    xName: "x",
    yName: "y",
    name: "England",
    width: "2",
    marker: { visible: true, width: 10, height: 10 },
    type: "Line",
  },
];

const LinePrimaryXAxis = {
  valueType: "DateTime",
  labelFormat: "y",
  intervalType: "Years",
  edgeLabelPlacement: "Shift",
  majorGridLines: { width: 0 },
  background: "white",
  labelStyle: { color: "#374151" }, // Gray-700 for better readability
};

const LinePrimaryYAxis = {
  labelFormat: "{value}%",
  edgeLabelPlacement: "Shift",
  majorTickLines: { width: 0 },
  lineStyle: { width: 0 },
  majorGridLines: { width: 1, color: "#f3f4f6" }, // Light gray grid lines
  background: "white",
  labelStyle: { color: "#374151" }, // Gray-700 for better readability
};

const LineChart = () => {
  return (
    <ChartComponent
      id="line-chart"
      height="420px"
      primaryXAxis={LinePrimaryXAxis}
      primaryYAxis={LinePrimaryYAxis}
      chartArea={{ 
        border: { width: 0 },
        background: "white" 
      }}
      tooltip={{ 
        enable: true,
        fill: "#374151",
        textStyle: { color: "#ffffff" },
        border: { width: 1, color: "#d1d5db" }
      }}
      background="white"
      legendSettings={{
        background: "white",
        textStyle: { color: "#374151" },
        border: { width: 0 }
      }}
    >
      <Inject services={[LineSeries, DateTime, Legend, Tooltip]} />
      <SeriesCollectionDirective>
        {lineCustomSeries.map((item, index) => (
          <SeriesDirective
            key={index}
            dataSource={item.dataSource}
            xName={item.xName}
            yName={item.yName}
            name={item.name}
            width={item.width}
            marker={item.marker}
            type={item.type}
          />
        ))}
      </SeriesCollectionDirective>
    </ChartComponent>
  );
};

export default LineChart;