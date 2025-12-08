import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, GitCompare, Building2, TrendingUp, TrendingDown, Minus, FileText, BarChart3, AlertCircle, CheckCircle, XCircle, Activity, Award, Database } from 'lucide-react';
import { Bar, Radar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend
);

const InstitutionComparison = () => {
  const [institutions, setInstitutions] = useState([]);
  const [selectedInst1, setSelectedInst1] = useState(null);
  const [selectedInst2, setSelectedInst2] = useState(null);
  const [inst1Data, setInst1Data] = useState(null);
  const [inst2Data, setInst2Data] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm1, setSearchTerm1] = useState('');
  const [searchTerm2, setSearchTerm2] = useState('');
  const [allParameterTemplates, setAllParameterTemplates] = useState([]);

  useEffect(() => {
    fetchInstitutions();
    fetchAllParameterTemplates();
  }, []);

  const fetchInstitutions = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/super-admin/institutions', {
        withCredentials: true
      });
      setInstitutions(response.data.data || []);
    } catch (error) {
      console.error('Error fetching institutions:', error);
    }
  };

  const fetchAllParameterTemplates = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/super-admin/parameter-templates', {
        withCredentials: true
      });
      setAllParameterTemplates(response.data.data || []);
    } catch (error) {
      console.error('Error fetching parameter templates:', error);
    }
  };

  const fetchInstitutionDetails = async (institutionId) => {
    try {
      // Fetch institution details with populated applications
      const instDetails = await axios.get(
        `http://localhost:3000/api/super-admin/institutions/${institutionId}`, 
        { withCredentials: true }
      );

      const institution = instDetails.data.data;
      console.log('Institution data:', institution);

      // Fetch parameters
      let parameters = [];
      try {
        const paramResponse = await axios.get(
          `http://localhost:3000/api/institution/parameter/${institutionId}`, 
          { withCredentials: true }
        );
        parameters = paramResponse.data.data || [];
      } catch {
        console.log('No parameters found for institution:', institutionId);
      }

      // Use applications from institution data if available, otherwise fetch and filter
      let applications = [];
      if (institution.applications && institution.applications.length > 0) {
        // If applications are already populated objects
        if (typeof institution.applications[0] === 'object' && institution.applications[0] !== null && !institution.applications[0]._id) {
          applications = institution.applications;
          console.log('Using populated applications from institution:', applications.length);
        } else {
          // Applications are just IDs, need to fetch all and filter
          try {
            const appResponse = await axios.get(
              `http://localhost:3000/api/institution/application/all`, 
              { withCredentials: true }
            );
            const allApps = appResponse.data.applications || appResponse.data.data || [];
            console.log('Total applications from API:', allApps.length);
            
            // Create a Set of application IDs from institution for faster lookup
            const instAppIds = new Set(
              institution.applications.map(app => 
                typeof app === 'string' ? app : app._id || app
              )
            );
            console.log('Institution application IDs:', Array.from(instAppIds));
            
            // Filter by matching application IDs
            applications = allApps.filter(app => {
              const appId = app._id || app.id;
              const match = instAppIds.has(appId) || instAppIds.has(appId?.toString());
              if (match) {
                console.log('✓ Matched application:', appId);
              }
              return match;
            });
            console.log('Filtered applications count:', applications.length);
          } catch (error) {
            console.log('Error fetching applications:', error);
          }
        }
      } else {
        console.log('No applications in institution data, fetching and filtering by institution_id');
        try {
          const appResponse = await axios.get(
            `http://localhost:3000/api/institution/application/all`, 
            { withCredentials: true }
          );
          const allApps = appResponse.data.applications || appResponse.data.data || [];
          applications = allApps.filter(app => {
            const appInstId = typeof app.institution_id === 'string' ? app.institution_id : app.institution_id?._id;
            return appInstId === institutionId || appInstId === institutionId.toString();
          });
          console.log('Filtered by institution_id, count:', applications.length);
        } catch (error) {
          console.log('Error fetching applications:', error);
        }
      }

      // Fetch AI analysis
      let aiAnalysis = [];
      try {
        const analysisResponse = await axios.get(
          `http://localhost:3000/api/ai-analysis/institution/${institutionId}`, 
          { withCredentials: true }
        );
        aiAnalysis = Array.isArray(analysisResponse.data.data) ? analysisResponse.data.data : [analysisResponse.data.data];
      } catch {
        console.log('No AI analysis found for institution:', institutionId);
      }

      // Fetch AI reports
      let aiReports = [];
      try {
        const reportResponse = await axios.get(
          `http://localhost:3000/api/ai-report/institution/${institutionId}`, 
          { withCredentials: true }
        );
        aiReports = Array.isArray(reportResponse.data.data) ? reportResponse.data.data : [reportResponse.data.data];
      } catch {
        console.log('No AI reports found for institution:', institutionId);
      }

      console.log('Fetched data for institution:', institutionId, {
        institution: instDetails.data.data,
        parametersCount: parameters.length,
        parameters: parameters,
        applicationsCount: applications.length,
        applications: applications,
        aiAnalysisCount: aiAnalysis.length,
        aiReportsCount: aiReports.length
      });

      return {
        institution: instDetails.data.data,
        parameters: parameters,
        applications: applications,
        aiAnalysis: aiAnalysis,
        aiReports: aiReports
      };
    } catch (error) {
      console.error('Error fetching institution details:', error);
      alert(`Error fetching data for institution: ${error.response?.data?.message || error.message}`);
      return null;
    }
  };

  const handleCompare = async () => {
    if (!selectedInst1 || !selectedInst2) {
      alert('Please select two institutions to compare');
      return;
    }

    if (selectedInst1 === selectedInst2) {
      alert('Please select two different institutions');
      return;
    }

    setLoading(true);
    
    // Fetch detailed data for both institutions
    const data1 = await fetchInstitutionDetails(selectedInst1);
    const data2 = await fetchInstitutionDetails(selectedInst2);
    setInst1Data(data1);
    setInst2Data(data2);
    
    // Fetch historical comparison data
    try {
      const historicalResponse = await axios.post(
        'http://localhost:3000/api/ai-analysis/historical-comparison',
        { institutionIds: [selectedInst1, selectedInst2] },
        { withCredentials: true }
      );
      setHistoricalData(historicalResponse.data.data);
      console.log('Historical data:', historicalResponse.data.data);
    } catch (error) {
      console.error('Error fetching historical data:', error);
      setHistoricalData(null);
    }
    
    setLoading(false);
  };

  const filteredInstitutions1 = institutions.filter(inst =>
    inst.name?.toLowerCase().includes(searchTerm1.toLowerCase()) ||
    inst.type?.toLowerCase().includes(searchTerm1.toLowerCase())
  );

  const filteredInstitutions2 = institutions.filter(inst =>
    inst.name?.toLowerCase().includes(searchTerm2.toLowerCase()) ||
    inst.type?.toLowerCase().includes(searchTerm2.toLowerCase())
  );

  const calculateComplianceRate = (parameters) => {
    if (!parameters || parameters.length === 0) return 0;
    const compliant = parameters.filter(p => p.is_compliant).length;
    return ((compliant / parameters.length) * 100).toFixed(1);
  };

  const getComparisonIndicator = (value1, value2) => {
    if (value1 > value2) return <TrendingUp className="text-green-600" size={20} />;
    if (value1 < value2) return <TrendingDown className="text-red-600" size={20} />;
    return <Minus className="text-gray-600" size={20} />;
  };

  const getParametersByCategory = (parameters) => {
    const grouped = {};
    parameters.forEach(param => {
      const category = param.parameter_category;
      if (!grouped[category]) {
        grouped[category] = { total: 0, compliant: 0 };
      }
      grouped[category].total++;
      if (param.is_compliant) grouped[category].compliant++;
    });
    return grouped;
  };

  const renderComplianceComparison = () => {
    return null;
  };

  const renderPerformanceMetrics = () => {
    if (!historicalData) return null;

    const { institution1, institution2 } = historicalData;

    const metrics = [
      { 
        label: 'Average Score', 
        inst1: institution1.metrics.averageScore, 
        inst2: institution2.metrics.averageScore,
        icon: <Award className="text-yellow-600" />,
        suffix: '/100'
      },
      { 
        label: 'Highest Score', 
        inst1: institution1.metrics.highestScore, 
        inst2: institution2.metrics.highestScore,
        icon: <TrendingUp className="text-green-600" />,
        suffix: '/100'
      },
      { 
        label: 'Average Compliance', 
        inst1: institution1.metrics.averageCompliance, 
        inst2: institution2.metrics.averageCompliance,
        icon: <CheckCircle className="text-blue-600" />,
        suffix: '%'
      },
      { 
        label: 'Improvement Rate', 
        inst1: institution1.metrics.improvementRate, 
        inst2: institution2.metrics.improvementRate,
        icon: <Activity className="text-purple-600" />,
        suffix: '%',
        showSign: true
      },
      { 
        label: 'Consistency Score', 
        inst1: institution1.metrics.consistencyScore, 
        inst2: institution2.metrics.consistencyScore,
        icon: <BarChart3 className="text-indigo-600" />,
        suffix: '/100'
      },
      { 
        label: 'Approval Rate', 
        inst1: institution1.metrics.approvalRate, 
        inst2: institution2.metrics.approvalRate,
        icon: <CheckCircle className="text-green-600" />,
        suffix: '%'
      },
      { 
        label: 'Total Submissions', 
        inst1: institution1.metrics.totalSubmissions, 
        inst2: institution2.metrics.totalSubmissions,
        icon: <FileText className="text-gray-600" />,
        suffix: ''
      }
    ];

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Award className="text-yellow-600" size={24} />
          Performance Metrics Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                {metric.icon}
                <span className="text-sm font-semibold text-gray-700">{metric.label}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">Institution 1</div>
                  <div className="text-lg font-bold text-blue-700">
                    {metric.showSign && metric.inst1 > 0 ? '+' : ''}{metric.inst1}{metric.suffix}
                  </div>
                </div>
                <div className="text-gray-400">
                  {metric.inst1 > metric.inst2 ? <TrendingUp size={20} className="text-green-600" /> :
                   metric.inst1 < metric.inst2 ? <TrendingDown size={20} className="text-red-600" /> :
                   <Minus size={20} />}
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">Institution 2</div>
                  <div className="text-lg font-bold text-purple-700">
                    {metric.showSign && metric.inst2 > 0 ? '+' : ''}{metric.inst2}{metric.suffix}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderComparisonCharts = () => {
    if (!inst1Data || !inst2Data) return null;

    const inst1Categories = getParametersByCategory(inst1Data.parameters);
    const inst2Categories = getParametersByCategory(inst2Data.parameters);
    const allCategories = [...new Set([...Object.keys(inst1Categories), ...Object.keys(inst2Categories)])];

    // Compliance Comparison Bar Chart
    const complianceChartData = {
      labels: allCategories,
      datasets: [
        {
          label: inst1Data.institution.name,
          data: allCategories.map(cat => {
            const catData = inst1Categories[cat];
            return catData ? ((catData.compliant / catData.total) * 100).toFixed(1) : 0;
          }),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1
        },
        {
          label: inst2Data.institution.name,
          data: allCategories.map(cat => {
            const catData = inst2Categories[cat];
            return catData ? ((catData.compliant / catData.total) * 100).toFixed(1) : 0;
          }),
          backgroundColor: 'rgba(168, 85, 247, 0.8)',
          borderColor: 'rgb(168, 85, 247)',
          borderWidth: 1
        }
      ]
    };

    // AI Score Radar Chart
    const inst1AIScores = inst1Data.aiAnalysis[0] || {};
    const inst2AIScores = inst2Data.aiAnalysis[0] || {};

    const radarChartData = {
      labels: ['Infrastructure', 'Faculty', 'Academic', 'Compliance', 'Overall'],
      datasets: [
        {
          label: inst1Data.institution.name,
          data: [
            inst1AIScores.infrastructure_score || 0,
            inst1AIScores.faculty_score || 0,
            inst1AIScores.academic_score || 0,
            inst1AIScores.compliance_score || 0,
            inst1AIScores.ai_total_score || 0
          ],
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderColor: 'rgb(59, 130, 246)',
          pointBackgroundColor: 'rgb(59, 130, 246)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(59, 130, 246)'
        },
        {
          label: inst2Data.institution.name,
          data: [
            inst2AIScores.infrastructure_score || 0,
            inst2AIScores.faculty_score || 0,
            inst2AIScores.academic_score || 0,
            inst2AIScores.compliance_score || 0,
            inst2AIScores.ai_total_score || 0
          ],
          backgroundColor: 'rgba(168, 85, 247, 0.2)',
          borderColor: 'rgb(168, 85, 247)',
          pointBackgroundColor: 'rgb(168, 85, 247)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(168, 85, 247)'
        }
      ]
    };

    return (
      <div className="space-y-6 mt-8">
        {/* Compliance Comparison */}
        {renderComplianceComparison()}
        
        {/* Performance Metrics Summary */}
        {historicalData && renderPerformanceMetrics()}
        
        {/* Compliance by Category */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="text-blue-600" size={24} />
            Parameter Compliance by Category
          </h3>
          <div className="h-80">
            <Bar
              data={complianceChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                      callback: (value) => value + '%'
                    }
                  }
                },
                plugins: {
                  legend: {
                    position: 'top'
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => `${context.dataset.label}: ${context.parsed.y}%`
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* AI Score Comparison */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="text-purple-600" size={24} />
            AI Analysis Score Comparison
          </h3>
          <div className="h-96">
            <Radar
              data={radarChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  r: {
                    beginAtZero: true,
                    max: 100
                  }
                },
                plugins: {
                  legend: {
                    position: 'top'
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderComparisonTable = () => {
    if (!inst1Data || !inst2Data) return null;

    const metrics = [
      {
        label: 'Type',
        value1: inst1Data.institution.type,
        value2: inst2Data.institution.type,
        isText: true
      },
      {
        label: 'Parameters Filled',
        value1: inst1Data.parameters.filter(p => p.institution_value || p.parameter_value || p.value).length,
        value2: inst2Data.parameters.filter(p => p.institution_value || p.parameter_value || p.value).length
      },
      {
        label: 'Compliance Rate',
        value1: calculateComplianceRate(inst1Data.parameters),
        value2: calculateComplianceRate(inst2Data.parameters),
        suffix: '%'
      },
      {
        label: 'Total Applications',
        value1: inst1Data.applications.length,
        value2: inst2Data.applications.length
      },
      {
        label: 'AI Total Score',
        value1: inst1Data.aiAnalysis[0]?.ai_total_score || 0,
        value2: inst2Data.aiAnalysis[0]?.ai_total_score || 0,
        suffix: '/100'
      },
      {
        label: 'AI Reports Generated',
        value1: inst1Data.aiReports.length,
        value2: inst2Data.aiReports.length
      },
      {
        label: 'Application Status',
        value1: inst1Data.applications[0]?.status || 'N/A',
        value2: inst2Data.applications[0]?.status || 'N/A',
        isText: true
      }
    ];

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-8">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="text-green-600" size={24} />
            Side-by-Side Comparison
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Metric</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-blue-700">
                  {inst1Data.institution.name}
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-500">
                  Comparison
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-purple-700">
                  {inst2Data.institution.name}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {metrics.map((metric, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{metric.label}</td>
                  <td className="px-6 py-4 text-center text-sm text-blue-700 font-semibold">
                    {metric.value1}{metric.suffix || ''}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {!metric.isText && getComparisonIndicator(parseFloat(metric.value1), parseFloat(metric.value2))}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-purple-700 font-semibold">
                    {metric.value2}{metric.suffix || ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderAIReportComparison = () => {
    if (!inst1Data || !inst2Data) return null;

    const report1 = inst1Data.aiReports[0];
    const report2 = inst2Data.aiReports[0];

    if (!report1 && !report2) return null;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Institution 1 AI Report */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
            <Building2 size={20} />
            {inst1Data.institution.name} - AI Report
          </h3>
          {report1 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Overall Decision</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  report1.final_decision === 'approved' ? 'bg-green-100 text-green-800' :
                  report1.final_decision === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {report1.final_decision?.toUpperCase()}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">AI Total Score:</span>
                  <span className="text-sm font-semibold text-blue-700">{report1.ai_total_score || 0}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Compliance Score:</span>
                  <span className="text-sm font-semibold text-blue-700">{report1.parameter_compliance_score || 0}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Analysis Runs:</span>
                  <span className="text-sm font-semibold text-blue-700">{report1.run_count || 0}</span>
                </div>
              </div>
              {report1.summary && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-700 leading-relaxed">{report1.summary}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle size={40} className="mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No AI report available</p>
            </div>
          )}
        </div>

        {/* Institution 2 AI Report */}
        <div className="bg-white rounded-xl shadow-sm border border-purple-200 p-6">
          <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
            <Building2 size={20} />
            {inst2Data.institution.name} - AI Report
          </h3>
          {report2 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Overall Decision</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  report2.final_decision === 'approved' ? 'bg-green-100 text-green-800' :
                  report2.final_decision === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {report2.final_decision?.toUpperCase()}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">AI Total Score:</span>
                  <span className="text-sm font-semibold text-purple-700">{report2.ai_total_score || 0}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Compliance Score:</span>
                  <span className="text-sm font-semibold text-purple-700">{report2.parameter_compliance_score || 0}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Analysis Runs:</span>
                  <span className="text-sm font-semibold text-purple-700">{report2.run_count || 0}</span>
                </div>
              </div>
              {report2.summary && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-700 leading-relaxed">{report2.summary}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle size={40} className="mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No AI report available</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderParameterComparison = () => {
    if (!inst1Data || !inst2Data) return null;

    const params1 = inst1Data.parameters || [];
    const params2 = inst2Data.parameters || [];

    console.log('Institution 1 parameters:', params1);
    console.log('Institution 2 parameters:', params2);

    // Create maps for institution parameters
    const param1Map = new Map();
    params1.forEach(param => {
      const name = param.parameter_template_id?.parameter_name || param.parameter_name || 'Unknown';
      const value = param.institution_value || param.parameter_value || param.value;
      if (value && value !== '' && value !== null && value !== undefined) {
        param1Map.set(name, {
          value: value,
          compliant: param.is_compliant,
          category: param.parameter_template_id?.parameter_category || param.category
        });
      }
    });

    const param2Map = new Map();
    params2.forEach(param => {
      const name = param.parameter_template_id?.parameter_name || param.parameter_name || 'Unknown';
      const value = param.institution_value || param.parameter_value || param.value;
      if (value && value !== '' && value !== null && value !== undefined) {
        param2Map.set(name, {
          value: value,
          compliant: param.is_compliant,
          category: param.parameter_template_id?.parameter_category || param.category
        });
      }
    });

    console.log('Institution 1 parameter map size:', param1Map.size);
    console.log('Institution 2 parameter map size:', param2Map.size);

    // Group ALL parameter templates by category
    const groupedTemplates = {};
    const allCategories = new Set();
    
    allParameterTemplates.forEach(template => {
      const category = template.parameter_category || 'Uncategorized';
      allCategories.add(category);
      if (!groupedTemplates[category]) groupedTemplates[category] = [];
      groupedTemplates[category].push(template);
    });

    // If no templates loaded, use parameters from institutions
    if (allParameterTemplates.length === 0) {
      params1.forEach(param => {
        const category = param.parameter_template_id?.parameter_category || 'Uncategorized';
        allCategories.add(category);
      });
      params2.forEach(param => {
        const category = param.parameter_template_id?.parameter_category || 'Uncategorized';
        allCategories.add(category);
      });
    }

    // Get all unique parameter names
    const allParamNames = new Set([...param1Map.keys(), ...param2Map.keys()]);

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Database className="text-indigo-600" size={28} />
          Parameter Comparison
        </h3>

        {Array.from(allCategories).map(category => {
          // Get all parameter templates for this category
          const categoryTemplates = groupedTemplates[category] || [];
          
          return (
            <div key={category} className="mb-8">
              <h4 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-indigo-200 flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">{category}</span>
                <span className="text-xs text-gray-500">({categoryTemplates.length} parameters)</span>
              </h4>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Parameter Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Norm Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                        {inst1Data.institution.name}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-600 uppercase tracking-wider">
                        {inst2Data.institution.name}
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categoryTemplates.map(template => {
                      const paramName = template.parameter_name;
                      const normValue = template.norm_value;
                      const param1Data = param1Map.get(paramName);
                      const param2Data = param2Map.get(paramName);
                      
                      const value1 = param1Data?.value || 'Not Filled';
                      const value2 = param2Data?.value || 'Not Filled';
                      const compliant1 = param1Data?.compliant;
                      const compliant2 = param2Data?.compliant;
                      
                      const isMatch = value1 === value2 && value1 !== 'Not Filled';
                      const isDifferent = value1 !== value2 && value1 !== 'Not Filled' && value2 !== 'Not Filled';
                      const bothFilled = value1 !== 'Not Filled' && value2 !== 'Not Filled';

                      return (
                        <tr key={template._id} className={isDifferent ? 'bg-yellow-50' : ''}>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            <div>{paramName}</div>
                            {template.description && (
                              <div className="text-xs text-gray-500 mt-1">{template.description}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            <span className="font-medium">{normValue}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            <div className="flex items-center gap-2">
                              <span className={`${value1 === 'Not Filled' ? 'text-gray-400 italic' : 'font-semibold text-blue-700'}`}>
                                {value1}
                              </span>
                              {compliant1 !== undefined && (
                                compliant1 ? 
                                  <CheckCircle className="text-green-600" size={16} /> : 
                                  <XCircle className="text-red-500" size={16} />
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            <div className="flex items-center gap-2">
                              <span className={`${value2 === 'Not Filled' ? 'text-gray-400 italic' : 'font-semibold text-purple-700'}`}>
                                {value2}
                              </span>
                              {compliant2 !== undefined && (
                                compliant2 ? 
                                  <CheckCircle className="text-green-600" size={16} /> : 
                                  <XCircle className="text-red-500" size={16} />
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {isMatch ? (
                              <div className="flex flex-col items-center">
                                <CheckCircle className="text-green-600" size={20} />
                                <span className="text-xs text-green-600">Match</span>
                              </div>
                            ) : isDifferent && bothFilled ? (
                              <div className="flex flex-col items-center">
                                <XCircle className="text-orange-500" size={20} />
                                <span className="text-xs text-orange-600">Differ</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center">
                                <Minus className="text-gray-400" size={20} />
                                <span className="text-xs text-gray-500">Incomplete</span>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}

        {/* Summary Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
            <div className="text-sm text-gray-600 mb-1">Total Parameter Templates</div>
            <div className="text-2xl font-bold text-indigo-700">{allParameterTemplates.length}</div>
            <div className="text-xs text-gray-500 mt-1">Available for all institutions</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-sm text-gray-600 mb-1">Institution 1 Filled</div>
            <div className="text-2xl font-bold text-blue-700">{params1.filter(p => p.institution_value || p.parameter_value).length}</div>
            <div className="text-xs text-gray-500 mt-1">{inst1Data.institution.name}</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="text-sm text-gray-600 mb-1">Institution 2 Filled</div>
            <div className="text-2xl font-bold text-purple-700">{params2.filter(p => p.institution_value || p.parameter_value).length}</div>
            <div className="text-xs text-gray-500 mt-1">{inst2Data.institution.name}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-sm text-gray-600 mb-1">Both Filled</div>
            <div className="text-2xl font-bold text-green-700">{allParamNames.size}</div>
            <div className="text-xs text-gray-500 mt-1">Across both institutions</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <GitCompare className="text-blue-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-900">Institution Comparison</h1>
          </div>
          <p className="text-gray-600">Compare two institutions side-by-side with detailed analytics and AI insights</p>
        </div>

        {/* Selection Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Institution 1 Selector */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
              <Building2 size={20} />
              Select First Institution
            </h3>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name or type..."
                value={searchTerm1}
                onChange={(e) => setSearchTerm1(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {filteredInstitutions1.map(inst => (
                <button
                  key={inst._id}
                  onClick={() => setSelectedInst1(inst._id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedInst1 === inst._id
                      ? 'bg-blue-50 border-blue-500 shadow-sm'
                      : 'bg-white border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900">{inst.name}</div>
                  <div className="text-xs text-gray-500">{inst.type}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Institution 2 Selector */}
          <div className="bg-white rounded-xl shadow-sm border border-purple-200 p-6">
            <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
              <Building2 size={20} />
              Select Second Institution
            </h3>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name or type..."
                value={searchTerm2}
                onChange={(e) => setSearchTerm2(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {filteredInstitutions2.map(inst => (
                <button
                  key={inst._id}
                  onClick={() => setSelectedInst2(inst._id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedInst2 === inst._id
                      ? 'bg-purple-50 border-purple-500 shadow-sm'
                      : 'bg-white border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900">{inst.name}</div>
                  <div className="text-xs text-gray-500">{inst.type}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Compare Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleCompare}
            disabled={loading || !selectedInst1 || !selectedInst2}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
          >
            <GitCompare size={20} />
            {loading ? 'Comparing...' : 'Compare Institutions'}
          </button>
        </div>

        {/* Comparison Results */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading comparison data...</p>
          </div>
        )}

        {!loading && inst1Data && inst2Data && (
          <>
            {renderComparisonTable()}
            {renderParameterComparison()}
            {renderComparisonCharts()}
            {renderAIReportComparison()}
          </>
        )}

        {!loading && !inst1Data && !inst2Data && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <GitCompare className="mx-auto text-gray-400 mb-4" size={64} />
            <p className="text-gray-600 text-lg">Select two institutions and click "Compare" to see detailed analysis</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstitutionComparison;
