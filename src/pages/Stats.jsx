import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Stats = () => {
  // Generate dummy data for the last 14 days
  const generateDummyStats = () => {
    const stats = [];
    const today = new Date();
    
    for (let i = 13; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const total = Math.floor(Math.random() * 3) + 3; // 3-5 total items
      const completed = Math.floor(Math.random() * (total + 1)); // 0 to total
      
      stats.push({
        date: date.toISOString().split('T')[0],
        completed,
        total,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0
      });
    }
    
    return stats;
  };

  const dummyStats = generateDummyStats();
  
  // Calculate summary statistics
  const daysCompleted = dummyStats.filter(day => day.completed === day.total && day.total > 0).length;
  const averageCompletion = Math.round(
    dummyStats.reduce((sum, day) => sum + day.percentage, 0) / dummyStats.length
  );

  return (
    <div className="flex items-center justify-center p-4 pt-8">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Your Progress
        </h1>
        
        {/* Summary statistics */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center">
            <div className="text-lg">
              <span className="font-semibold text-gray-800">{daysCompleted}/14</span>
              <span className="text-gray-600"> days completed</span>
            </div>
            <div className="text-lg">
              <span className="text-gray-600">Avg: </span>
              <span className="font-semibold text-blue-600">{averageCompletion}%</span>
            </div>
          </div>
        </div>
        
        {/* Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            Daily Completion Rate (Last 14 Days)
          </h2>
          
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={dummyStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }}
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                formatter={(value, name) => [`${value}%`, 'Completion Rate']}
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return date.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  });
                }}
              />
              <Bar 
                dataKey="percentage" 
                fill="#3B82F6" 
                radius={[4, 4, 0, 0]}
                name="Completion Rate"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Stats; 