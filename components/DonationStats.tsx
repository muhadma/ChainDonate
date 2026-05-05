'use client';

import React from 'react';
import { PhilippinePeso, Users, Target } from 'lucide-react';

interface DonationStats {
  totalRaised: number;
  goal: number;
  donorCount: number;
  recentDonations: {
    id: number;
    name: string;
    amount: number;
    date: string;
  }[];
}

interface DonationStatsProps {
  data?: DonationStats; // Optional: can be passed from a parent component
}

const DonationStatsComponent: React.FC<DonationStatsProps> = ({ data }) => {
  // Fallback to mock data if no props are provided

  // ari mo change if we go dynamic
  const stats: DonationStats = data || {
    totalRaised: 12450.50,
    goal: 20000,
    donorCount: 142,
    recentDonations: [
      { id: 1, name: "Anonymous", amount: 50, date: "2 mins ago" },
      { id: 2, name: "Ongshing", amount: 500, date: "5 mins ago" },
      { id: 3, name: "Juan Dela Cruz", amount: 100, date: "3 hours ago" },
    ]
  };

  const progressPercentage = Math.min((stats.totalRaised / stats.goal) * 100, 100);

  const styles = {
    
    wrapper: { 
      padding: '20px', 
      backgroundColor: '#f8fafc', 
      borderRadius: '16px', 
      fontFamily: 'system-ui, -apple-system, sans-serif' 
    },

    title: { fontSize: '22px', fontWeight: '700', color: '#0f172a', marginBottom: '20px' },
    grid: { 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
      gap: '16px', 
      marginBottom: '24px' 
    },

    progressBarSection: { 
      backgroundColor: 'white', 
      padding: '20px', 
      borderRadius: '12px', 
      border: '1px solid #e2e8f0',
      marginBottom: '24px'
    },

    barTrack: { width: '100%', backgroundColor: '#f1f5f9', borderRadius: '10px', height: '8px', marginTop: '10px' },
    barFill: { backgroundColor: '#22c55e', height: '100%', borderRadius: '10px', transition: 'width 0.6s ease' },
    tableWrapper: { backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse' as const },
    th: { textAlign: 'left' as const, padding: '12px 16px', backgroundColor: '#f8fafc', color: '#64748b', fontSize: '13px', fontWeight: '600' },
    td: { padding: '14px 16px', borderTop: '1px solid #f1f5f9', fontSize: '14px' }
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Donation Statistics</h2>

      {/* Metric Cards */}

      <div style={styles.grid}>
        <StatCard title="Total Raised" value={`₱ ${stats.totalRaised.toLocaleString()}`} icon={<PhilippinePeso color="#16a34a" />} />
        <StatCard title="Donors" value={stats.donorCount.toString()} icon={<Users color="#2563eb" />} />
        <StatCard title="Goal Progress" value={`${progressPercentage.toFixed(1)}%`} icon={<Target color="#9333ea" />} />
      </div>

      {/* Progress Bar Container */}

      <div style={styles.progressBarSection}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', color: '#475569' }}>
          <span>Campaign Progress</span>
          <span>₱{stats.totalRaised.toLocaleString()} / ₱{stats.goal.toLocaleString()}</span>
        </div>
        <div style={styles.barTrack}>
          <div style={{ ...styles.barFill, width: `${progressPercentage}%` }} />
        </div>
      </div>
      
    </div>
  );
};

// Reusable Stat Card sub-component
const StatCard = ({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) => (
  <div style={{ 
    backgroundColor: 'white', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0', 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
  }}>
    <div>
      <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 4px 0', fontWeight: '500' }}>{title}</p>
      <p style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>{value}</p>
    </div>
    <div style={{ backgroundColor: '#f1f5f9', padding: '8px', borderRadius: '10px' }}>{icon}</div>
  </div>
);

export default DonationStatsComponent;