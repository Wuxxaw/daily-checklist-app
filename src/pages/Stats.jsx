import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const Stats = () => {
  const [filter, setFilter] = useState('7'); // '7', '30', 'all'
  const [duties, setDuties] = useState([]);
  const [statsData, setStatsData] = useState([]);

  // Load duties from localStorage
  useEffect(() => {
    const loadDuties = () => {
      try {
        const savedDuties = localStorage.getItem('dutyData');
        if (savedDuties) {
          setDuties(JSON.parse(savedDuties));
        }
      } catch (error) {
        console.error('Error loading duties:', error);
      }
    };
    
    loadDuties();
  }, []);

  // Generate stats data based on filter and duties
  useEffect(() => {
    if (duties.length === 0) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let startDate;
    switch (filter) {
      case '7':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 6);
        break;
      case '30':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 29);
        break;
      case 'all':
        // Find the earliest duty creation date
        const earliestDate = new Date(Math.min(...duties.map(d => new Date(d.createdAt))));
        startDate = new Date(earliestDate);
        startDate.setHours(0, 0, 0, 0);
        break;
      default:
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 6);
    }

    const data = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= today) {
      const dateString = currentDate.toISOString().split('T')[0];
      
      // Count completed duties for this date
      let completedCount = 0;
      const dutyBreakdown = duties.map(duty => {
        const isCompleted = duty.completedDays.includes(dateString);
        if (isCompleted) completedCount++;
        return {
          name: duty.name,
          icon: duty.icon,
          color: duty.color,
          completed: isCompleted
        };
      });

      data.push({
        date: dateString,
        completed: completedCount,
        total: duties.length,
        percentage: duties.length > 0 ? Math.round((completedCount / duties.length) * 100) : 0,
        dutyBreakdown
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    setStatsData(data);
  }, [duties, filter]);

  // Calculate summary statistics
  const totalDays = statsData.length;
  const daysWithCompletions = statsData.filter(day => day.completed > 0).length;
  const averageCompletion = totalDays > 0 
    ? Math.round(statsData.reduce((sum, day) => sum + day.percentage, 0) / totalDays)
    : 0;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatFullDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 text-white p-4 rounded-lg shadow-xl border border-gray-700">
          <div className="text-sm font-medium text-gray-300 mb-3">
            {formatFullDate(label)}
          </div>
          <div className="text-lg font-bold text-white mb-2">
            {data.completed}/{data.total} duties completed
          </div>
          <div className="space-y-1">
            {data.dutyBreakdown.map((duty, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <span className="text-lg">{duty.icon}</span>
                <span className={`flex-1 ${duty.completed ? 'text-green-400' : 'text-red-400'}`}>
                  {duty.completed ? '✅' : '❌'} {duty.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex items-center justify-center p-4 pt-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl w-full">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Your Progress Dashboard
        </h1>
        
        {/* Filter Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-md p-1">
            <div className="flex space-x-1">
              {[
                { key: '7', label: 'Last 7 days' },
                { key: '30', label: 'Last 30 days' },
                { key: 'all', label: 'From First Entry' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    filter === tab.key
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Summary statistics */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{totalDays}</div>
              <div className="text-sm text-gray-600">Total Days Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{daysWithCompletions}</div>
              <div className="text-sm text-gray-600">Days with Completions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{averageCompletion}%</div>
              <div className="text-sm text-gray-600">Average Completion Rate</div>
            </div>
          </div>
        </div>
        
        {/* Chart */}
        <div className="bg-gray-900 rounded-lg shadow-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">
            Daily Duty Completion
          </h2>
          
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={statsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                tickFormatter={formatDate}
                stroke="#374151"
              />
              <YAxis 
                domain={[0, 'dataMax + 1']}
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                stroke="#374151"
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone"
                dataKey="completed" 
                stroke="#3B82F6" 
                strokeWidth={3}
                fill="url(#colorCompleted)"
                name="Completed Duties"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Stats; 