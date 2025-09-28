import React from 'react';
import { Modal, Button, Typography, Space, Tag } from 'antd';
import { UserOutlined, ClockCircleOutlined, TrophyOutlined, PlayCircleOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const WelcomeBackModal = ({ visible, candidate, interview, onResume, onStartNew, onCancel }) => {
  if (!candidate || !interview) return null;

  const progress = interview.currentQuestionIndex || 0;
  const totalQuestions = interview.questions?.length || 0;
  const progressPercent = totalQuestions > 0 ? Math.round((progress / totalQuestions) * 100) : 0;

  return (
    <Modal
      open={visible}
      title={null}
      footer={null}
      onCancel={onCancel}
      width={600}
      centered
      className="welcome-back-modal"
      maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)' }}
      style={{ top: 20 }}
    >
      <div className="relative p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl">
        {/* Decorative elements */}
        <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-xl"></div>
        
        <div className="text-center relative z-10">
          {/* Enhanced header */}
          <div className="mb-8">
            <div className="relative mx-auto mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-pulse">
                <UserOutlined className="text-3xl text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-3 border-white flex items-center justify-center animate-bounce">
                <span className="text-white text-xs">👋</span>
              </div>
            </div>
            <Title level={2} className="mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back!
            </Title>
            <Text className="text-lg text-gray-600">
              We found your incomplete interview session
            </Text>
          </div>

          {/* Enhanced candidate info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8 border border-blue-100">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">
                    {candidate.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-left">
                  <Text strong className="text-xl text-gray-800 block">{candidate.name}</Text>
                  <Text className="text-blue-600 text-sm">{candidate.email}</Text>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white/60 rounded-xl p-3 text-center">
                <ClockCircleOutlined className="text-2xl text-orange-500 mb-2" />
                <Text type="secondary" className="text-sm block">Started</Text>
                <Text strong className="text-sm">
                  {new Date(interview.startedAt).toLocaleDateString()}
                </Text>
              </div>
              
              <div className="bg-white/60 rounded-xl p-3 text-center">
                <TrophyOutlined className="text-2xl text-green-500 mb-2" />
                <Text type="secondary" className="text-sm block">Progress</Text>
                <Text strong className="text-sm">
                  {progress}/{totalQuestions} questions
                </Text>
              </div>
            </div>

            {/* Enhanced progress bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Text className="text-sm font-medium text-gray-700">Interview Progress</Text>
                <Text className="text-sm font-bold text-blue-600">{progressPercent}%</Text>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out relative"
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced action buttons */}
          <div className="space-y-4">
            <Button 
              type="primary" 
              size="large" 
              onClick={onResume}
              className="w-full h-14 rounded-xl font-semibold text-lg bg-gradient-to-r from-blue-500 to-purple-600 border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              icon={<PlayCircleOutlined />}
            >
              🚀 Continue My Interview
            </Button>
            
            <Button 
              size="large" 
              onClick={onStartNew}
              className="w-full h-12 rounded-xl font-medium border-2 border-gray-300 hover:border-blue-400 hover:text-blue-600 transition-all duration-300"
              icon={<PlusOutlined />}
            >
              Start Fresh Interview
            </Button>
            
            <Button 
              type="text" 
              size="large" 
              onClick={onCancel}
              className="w-full h-10 rounded-xl font-medium text-gray-500 hover:text-gray-700 transition-all duration-300"
              icon={<CloseOutlined />}
            >
              Maybe Later
            </Button>
          </div>

          {/* Enhanced footer */}
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-green-600">💾</span>
              <Text className="text-green-700 text-sm font-medium">
                Your progress is automatically saved and secure
              </Text>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default WelcomeBackModal;