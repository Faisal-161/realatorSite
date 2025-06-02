
import React from "react";
import {
  Bar,
  Line,
  Pie,
  PolarArea,
  Radar,
  Doughnut,
  Scatter,
  Bubble,
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

// Define chart options and styling
const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        padding: 20,
        usePointStyle: true,
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      padding: 12,
      titleFont: {
        size: 14,
      },
      bodyFont: {
        size: 13,
      },
      cornerRadius: 6,
      displayColors: true,
    },
  },
  animation: {
    duration: 1500,
    easing: "easeOutQuart",
  },
};

// Create gradient colors for charts
const createGradient = (ctx: CanvasRenderingContext2D, color1: string, color2: string) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  return gradient;
};

export const LineChart = ({ data, options = {} }: { data: any; options?: any }) => {
  return (
    <div className="w-full h-full min-h-[300px]">
      <Line data={data} options={{ ...defaultOptions, ...options }} />
    </div>
  );
};

export const BarChart = ({ data, options = {} }: { data: any; options?: any }) => {
  return (
    <div className="w-full h-full min-h-[300px]">
      <Bar data={data} options={{ ...defaultOptions, ...options }} />
    </div>
  );
};

export const PieChart = ({ data, options = {} }: { data: any; options?: any }) => {
  return (
    <div className="w-full h-full min-h-[300px]">
      <Pie data={data} options={{ ...defaultOptions, ...options }} />
    </div>
  );
};

export const DoughnutChart = ({ data, options = {} }: { data: any; options?: any }) => {
  return (
    <div className="w-full h-full min-h-[300px]">
      <Doughnut data={data} options={{ ...defaultOptions, ...options }} />
    </div>
  );
};

// Utility function to create chart data with custom styling
export const createChartData = (
  labels: string[],
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string | string[];
    borderWidth?: number;
    tension?: number;
    [key: string]: any;
  }[]
) => {
  return {
    labels,
    datasets: datasets.map((dataset) => ({
      borderWidth: 2,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
      ...dataset,
    })),
  };
};

// Color Schemes for consistent styling
export const chartColors = {
  primary: {
    base: "#0ea5e9",
    light: "rgba(14, 165, 233, 0.2)",
    gradient: ["rgba(14, 165, 233, 0.8)", "rgba(14, 165, 233, 0.2)"],
  },
  secondary: {
    base: "#8b5cf6",
    light: "rgba(139, 92, 246, 0.2)",
    gradient: ["rgba(139, 92, 246, 0.8)", "rgba(139, 92, 246, 0.2)"],
  },
  success: {
    base: "#10b981",
    light: "rgba(16, 185, 129, 0.2)",
    gradient: ["rgba(16, 185, 129, 0.8)", "rgba(16, 185, 129, 0.2)"],
  },
  warning: {
    base: "#f59e0b",
    light: "rgba(245, 158, 11, 0.2)",
    gradient: ["rgba(245, 158, 11, 0.8)", "rgba(245, 158, 11, 0.2)"],
  },
  danger: {
    base: "#ef4444",
    light: "rgba(239, 68, 68, 0.2)",
    gradient: ["rgba(239, 68, 68, 0.8)", "rgba(239, 68, 68, 0.2)"],
  },
  // Estate brand colors
  estate: {
    base: "#0284c7",
    light: "rgba(2, 132, 199, 0.2)",
    gradient: ["rgba(2, 132, 199, 0.8)", "rgba(2, 132, 199, 0.2)"],
  },
  // Additional color schemes
  palette: [
    "#0284c7",
    "#8b5cf6", 
    "#10b981", 
    "#f59e0b", 
    "#ef4444",
    "#06b6d4",
    "#ec4899",
    "#6366f1"
  ],
};
