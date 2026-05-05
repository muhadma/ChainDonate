'use client';

import React from 'react';
import { PhilippinePeso, Users, Target } from 'lucide-react';

interface DonationStats {
  totalRaised: number;
  goal: number;
  donorCount: number;
}

interface DonationStatsProps {
  data?: DonationStats;
}

const DonationStatsComponent: React.FC<DonationStatsProps> = ({ data }) => {
  // Fallback to mock data if no props are provided

  const stats: DonationStats = data || {
    totalRaised: 12450.50,
    goal: 20000,
    donorCount: 142,
  };

  const progressPercentage = Math.min((stats.totalRaised / stats.goal) * 100, 100);

  const styles = {
    wrapper: {
      padding: '20px',
      backgroundColor: '#0f1117',
      borderRadius: '16px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#ffffff'
    },
    title: {
      fontSize: '22px',
      fontWeight: '700',
      color: '#ffffff',
      marginBottom: '20px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    },
    progressBarSection: {
      backgroundColor: '#1a1d27',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #2d313e',
    },
    barTrack: {
      width: '100%',
      backgroundColor: '#2d313e',
      borderRadius: '10px',
      height: '10px',
      marginTop: '12px'
    },
    barFill: {
      backgroundColor: '#22c55e',
      height: '100%',
      borderRadius: '10px',
      transition: 'width 0.6s ease-in-out'
    },
    progressLabel: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '13px',
      fontWeight: '600',
      color: '#94a3b8'
    }
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Donation Statistics</h2>

      {/* Metric Cards */}
      <div style={styles.grid}>
        <StatCard
          title="Total Raised"
          value={`₱ ${stats.totalRaised.toLocaleString()}`}
          icon={<PhilippinePeso color="#16a34a" />}
        />
        <StatCard
          title="Donors"
          value={stats.donorCount.toString()}
          icon={<Users color="#2563eb" />}
        />
        <StatCard
          title="Goal Progress"
          value={`${progressPercentage.toFixed(1)}%`}
          icon={<Target color="#9333ea" />}
        />
      </div>

      {/* Progress Bar Container */}
      <div style={styles.progressBarSection}>
        <div style={styles.progressLabel}>
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

const StatCard = ({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) => (
  <div style={{
    backgroundColor: '#1a1d27',
    padding: '18px',
    borderRadius: '12px',
    border: '1px solid #2d313e',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }}>
    <div>
      <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 4px 0', fontWeight: '500' }}>{title}</p>
      <p style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', margin: 0 }}>{value}</p>
    </div>
    <div style={{
      backgroundColor: '#2d313e',
      padding: '8px',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {icon}
    </div>
  </div>
);

export default DonationStatsComponent;