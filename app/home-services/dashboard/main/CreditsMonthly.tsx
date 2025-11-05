"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { MoreVertical } from "lucide-react";
import { useState, useMemo } from "react";

import { DropdownItem } from "@/components/ui/dropdownitems";
import { Dropdown } from "@/components/ui/dropdown";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Updated raw data: money spent vs leads received
const rawData = [
  {
    service: "Plumbing",
    year: "2025",
    spent: [120, 150, 90, 200, 180, 160, 210, 130, 170, 190, 140, 110],
    leads: [5, 5, 3, 7, 6, 10, 5, 4, 5, 6, 5, 3],
  },
  {
    service: "Cleaning",
    year: "2025",
    spent: [100, 120, 80, 150, 160, 140, 180, 110, 130, 170, 120, 90],
    leads: [5, 6, 4, 8, 8, 7, 9, 5, 5, 7, 6, 5],
  },
  {
    service: "Electrician",
    year: "2025",
    spent: [90, 110, 70, 130, 140, 120, 160, 100, 120, 150, 110, 80],
    leads: [5, 4, 8, 5, 8, 5, 8, 2, 8, 7, 5, 8],
  },
];

export default function MonthlySpentLeadsChart() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("All Services");
  const [selectedMonth, setSelectedMonth] = useState("All Months");
  const [selectedYear, setSelectedYear] = useState("2025");

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }
  function closeDropdown() {
    setIsOpen(false);
  }

  const options: ApexOptions = {
    chart: {
      type: "bar",
      stacked: false,
      toolbar: { show: false },
      fontFamily: "Inter, sans-serif",
      animations: { enabled: true },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 6,
      },
    },
    colors: ["#0077B6", "#FFB703"], // blue for money, yellow for leads
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    xaxis: {
      categories: MONTHS,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: [
      {
        title: { text: "Money Spent ($)" },
      },
      {
        opposite: true,
        title: { text: "Leads (#)" },
      },
    ],
    legend: {
      position: "top",
      horizontalAlign: "center",
      fontFamily: "Inter, sans-serif",
      markers: {
        size: 10, // sets the size of legend marker
        shape: "circle", // can be "circle", "square", "rect"
      },
    },

    grid: { yaxis: { lines: { show: true } } },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val: number, opts) => {
          return opts.seriesIndex === 0 ? `$${val}` : `${val} Leads`;
        },
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: { plotOptions: { bar: { columnWidth: "55%" } } },
      },
      {
        breakpoint: 768,
        options: {
          plotOptions: { bar: { columnWidth: "65%" } },
          legend: { fontSize: "12px" },
        },
      },
      {
        breakpoint: 480,
        options: {
          plotOptions: { bar: { columnWidth: "85%" } },
          legend: { fontSize: "10px", position: "bottom" },
        },
      },
    ],
  };

  const filteredSeries = useMemo(() => {
    let filteredData = rawData;

    if (selectedService !== "All Services") {
      filteredData = filteredData.filter(d => d.service === selectedService);
    }

    if (selectedYear !== "All Years") {
      filteredData = filteredData.filter(d => d.year === selectedYear);
    }

    let spent = new Array(12).fill(0);
    let leads = new Array(12).fill(0);

    filteredData.forEach(d => {
      d.spent.forEach((val, idx) => { spent[idx] += val });
      d.leads.forEach((val, idx) => { leads[idx] += val });
    });

    if (selectedMonth !== "All Months") {
      const monthIndex = MONTHS.indexOf(selectedMonth);
      spent = spent.map((v, idx) => (idx === monthIndex ? v : 0));
      leads = leads.map((v, idx) => (idx === monthIndex ? v : 0));
    }

    return [
      { name: "Money Spent ($)", type: "column", data: spent },
      { name: "Leads (#)", type: "line", data: leads },
    ];
  }, [selectedService, selectedMonth, selectedYear]);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 sm:px-6 sm:pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Monthly Spending & Leads
        </h3>

        <div className="relative inline-block">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <MoreVertical className="text-gray-400 hover:text-gray-700" />
          </button>
          <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700"
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-3 mb-4 sm:grid-cols-2 lg:grid-cols-3">
        <Select value={selectedService} onValueChange={setSelectedService}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Services">All Services</SelectItem>
            <SelectItem value="Plumbing">Plumbing</SelectItem>
            <SelectItem value="Cleaning">Cleaning</SelectItem>
            <SelectItem value="Electrician">Electrician</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Months">All Months</SelectItem>
            {MONTHS.map(month => (
              <SelectItem key={month} value={month}>{month}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2025">2025</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Chart */}
      <div className="w-full">
        <ReactApexChart
          options={options}
          series={filteredSeries}
          type="line"
          height={320}
        />
      </div>
    </div>
  );
}
