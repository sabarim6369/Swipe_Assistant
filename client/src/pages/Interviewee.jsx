import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Button, Result, Space } from 'antd';
import { UserOutlined, FileTextOutlined, PlayCircleOutlined, StarOutlined, RocketOutlined, CheckCircleOutlined } from '@ant-design/icons';
import ResumeUploader from '../components/ResumeUploader';
import ChatWindow from '../components/ChatWindow';
import WelcomeBackModal from '../components/WelcomeBackModal';
import { startInterview, setCurrentInterview } from '../redux/interviewSlice';
import { setCurrentCandidate, clearCurrentCandidate } from '../redux/candidateSlice';
import { generateQuestions } from '../api/aiService';

const Interviewee = () => {
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState('upload'); 
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

  const { currentCandidate } = useSelector(state => state.candidates);
  const { currentInterview, interviews } = useSelector(state => state.interviews);

  useEffect(() => {
    
    const hasIncompleteInterview = Object.values(interviews).find(
      interview => interview.status === 'in_progress'
    );

    if (hasIncompleteInterview) {
      const candidate = JSON.parse(localStorage.getItem('candidates') || '[]')
        .find(c => c.id === hasIncompleteInterview.candidateId);
      
      if (candidate) {
        setShowWelcomeBack(true);
      }
    }
  }, [interviews]);

  const handleResumeComplete = async (candidateData) => {
    setCurrentStep('interview');
    await startInterviewProcess();
  };

  const startInterviewProcess = async () => {
    if (!currentCandidate) return;

    setIsGeneratingQuestions(true);
    try {
      const questions = await generateQuestions();
      dispatch(startInterview({
        candidateId: currentCandidate.id,
        questions
      }));
    } catch (error) {
      console.error('Error starting interview:', error);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const handleInterviewComplete = (results) => {
    setCurrentStep('completed');
  };

  const handleWelcomeBackResume = () => {
    const incompleteInterview = Object.values(interviews).find(
      interview => interview.status === 'in_progress'
    );
    
    if (incompleteInterview) {
      dispatch(setCurrentInterview(incompleteInterview.id));
      const candidate = JSON.parse(localStorage.getItem('candidates') || '[]')
        .find(c => c.id === incompleteInterview.candidateId);
      
      if (candidate) {
        dispatch(setCurrentCandidate(candidate));
        setCurrentStep('interview');
      }
    }
    setShowWelcomeBack(false);
  };

  const handleStartNew = () => {
    dispatch(clearCurrentCandidate());
    setCurrentStep('upload');
    setShowWelcomeBack(false);
  };

  const handleStartOver = () => {
    dispatch(clearCurrentCandidate());
    setCurrentStep('upload');
  };

  const renderContent = () => {
    switch (currentStep) {
      case 'upload':
        return <ResumeUploader onComplete={handleResumeComplete} />;
      
      case 'interview':
        if (isGeneratingQuestions) {
          return (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="relative">
                {/* Animated background circles */}
                <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-30 animate-pulse delay-300"></div>
                
                <Card className="text-center p-12 shadow-2xl border-0 bg-white/80 backdrop-blur-sm min-w-[400px]">
                  <div className="mb-8">
                    {/* Enhanced spinning animation */}
                    <div className="relative mx-auto w-20 h-20">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-spin"></div>
                      <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                        <RocketOutlined className="text-2xl text-blue-500" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    Generating Interview Questions
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    AI is preparing personalized questions based on your profile...
                  </p>
                  <div className="mt-6 flex justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </Card>
              </div>
            </div>
          );
        }
        return <ChatWindow onComplete={handleInterviewComplete} />;
      
      case 'completed':
        return (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-2xl mx-auto">
              {/* Success animation container */}
              <div className="relative mb-8">
                <div className="w-32 h-32 mx-auto relative">
                  {/* Animated success circle */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse"></div>
                  <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                    <CheckCircleOutlined className="text-5xl text-green-500" />
                  </div>
                  {/* Floating particles */}
                  <div className="absolute -top-4 -right-4 w-4 h-4 bg-yellow-400 rounded-full animate-bounce"></div>
                  <div className="absolute -bottom-2 -left-6 w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-300"></div>
                  <div className="absolute top-6 -left-8 w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-500"></div>
                </div>
              </div>

              {/* Enhanced success content */}
              <div className="space-y-6 mb-12">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  🎉 Interview Completed Successfully!
                </h1>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100">
                  <p className="text-xl text-gray-700 mb-4">
                    Thank you for completing the interview, <span className="font-semibold text-blue-600">{currentCandidate?.name}</span>!
                  </p>
                  <p className="text-gray-600 mb-6">
                    Your responses have been recorded and will be reviewed by our team.
                  </p>
                  
                  {currentCandidate?.finalScore && (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                      <div className="flex items-center justify-center space-x-3">
                        <StarOutlined className="text-yellow-500 text-2xl" />
                        <span className="text-2xl font-bold text-gray-700">Your Score:</span>
                        <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {currentCandidate.finalScore}/10
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced action button */}
              <Button 
                type="primary" 
                size="large"
                onClick={handleStartOver}
                className="h-14 px-12 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 border-0 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                icon={<RocketOutlined />}
              >
                Start New Interview
              </Button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Enhanced Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-gradient-to-r from-indigo-300/10 to-cyan-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-green-400/15 to-emerald-400/15 rounded-full blur-2xl animate-pulse delay-700"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-r from-rose-400/15 to-pink-400/15 rounded-full blur-2xl animate-pulse delay-1200"></div>
      </div>

      {/* Enhanced Header */}
      <div className="relative z-10 bg-white/90 backdrop-blur-xl shadow-xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-5">
              {/* Enhanced logo with animation */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                <div className="relative w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition duration-300">
                  <UserOutlined className="text-white text-xl" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  InterVue AI
                </h1>
                <p className="text-sm text-gray-500 font-medium flex items-center space-x-2">
                  <span>🚀</span>
                  <span>Next-Generation Interview Platform</span>
                </p>
              </div>
            </div>
            
            {/* Enhanced user welcome */}
            <div className="flex items-center space-x-4">
              {currentCandidate && (
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 border border-gray-200/50 shadow-lg">
                    <Space align="center">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
                          <span className="text-white font-bold text-sm">
                            {currentCandidate.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Welcome back,</div>
                        <div className="font-bold text-gray-800">{currentCandidate.name}</div>
                      </div>
                    </Space>
                  </div>
                </div>
              )}
              
              {!currentCandidate && (
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-4 border border-gray-200/50 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                      <UserOutlined className="text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Ready to start?</div>
                      <div className="font-semibold text-gray-700">Upload your resume</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Progress indicator */}
          {currentStep !== 'upload' && (
            <div className="mt-8">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                  {/* Step 1 - Resume Upload */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      currentStep === 'upload' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                    }`}>
                      <FileTextOutlined className="text-lg" />
                      {currentStep !== 'upload' && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white">
                          <CheckCircleOutlined className="text-white text-xs" />
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <div className={`font-semibold text-sm ${currentStep === 'upload' ? 'text-blue-600' : 'text-green-600'}`}>
                        Resume Upload
                      </div>
                      <div className="text-xs text-gray-500">Step 1</div>
                    </div>
                  </div>

                  {/* Connector 1 */}
                  <div className="flex-1 mx-4">
                    <div className={`h-2 rounded-full transition-all duration-500 ${
                      currentStep !== 'upload' ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gray-200'
                    }`}>
                      {currentStep !== 'upload' && (
                        <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </div>

                  {/* Step 2 - Interview */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      currentStep === 'interview' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg animate-pulse' : 
                      currentStep === 'completed' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg' : 
                      'bg-gray-200 text-gray-400'
                    }`}>
                      <PlayCircleOutlined className="text-lg" />
                      {currentStep === 'completed' && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white">
                          <CheckCircleOutlined className="text-white text-xs" />
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <div className={`font-semibold text-sm ${
                        currentStep === 'interview' ? 'text-blue-600' : 
                        currentStep === 'completed' ? 'text-green-600' : 
                        'text-gray-400'
                      }`}>
                        Interview
                      </div>
                      <div className="text-xs text-gray-500">Step 2</div>
                    </div>
                  </div>

                  {/* Connector 2 */}
                  <div className="flex-1 mx-4">
                    <div className={`h-2 rounded-full transition-all duration-500 ${
                      currentStep === 'completed' ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gray-200'
                    }`}>
                      {currentStep === 'completed' && (
                        <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </div>

                  {/* Step 3 - Complete */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      currentStep === 'completed' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg animate-bounce' : 'bg-gray-200 text-gray-400'
                    }`}>
                      <CheckCircleOutlined className="text-lg" />
                    </div>
                    <div className="text-center">
                      <div className={`font-semibold text-sm ${currentStep === 'completed' ? 'text-green-600' : 'text-gray-400'}`}>
                        Complete
                      </div>
                      <div className="text-xs text-gray-500">Step 3</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Content Area */}
      <div className="relative z-10 py-8">
        <div className="max-w-6xl mx-auto px-6">
          {renderContent()}
        </div>
      </div>

      {/* Modal with preserved functionality */}
      <WelcomeBackModal
        visible={showWelcomeBack}
        candidate={currentCandidate}
        interview={currentInterview}
        onResume={handleWelcomeBackResume}
        onStartNew={handleStartNew}
        onCancel={() => setShowWelcomeBack(false)}
      />
    </div>
  );
};

export default Interviewee;