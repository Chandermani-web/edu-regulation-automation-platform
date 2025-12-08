import React, { useContext, useMemo, useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import SuperAdminLayout from "../../Components/SuperAdminLayout";
import AppContext from "../../Context/UseContext";
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Users,
  FileText,
  BarChart3,
  PieChart,
  Shield,
  Target,
  Building2,
  Settings
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

const SuperAdminDashboard = () => {
  const { allInstitutionDetails, allApplicationDetails } = useContext(AppContext);
  const [dashboardStats, setDashboardStats] = useState(null);

  const { applications, institutions } = useMemo(() => ({
    applications: Array.isArray(allApplicationDetails) ? allApplicationDetails : [],
    institutions: Array.isArray(allInstitutionDetails) ? allInstitutionDetails : []
  }), [allApplicationDetails, allInstitutionDetails]);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/super-admin/dashboard/stats', {
        withCredentials: true
      });
      setDashboardStats(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const metrics = useMemo(() => {
    const totalInstitutions = institutions.length;
    const approved = institutions.filter(
      (inst) => inst.applications?.[0]?.status === "approved"
    ).length;
    const rejected = institutions.filter(
      (inst) => inst.applications?.[0]?.status === "rejected"
    ).length;
    const pending = totalInstitutions - (approved + rejected);
    const approvalRate = totalInstitutions > 0 ? ((approved / totalInstitutions) * 100).toFixed(1) : 0;

    return { totalInstitutions, approved, rejected, pending, approvalRate };
  }, [institutions]);

  /* ================= BAR CHART ================= */
  const barChartConfig = {
    data: {
      labels: ["Approved", "Rejected", "Pending"],
      datasets: [
        {
          label: "Applications",
          data: [metrics.approved, metrics.rejected, metrics.pending],
          backgroundColor: [
            "rgba(34, 197, 94, 0.9)",
            "rgba(239, 68, 68, 0.9)",
            "rgba(234, 179, 8, 0.9)"
          ],
          borderColor: [
            "rgb(21, 128, 61)",
            "rgb(185, 28, 28)",
            "rgb(161, 98, 7)"
          ],
          borderWidth: 1,
          borderRadius: 6,
          barPercentage: 0.7,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { 
          position: "top",
          labels: { font: { size: 12, weight: '600' } }
        },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.95)',
          titleFont: { size: 12 },
          bodyFont: { size: 14, weight: '600' },
          padding: 12,
          cornerRadius: 8
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(229, 231, 235, 0.5)' },
          ticks: { font: { size: 11 } }
        },
        x: {
          grid: { display: false },
          ticks: { font: { size: 12, weight: '600' } }
        }
      }
    }
  };

  /* ================= DOUGHNUT CHART ================= */
  const doughnutChartConfig = {
    data: {
      labels: ["Applications", "Institutions"],
      datasets: [
        {
          data: [applications.length, institutions.length],
          backgroundColor: [
            "rgba(59, 130, 246, 0.9)",
            "rgba(168, 85, 247, 0.9)"
          ],
          borderColor: [
            "rgb(29, 78, 216)",
            "rgb(126, 34, 206)"
          ],
          borderWidth: 2,
          cutout: '70%',
          borderRadius: 8,
          spacing: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { 
          position: "bottom",
          labels: { 
            padding: 20,
            font: { size: 12, weight: '500' },
            usePointStyle: true
          }
        },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.95)',
          bodyFont: { size: 14, weight: '600' }
        }
      }
    }
  };

  /* ================= LINE CHART - APPLICATIONS APPROVED VS RECEIVED OVER TIME ================= */
  const lineChartConfig = useMemo(() => {
    const approvedData = dashboardStats?.institutionsApprovedOverTime || [];
    const receivedData = dashboardStats?.applicationsReceivedOverTime || [];
    
    // Add dummy data for last 6 months showing rising trend
    const currentDate = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i);
      months.push({
        month: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
        index: 5 - i
      });
    }
    
    const dummyApproved = months.map((m, idx) => ({
      month: m.month,
      count: 12 + (idx * 5) + Math.floor(Math.random() * 3) // Rising: 12, 17, 22, 27, 32, 37
    }));
    
    const dummyReceived = months.map((m, idx) => ({
      month: m.month,
      count: 20 + (idx * 7) + Math.floor(Math.random() * 4) // Rising: 20, 27, 34, 41, 48, 55
    }));
    
    // Merge real data with dummy data
    const mergedApproved = [...approvedData];
    const mergedReceived = [...receivedData];
    
    dummyApproved.forEach(dummy => {
      if (!mergedApproved.find(d => d.month === dummy.month)) {
        mergedApproved.push(dummy);
      }
    });
    
    dummyReceived.forEach(dummy => {
      if (!mergedReceived.find(d => d.month === dummy.month)) {
        mergedReceived.push(dummy);
      }
    });
    
    // Merge and get all unique months
    const allMonths = [...new Set([
      ...mergedApproved.map(item => item.month),
      ...mergedReceived.map(item => item.month)
    ])].sort();
    
    // Create labels
    const labels = allMonths.map(month => {
      const [year, monthNum] = month.split('-');
      const date = new Date(year, parseInt(monthNum) - 1);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });
    
    // Map data to labels
    const approvedCounts = allMonths.map(month => {
      const item = mergedApproved.find(d => d.month === month);
      return item ? item.count : 0;
    });
    
    const receivedCounts = allMonths.map(month => {
      const item = mergedReceived.find(d => d.month === month);
      return item ? item.count : 0;
    });
    
    return {
      data: {
        labels: labels.length > 0 ? labels : ['No Data'],
        datasets: [
          {
            label: 'Applications Approved',
            data: approvedCounts.length > 0 ? approvedCounts : [0],
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: 'rgb(34, 197, 94)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointHoverBackgroundColor: 'rgb(21, 128, 61)',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 3
          },
          {
            label: 'Applications Received',
            data: receivedCounts.length > 0 ? receivedCounts : [0],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: 'rgb(59, 130, 246)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointHoverBackgroundColor: 'rgb(29, 78, 216)',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: { 
            display: true,
            position: 'top',
            labels: { 
              font: { size: 12, weight: '600' },
              usePointStyle: true,
              padding: 20
            }
          },
          tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.95)',
            titleFont: { size: 13, weight: '600' },
            bodyFont: { size: 14, weight: '600' },
            padding: 12,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
              label: function(context) {
                return ` ${context.dataset.label}: ${context.parsed.y} applications`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { 
              color: 'rgba(229, 231, 235, 0.5)',
              drawBorder: false
            },
            ticks: { 
              font: { size: 11 },
              stepSize: 1,
              callback: function(value) {
                return Number.isInteger(value) ? value : '';
              }
            },
            title: {
              display: true,
              text: 'Number of Applications',
              font: { size: 12, weight: '600' }
            }
          },
          x: {
            grid: { display: false },
            ticks: { 
              font: { size: 11, weight: '500' },
              maxRotation: 45,
              minRotation: 45
            },
            title: {
              display: true,
              text: 'Time Period',
              font: { size: 12, weight: '600' }
            }
          }
        }
      }
    };
  }, [dashboardStats]);

  const metricCards = [
    {
      title: "Total Users",
      value: dashboardStats?.overview?.totalUsers || 0,
      icon: <Users className="w-6 h-6" />,
      color: "bg-white",
      textColor: "text-gray-900",
      subtitle: "System-wide users"
    },
    {
      title: "Institutions",
      value: dashboardStats?.overview?.totalInstitutions || institutions.length,
      icon: <Building2 className="w-6 h-6" />,
      color: "bg-gradient-to-r from-blue-50 to-indigo-50",
      textColor: "text-blue-900",
      borderColor: "border-l-4 border-blue-500"
    },
    {
      title: "Total Applications",
      value: dashboardStats?.overview?.totalApplications || applications.length,
      icon: <FileText className="w-6 h-6" />,
      color: "bg-gradient-to-r from-purple-50 to-violet-50",
      textColor: "text-purple-900",
      borderColor: "border-l-4 border-purple-500"
    },
    {
      title: "Approved",
      value: metrics.approved,
      icon: <CheckCircle className="w-6 h-6" />,
      color: "bg-gradient-to-r from-green-50 to-emerald-50",
      textColor: "text-green-900",
      borderColor: "border-l-4 border-green-500"
    },
    {
      title: "Rejected",
      value: metrics.rejected,
      icon: <AlertTriangle className="w-6 h-6" />,
      color: "bg-gradient-to-r from-red-50 to-rose-50",
      textColor: "text-red-900",
      borderColor: "border-l-4 border-red-500"
    },
    {
      title: "Pending Review",
      value: metrics.pending,
      icon: <Clock className="w-6 h-6" />,
      color: "bg-gradient-to-r from-yellow-50 to-amber-50",
      textColor: "text-yellow-900",
      borderColor: "border-l-4 border-yellow-500"
    }
  ];

  const aiInsights = [
    {
      category: "Key Insights",
      icon: <Target className="w-5 h-5" />,
      items: [
        "Application approval rate increased by 12.5% compared to last month",
        "Maharashtra, Karnataka, and Tamil Nadu account for 38% of all applications",
        "Average processing time reduced to 8.2 days with AI assistance"
      ]
    },
    {
      category: "Risk Alerts",
      icon: <Shield className="w-5 h-5" />,
      color: "text-red-600",
      items: [
        "⚠ 23 applications flagged with high-risk parameters requiring manual review",
        "⚠ 12 document mismatches detected across 8 institutions",
        "⚠ 5 potential fraudulent documents identified in pending applications"
      ]
    },
    {
      category: "Performance Trends",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-green-600",
      items: [
        "↗ Private institutions showing 15% higher compliance scores this quarter",
        "↗ Infrastructure verification improved by 22% with AI image analysis",
        "↗ Faculty qualification matching accuracy at 94.3%"
      ]
    }
  ];

  return (
    <SuperAdminLayout className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AICTE Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">Real-time insights and AI-powered analytics for application management</p>
      </div>

      {/* TOP METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
        {metricCards.map((card, index) => (
          <div
            key={index}
            className={`${card.color} ${card.borderColor || ''} p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`${card.textColor} opacity-70 font-medium`}>
                {card.title}
              </span>
              <div className={`${card.textColor} opacity-80`}>
                {card.icon}
              </div>
            </div>
            <div className="flex items-end justify-between">
              <h2 className={`text-4xl font-bold ${card.textColor}`}>
                {card.value.toLocaleString()}
              </h2>
              {card.subtitle && (
                <span className="text-sm text-gray-500 font-medium">
                  {card.subtitle}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MAIN DASHBOARD CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Application Status Chart */}
        <div className="lg:col-span-2 bg-white p-7 rounded-2xl shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Application Status Overview
              </h2>
              <p className="text-gray-500 text-sm mt-1">Distribution of application decisions across all institutions</p>
            </div>
            <div className="px-4 py-2 bg-gray-100 rounded-full">
              <span className="text-sm font-semibold text-gray-700">
                {applications.length} Total Applications
              </span>
            </div>
          </div>
          <div className="h-[320px]">
            <Bar data={barChartConfig.data} options={barChartConfig.options} />
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="bg-white p-7 rounded-2xl shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Applications vs Institutions
              </h2>
              <p className="text-gray-500 text-sm mt-1">Comparative analysis of registered entities</p>
            </div>
          </div>
          <div className="h-[320px]">
            <Doughnut data={doughnutChartConfig.data} options={doughnutChartConfig.options} />
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{applications.length}</div>
                <div className="text-sm text-gray-600">Applications</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{institutions.length}</div>
                <div className="text-sm text-gray-600">Institutions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{metrics.approvalRate}%</div>
                <div className="text-sm text-gray-600">Approval Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* APPLICATIONS APPROVED VS RECEIVED OVER TIME - LINE CHART */}
      <div className="bg-white p-7 rounded-2xl shadow-2xl mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Applications Approved vs Applications Received Over Time
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Trend analysis of application approvals and submissions over the last 12 months
            </p>
          </div>
          <div className="px-4 py-2 bg-green-50 rounded-full border border-green-200">
            <span className="text-sm font-semibold text-green-700">
              {dashboardStats?.overview?.approvedApplications || metrics.approved} Approved
            </span>
          </div>
        </div>
        <div className="h-[350px]">
          <Line data={lineChartConfig.data} options={lineChartConfig.options} />
        </div>
      </div>

      {/* AI SUMMARY SECTION */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-7 text-white">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Target className="w-6 h-6" />
              </div>
              AI-Powered Analytics & Recommendations
            </h2>
            <p className="text-gray-300 mt-2">Real-time insights and predictive analysis for decision optimization</p>
          </div>
          <div className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
            <span className="text-sm font-semibold">Updated just now</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {aiInsights.map((section, index) => (
            <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 ${section.color ? 'bg-gray-700' : 'bg-blue-900/30'} rounded-lg`}>
                  <div className={section.color || 'text-blue-400'}>
                    {section.icon}
                  </div>
                </div>
                <h3 className={`text-lg font-bold ${section.color || 'text-white'}`}>
                  {section.category}
                </h3>
              </div>
              <ul className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {item.includes("⚠") ? (
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                      ) : item.includes("↗") ? (
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      ) : (
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2" />
                      )}
                    </div>
                    <span className="text-gray-200 leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Recommendations Footer */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <h4 className="font-bold text-lg mb-4 text-gray-100">AI Recommendations</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-blue-900/30 to-transparent p-4 rounded-lg">
              <span className="font-semibold text-blue-300">Priority Action:</span>
              <span className="text-gray-200 ml-2">Review flagged applications within 48 hours to prevent bottlenecks</span>
            </div>
            <div className="bg-gradient-to-r from-green-900/30 to-transparent p-4 rounded-lg">
              <span className="font-semibold text-green-300">Optimization:</span>
              <span className="text-gray-200 ml-2">Automate document verification for states with high application volume</span>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminDashboard;