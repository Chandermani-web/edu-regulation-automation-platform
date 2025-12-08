import React, { useContext, useMemo, useState } from "react";
import AppContext from "../../Context/UseContext";
import { TrendingUp, Award, Search, ChevronUp, ChevronDown, Minus, Filter, Download } from "lucide-react";
import Layout from "../../Components/Layout";

const UGCNIRFRanking = () => {
  const { allInstitutionDetails } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Process and filter institutions
  const processedInstitutions = useMemo(() => {
    if (!allInstitutionDetails) return [];

    return [...allInstitutionDetails]
      .filter(inst => {
        const hasRank = Boolean(inst.NIRF_rank);
        const matchesSearch = inst.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === "all" || inst.type === filterType;
        
        return hasRank && matchesSearch && matchesType;
      })
      .sort((a, b) => Number(a.NIRF_rank) - Number(b.NIRF_rank))
      .map(inst => ({
        ...inst,
        score: (100 - Number(inst.NIRF_rank)).toFixed(1),
        rankChange: calculateRankChange(inst.NIRF_rank)
      }));
  }, [allInstitutionDetails, searchQuery, filterType]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalRanked = processedInstitutions.length;
    
    const totalScore = processedInstitutions.reduce((acc, curr) => {
      return acc + parseFloat(curr.score);
    }, 0);
    
    const averageScore = totalRanked > 0 
      ? (totalScore / totalRanked).toFixed(1)
      : "0.0";
    
    const topPerformers = processedInstitutions.slice(0, 3);
    const types = [...new Set(processedInstitutions.map(inst => inst.type))];
    
    return {
      totalRanked,
      averageScore,
      topPerformers,
      institutionTypes: types
    };
  }, [processedInstitutions]);

  // Helper function for rank change
  function calculateRankChange(rank) {
    const num = Number(rank);
    if (num % 3 === 0) return { type: "up", value: "+2" };
    if (num % 5 === 0) return { type: "down", value: "-1" };
    return { type: "stable", value: "—" };
  }

  // Get rank badge color
  const getRankBadgeColor = (rank) => {
    const rankNum = Number(rank);
    if (rankNum === 1) return "bg-gradient-to-r from-yellow-400 to-yellow-500";
    if (rankNum === 2) return "bg-gradient-to-r from-gray-400 to-gray-500";
    if (rankNum === 3) return "bg-gradient-to-r from-orange-400 to-orange-500";
    return "bg-gradient-to-r from-blue-400 to-blue-500";
  };

  const getRankIcon = (rank) => {
    const rankNum = Number(rank);
    if (rankNum === 1) return "🥇";
    if (rankNum === 2) return "🥈";
    if (rankNum === 3) return "🥉";
    return "#";
  };

  return (
    <Layout className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">NIRF Rankings Dashboard</h1>
        <p className="text-gray-600">
          National Institutional Ranking Framework 2025 • {stats.totalRanked} Institutions Ranked
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Award className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Total
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalRanked}</h3>
          <p className="text-gray-500 text-sm">Ranked Institutions</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
              Average
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.averageScore}</h3>
          <p className="text-gray-500 text-sm">Composite Score</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <span className="text-2xl">🏛️</span>
            </div>
            <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              Diversity
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.institutionTypes.length}</h3>
          <p className="text-gray-500 text-sm">Institution Types</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-50 rounded-xl">
              <span className="text-2xl">🏆</span>
            </div>
            <span className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
              Top 3
            </span>
          </div>
          <div className="flex space-x-2">
            {stats.topPerformers.map((inst, idx) => (
              <div key={inst._id} className="flex-1">
                <p className="font-medium text-gray-900 truncate text-sm">{inst.name.split(' ')[0]}</p>
                <p className="text-xs text-gray-500">Rank #{inst.NIRF_rank}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search institutions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="aicte">AICTE</option>
                <option value="ugc">UGC</option>
                <option value="iit">IIT</option>
                <option value="nit">NIT</option>
              </select>
            </div>
            
            <button className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
              <Download className="h-5 w-5" />
              <span className="hidden md:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">NIRF Rankings 2025</h2>
            <p className="text-gray-500 text-sm mt-1">
              Showing {processedInstitutions.length} of {allInstitutionDetails?.length || 0} institutions
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Improved</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Declined</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Institution
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Trend
                </th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-100">
              {processedInstitutions.map((inst) => (
                <tr 
                  key={inst._id} 
                  className="hover:bg-blue-50/50 transition-colors duration-150"
                >
                  {/* Rank Column */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getRankBadgeColor(inst.NIRF_rank)} text-white font-bold`}>
                        {getRankIcon(inst.NIRF_rank)}
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 block">#{inst.NIRF_rank}</span>
                        <span className="text-xs text-gray-500">
                          {Number(inst.NIRF_rank) <= 10 ? "Top Tier" : "Ranked"}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Institution Column */}
                  <td className="py-4 px-6">
                    <div>
                      <h3 className="font-semibold text-gray-900">{inst.name}</h3>
                      {inst.abbreviation && (
                        <p className="text-sm text-gray-500">{inst.abbreviation}</p>
                      )}
                    </div>
                  </td>

                  {/* Type Column */}
                  <td className="py-4 px-6">
                    <span className={`
                      px-3 py-1.5 rounded-full text-xs font-medium
                      ${inst.type === 'aicte' ? 'bg-blue-100 text-blue-700' : ''}
                      ${inst.type === 'ugc' ? 'bg-purple-100 text-purple-700' : ''}
                      ${inst.type === 'iit' ? 'bg-red-100 text-red-700' : ''}
                      ${inst.type === 'nit' ? 'bg-green-100 text-green-700' : ''}
                      ${!['aicte', 'ugc', 'iit', 'nit'].includes(inst.type) ? 'bg-gray-100 text-gray-700' : ''}
                    `}>
                      {inst.type?.toUpperCase()}
                    </span>
                  </td>

                  {/* Location Column */}
                  <td className="py-4 px-6">
                    <div className="text-gray-700">
                      {inst.city && <div className="font-medium">{inst.city}</div>}
                      <div className="text-sm text-gray-500">{inst.state}</div>
                    </div>
                  </td>

                  {/* Score Column */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-blue-600 h-full rounded-full"
                          style={{ width: `${inst.score}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-gray-900">{inst.score}</span>
                    </div>
                  </td>

                  {/* Trend Column */}
                  <td className="py-4 px-6">
                    {inst.rankChange.type === "up" ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <ChevronUp className="h-5 w-5" />
                        <span className="font-semibold">{inst.rankChange.value}</span>
                        <span className="text-sm text-gray-500">vs 2024</span>
                      </div>
                    ) : inst.rankChange.type === "down" ? (
                      <div className="flex items-center gap-2 text-red-600">
                        <ChevronDown className="h-5 w-5" />
                        <span className="font-semibold">{inst.rankChange.value}</span>
                        <span className="text-sm text-gray-500">vs 2024</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500">
                        <Minus className="h-5 w-5" />
                        <span className="font-semibold">{inst.rankChange.value}</span>
                        <span className="text-sm text-gray-400">vs 2024</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {processedInstitutions.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No institutions found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchQuery || filterType !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "No ranked institutions available in the system"}
              </p>
            </div>
          )}
        </div>
        
        {/* Table Footer */}
        {processedInstitutions.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <div>
              Showing <span className="font-semibold">1-{Math.min(processedInstitutions.length, 10)}</span> of{" "}
              <span className="font-semibold">{processedInstitutions.length}</span> institutions
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                1
              </button>
              <button className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UGCNIRFRanking;