import React from "react";
import {
  AccumulationChartComponent,
  AccumulationSeriesCollectionDirective,
  AccumulationSeriesDirective,
  AccumulationLegend,
  PieSeries,
  AccumulationDataLabel,
  Inject,
  AccumulationTooltip,
} from "@syncfusion/ej2-react-charts";

import { useStateContext } from "../../contexts/ContextProvider";

const Doughnut = ({ id, data, legendVisiblity, height }) => {
  const { currentMode } = useStateContext();

  return (
    <AccumulationChartComponent
      id={id}
      legendSettings={{
        visible: legendVisiblity,
        background: currentMode === "Dark" ? "#1a1a1a" : "white",
        textStyle: {
          color: currentMode === "Dark" ? "#ffffff" : "#000000",
        },
      }}
      height={height}
      background={currentMode === "Dark" ? "transparent" : "#fff"}
      tooltip={{
        enable: true,
        format: "{point.x}: {point.y}",
        fill: currentMode === "Dark" ? "#1a1a1a" : "#ffffff",
        border: {
          color: currentMode === "Dark" ? "#374151" : "#e5e7eb",
          width: 1,
        },
        textStyle: {
          color: currentMode === "Dark" ? "#ffffff" : "#000000",
        },
      }}
      chartArea={{
        border: {
          width: 0,
        },
      }}
    >
      <Inject
        services={[
          AccumulationLegend,
          PieSeries,
          AccumulationDataLabel,
          AccumulationTooltip,
        ]}
      />
      <AccumulationSeriesCollectionDirective>
        <AccumulationSeriesDirective
          name="Risk Level"
          dataSource={data}
          xName="x"
          yName="y"
          innerRadius="25%"
          startAngle={90}
          endAngle={450}
          radius="85%"
          explode
          explodeOffset="15%"
          explodeIndex={0}
          palettes={[
            "rgba(0, 212, 255, 0.8)",
            "rgba(0, 255, 136, 0.8)",
            "rgba(255, 215, 0, 0.8)",
            "rgba(255, 107, 157, 0.8)",
            "rgba(139, 92, 246, 0.8)",
            "rgba(245, 158, 11, 0.8)",
          ]}
          dataLabel={{
            visible: true,
            name: "text",
            position: "Outside",
            font: {
              fontWeight: "800",
              color: "#FFFFFF",
              size: "13px",
            },
            connectorStyle: {
              type: "Curve",
              color: "rgba(255, 255, 255, 0.4)",
              width: 1.5,
            },
          }}
          border={{
            width: 2,
            color: "rgba(255, 255, 255, 0.3)",
          }}
        />
      </AccumulationSeriesCollectionDirective>
    </AccumulationChartComponent>
  );
};

export default Doughnut;
