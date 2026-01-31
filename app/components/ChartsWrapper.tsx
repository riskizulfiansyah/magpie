"use client";

import dynamic from "next/dynamic";

// Root Chart Components (Dynamic to prevent hydration mismatch)
export const PieChart = dynamic(() => import("recharts").then((mod) => mod.PieChart), { ssr: false });
export const BarChart = dynamic(() => import("recharts").then((mod) => mod.BarChart), { ssr: false });
export const ComposedChart = dynamic(() => import("recharts").then((mod) => mod.ComposedChart), { ssr: false });
export const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false });

// Sub Components (Direct exports to preserve identity/colors)
export {
    Pie,
    Cell,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Area,
    Line,
    CartesianGrid,
    Legend,
    Rectangle
} from "recharts";
