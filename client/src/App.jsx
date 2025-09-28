import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ConfigProvider, Tabs, Spin } from "antd";
import { UserOutlined, TeamOutlined } from "@ant-design/icons";
import { store, persistor } from "./redux/store";
import Interviewee from "./pages/Interviewee";
import Interviewer from "./pages/Interviewer";
import axios from "axios";

function App() {
  const [apiReady, setApiReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

  const checkApi = async () => {
    try {
      const response = await axios.get(`${API_URL}/health`);
      if (response.status === 200) {
        setApiReady(true);
      }
    } catch (error) {
      // do nothing, keep loader
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkApi();
  }, []);

  const items = [
    {
      key: "interviewee",
      label: (
        <span className="flex items-center space-x-2 px-4 py-2">
          <UserOutlined />
          <span>Interviewee</span>
        </span>
      ),
      children: <Interviewee />,
    },
    {
      key: "interviewer",
      label: (
        <span className="flex items-center space-x-2 px-4 py-2">
          <TeamOutlined />
          <span>Interviewer</span>
        </span>
      ),
      children: <Interviewer />,
    },
  ];

  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <div className="flex items-center justify-center h-screen">
            <Spin size="large" />
          </div>
        }
        persistor={persistor}
      >
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#667eea",
              borderRadius: 12,
              fontSize: 14,
            },
          }}
        >
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
            {/* Enhanced Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-gradient-to-r from-indigo-300/10 to-cyan-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            {!apiReady ? (
              <div className="flex items-center justify-center h-screen relative z-10">
                <div className="text-center">
                  <div className="relative mx-auto w-20 h-20 mb-6">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-spin"></div>
                    <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    InterVue AI
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Waking up server, please wait...
                  </p>
                  <div className="mt-4 flex justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-screen flex flex-col">
                {/* Simple Header */}
                {/* <div className="bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50 relative z-10">
                  <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-center">
                      <div className="flex items-center space-x-4">
                        <div className="relative group">
                          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                          <div className="relative w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-white text-xl font-bold">AI</span>
                          </div>
                        </div>
                        <div>
                          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            InterVue AI
                          </h1>
                          <p className="text-sm text-gray-500 font-medium">
                            🚀 Next-Generation Interview Platform
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}

                {/* Simple Tabs */}
                <Tabs
                  defaultActiveKey="interviewee"
                  centered
                  size="large"
                  className="simple-tabs flex-1"
                  tabBarStyle={{
                    margin: 0,
                    padding: "16px 0",
                    borderBottom: "1px solid #e5e7eb",
                    background: "white",
                  }}
                  items={items}
                />
              </div>
            )}
          </div>
        </ConfigProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;