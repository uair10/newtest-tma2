import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Check, ExternalLink, Loader } from 'lucide-react';
import './TaskDetailsPage.css';
import FooterMenu from '../FooterMenu/FooterMenu';

interface Task {
  id: number;
  name: string;
  value: string;
  details: string;
}

interface DetailedTask extends Task {
  description: string;
  reward: string;
  steps: TaskStep[];
  maxCompletions: number;
  currentCompletions: number;
}

interface TaskStep {
  text: string;
  isCompleted: boolean;
  date?: string;
  buttonText?: string;
}

const mockApi = {
  fetchTaskDetails: async (taskId: string): Promise<DetailedTask> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: parseInt(taskId),
          name: 'Nuka Cola',
          value: '0.04 DMT',
          details: 'Collect 5 Nuka Cola bottles',
          description: 'Find and collect 5 Nuka Cola bottles scattered around the wasteland.',
          reward: '0.04 DMT',
          steps: [
            { text: 'Subscribe to telegram channel', isCompleted: false },
            { text: 'By at least 400000 WEED', isCompleted: false, date: '21 July', buttonText: 'Start' },
            { text: 'Put 400000 WEED into the TON/WEED pool', isCompleted: false, date: '28 July', buttonText: 'Start' }
          ],
          maxCompletions: 200,
          currentCompletions: 0
        });
      }, 100);
    });
  },
  updateTaskStep: async (taskId: string, stepIndex: number, isCompleted: boolean): Promise<void> => {
    console.log(`Updating task ${taskId}, step ${stepIndex} to ${isCompleted}`);
    return Promise.resolve();
  },
  incrementCompletions: async (taskId: string): Promise<number> => {
    console.log(`Incrementing completions for task ${taskId}`);
    return Promise.resolve(1);
  }
};

const TaskDetailsPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [task, setTask] = useState<DetailedTask | null>(null);
  const [steps, setSteps] = useState<TaskStep[]>([]);
  const [completions, setCompletions] = useState<number>(0);
  const [checkingSubscription, setCheckingSubscription] = useState<boolean>(false);

  useEffect(() => {
    const fetchTask = async () => {
      if (taskId) {
        try {
          const fetchedTask = await mockApi.fetchTaskDetails(taskId);
          setTask(fetchedTask);
          setSteps(fetchedTask.steps);
          setCompletions(fetchedTask.currentCompletions);
        } catch (error) {
          console.error('Error fetching task details:', error);
        }
      }
    };

    fetchTask();
  }, [taskId]);

  const handleStepAction = async (index: number) => {
    if (!task) return;

    const newSteps = [...steps];
    
    switch (index) {
      case 0: // Telegram subscription
        window.open('https://t.me/simon_ian', '_blank');
        setCheckingSubscription(true);
        setTimeout(() => {
          newSteps[index].isCompleted = true;
          setSteps(newSteps);
          setCheckingSubscription(false);
        }, 5000);
        break;
      case 1: // Buy WEED
      case 2: // Put WEED into pool
        newSteps[index].isCompleted = !newSteps[index].isCompleted;
        setSteps(newSteps);
        break;
    }

    try {
      await mockApi.updateTaskStep(task.id.toString(), index, newSteps[index].isCompleted);
      
      // If all steps are completed, increment the completion count
      if (newSteps.every(step => step.isCompleted)) {
        const newCompletions = await mockApi.incrementCompletions(task.id.toString());
        setCompletions(newCompletions);
      }
    } catch (error) {
      console.error('Error updating task step:', error);
    }
  };

  if (!task) {
    return <div>Loading...</div>;
  }

  const isTaskAvailable = completions < task.maxCompletions;

  return (
    <div className="task-details-page">
      <div className="task-details-container">
        <h1 className="task-title">{task.name}</h1>
        <p className="task-description">{task.details}</p>
        
        <div className="task-info">
          <div className="info-item">
            <span className="info-label">Reward:</span>
            <span className="info-value">{task.value}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Completed:</span>
            <span className="info-value">{steps.filter(step => step.isCompleted).length} out of {steps.length}</span>
          </div>
        </div>
        
        <p className="task-note">
          This task has a limited number of winners who will receive a reward
          <br />
          <p className="completions-info">
            {isTaskAvailable 
                ? `${completions} out of ${task.maxCompletions} completed`
                : 'This task is no longer available'}
          </p>
        </p>
        
        <div className="task-steps">
          {steps.map((step: TaskStep, index: number) => (
            <div key={index} className={`step ${step.isCompleted ? 'completed' : ''}`}>
              <div className="step-content">
                <span>{step.text}</span>
                {step.isCompleted ? (
                  <Check size={20} className="check-icon" />
                ) : index === 0 && checkingSubscription ? (
                  <Loader size={20} className="loader-icon" />
                ) : (
                  <button 
                    className="action-button" 
                    onClick={() => handleStepAction(index)}
                    disabled={!isTaskAvailable || (index === 0 && checkingSubscription)}
                  >
                    {index === 0 ? <ExternalLink size={20} /> : step.buttonText}
                  </button>
                )}
              </div>
              {step.date && <div className="step-date">You must hold the token until {step.date} to get the reward.</div>}
            </div>
          ))}
        </div>
      </div>
      <FooterMenu />
    </div>
  );
};

export default TaskDetailsPage;