import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe } from 'lucide-react';
import './TasksPage.css';
import FooterMenu from '../FooterMenu/FooterMenu';

interface Task {
  id: number;
  name: string;
  value: string;
  details: string;
}

export interface DetailedTask extends Task {
  description: string;
  reward: string;
  steps: string[];
}

const TasksPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Daily' | 'Main'>('Daily');
  const navigate = useNavigate();

  const dailyTasks: Task[] = [
    { id: 1, name: 'Nuka Cola', value: '0.04 DMT', details: 'Collect 5 Nuka Cola bottles' },
    { id: 2, name: 'Radroach Hunt', value: '0.02 DMT', details: 'Eliminate 10 Radroaches' },
    // Add more daily tasks...
  ];

  const mainTasks: Task[] = [
    { id: 101, name: 'Vault Exploration', value: '0.5 DMT', details: 'Explore Vault 101' },
    { id: 102, name: 'Brotherhood Quest', value: '1.0 DMT', details: 'Complete a quest for the Brotherhood of Steel' },
    // Add more main tasks...
  ];

  const tasks = activeTab === 'Daily' ? dailyTasks : mainTasks;

  const navigateToTaskPage = (task: Task) => {
    navigate(`/task/${task.id}`, { state: task });
  };

  return (
    <div className="page-container">
      <div className="tasks-container">
        <h1 className="tasks-title">TASKS</h1>
        
        <div className="tabs-container">
          <button
            className={`tab-button ${activeTab === 'Daily' ? 'active' : ''}`}
            onClick={() => setActiveTab('Daily')}
          >
            Daily
          </button>
          <button
            className={`tab-button ${activeTab === 'Main' ? 'active' : ''}`}
            onClick={() => setActiveTab('Main')}
          >
            Main
          </button>
        </div>
        
        <div className="tasks-list">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className="task-item"
              onClick={() => navigateToTaskPage(task)}
            >
              <Globe className="task-icon" />
              <div className="task-info">
                <p className="task-name">{task.name}</p>
                <p className="task-value">{task.value}</p>
              </div>
              <div className="task-arrow">
                <svg className="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
      <FooterMenu />
    </div>
  );
};

export default TasksPage;