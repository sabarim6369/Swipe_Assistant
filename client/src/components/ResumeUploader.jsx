import React, { useState, useCallback } from "react";
import {
  Upload,
  Button,
  Card,
  Form,
  Input,
  Tag,
  Space,
  Alert,
  Spin,
} from "antd";
import {
  InboxOutlined,
  FileTextOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { parseResume, validateResumeData } from "../utils/resumeParser";
import { addCandidate } from "../redux/candidateSlice";

const { Dragger } = Upload;
const { TextArea } = Input;

const ResumeUploader = ({ onComplete }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [parseError, setParseError] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);

  const handleFileUpload = useCallback(
    async (file) => {
      setLoading(true);
      setParseError(null);

      try {
        const data = await parseResume(file);
        setParsedData(data);

        form.setFieldsValue({
          name: data.name,
          email: data.email,
          phone: data.phone,
          experience: data.experience,
          skills: data.skills.join(", "),
        });

        setFileUploaded(true);
      } catch (error) {
        setParseError(error.message);
      } finally {
        setLoading(false);
      }

      return false;
    },
    [form]
  );

  const handleSubmit = async (values) => {
    try {
      const validation = validateResumeData(values);

      if (!validation.isValid) {
        validation.errors.forEach((error) => {
          console.error(error);
        });
        return;
      }

      const candidateData = {
        ...values,
        skills: values.skills
          ? values.skills
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s)
          : [],
        resumeData: parsedData,
        uploadedAt: new Date().toISOString(),
      };

      dispatch(addCandidate(candidateData));

      if (onComplete) {
        onComplete(candidateData);
      }
    } catch (error) {
      console.error("Error creating candidate:", error);
    }
  };

  const uploadProps = {
    name: "resume",
    multiple: false,
    accept: ".pdf,.docx",
    showUploadList: false,
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        await handleFileUpload(file);
        onSuccess("ok");
      } catch (error) {
        onError(error);
      }
    },
  };

  return (
    <div className="max-w-6xl mx-auto p-6 animate-slide-in-up">
      {/* Enhanced Header Section */}
      <div className="text-center mb-12 animate-float">
        <div className="relative inline-block">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25"></div>
          <div className="relative w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <FileTextOutlined className="text-3xl text-white" />
          </div>
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Welcome to InterVue AI
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Start your AI-powered interview journey by uploading your resume. Our intelligent system will analyze your profile and create personalized questions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Enhanced Upload Card */}
        <div className="relative animate-slide-in-left">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25"></div>
          <Card
            className="relative bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-2xl overflow-hidden card-hover"
            bodyStyle={{ padding: '2rem' }}
          >
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <FileTextOutlined className="text-white text-lg" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Resume Upload</h3>
              </div>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
            </div>

            <div className="relative">
              <Dragger
                {...uploadProps}
                className={`border-2 border-dashed rounded-xl transition-all duration-300 ${
                  fileUploaded 
                    ? "border-green-400 bg-gradient-to-br from-green-50 to-emerald-50" 
                    : "border-gray-300 hover:border-blue-400 bg-gradient-to-br from-blue-50/50 to-purple-50/50"
                }`}
                disabled={loading}
                style={{ padding: '3rem 2rem' }}
              >
                <div className="text-center">
                  <div className="mb-6">
                    {loading ? (
                      <div className="relative">
                        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center animate-pulse">
                          <Spin className="text-white" />
                        </div>
                      </div>
                    ) : fileUploaded ? (
                      <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                        <FileTextOutlined className="text-3xl text-white" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <InboxOutlined className="text-3xl text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-xl font-semibold text-gray-800">
                      {loading
                        ? "Analyzing your resume..."
                        : fileUploaded 
                        ? "Resume uploaded successfully!"
                        : "Upload your resume"}
                    </h4>
                    <p className="text-gray-600">
                      {loading
                        ? "AI is extracting information from your resume"
                        : "Drag & drop your PDF or DOCX file here, or click to browse"}
                    </p>
                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        PDF supported
                      </span>
                      <span className="flex items-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                        DOCX supported
                      </span>
                    </div>
                  </div>
                </div>
              </Dragger>

              {loading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="relative mx-auto w-16 h-16 mb-4">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-spin"></div>
                      <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                        <FileTextOutlined className="text-blue-500" />
                      </div>
                    </div>
                    <p className="text-gray-600 font-medium">Processing your resume...</p>
                  </div>
                </div>
              )}
            </div>

            {parseError && (
              <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">!</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-800 mb-1">Parsing Error</h4>
                    <p className="text-red-700 text-sm">{parseError}</p>
                  </div>
                </div>
              </div>
            )}

            {parsedData && (
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800 mb-1">Resume Parsed Successfully!</h4>
                    <p className="text-green-700 text-sm">Your information has been extracted and populated in the form. Please review and proceed.</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Enhanced Form Card */}
        <div className="relative animate-slide-in-right">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25"></div>
          <Card
            className="relative bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-2xl overflow-hidden card-hover"
            bodyStyle={{ padding: '2rem' }}
          >
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <UserOutlined className="text-white text-lg" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Personal Information</h3>
              </div>
              <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"></div>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-6">
                <Form.Item
                  label={<span className="text-gray-700 font-medium">Full Name</span>}
                  name="name"
                  rules={[
                    { required: true, message: "Please enter your full name" },
                    { min: 2, message: "Name must be at least 2 characters" },
                  ]}
                >
                  <Input
                    placeholder="Enter your full name"
                    prefix={<UserOutlined className="text-gray-400" />}
                    size="large"
                    className="rounded-xl border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors"
                    style={{ padding: '12px 16px', fontSize: '16px' }}
                  />
                </Form.Item>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Form.Item
                    label={<span className="text-gray-700 font-medium">Email Address</span>}
                    name="email"
                    rules={[
                      { required: true, message: "Please enter your email" },
                      { type: "email", message: "Please enter a valid email" },
                    ]}
                  >
                    <Input
                      placeholder="your.email@domain.com"
                      prefix={<MailOutlined className="text-gray-400" />}
                      size="large"
                      className="rounded-xl border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors"
                      style={{ padding: '12px 16px', fontSize: '16px' }}
                    />
                  </Form.Item>

                  <Form.Item
                    label={<span className="text-gray-700 font-medium">Phone Number</span>}
                    name="phone"
                    rules={[
                      { required: true, message: "Please enter your phone number" },
                      { min: 10, message: "Please enter a valid phone number" },
                    ]}
                  >
                    <Input
                      placeholder="+1 (555) 123-4567"
                      prefix={<PhoneOutlined className="text-gray-400" />}
                      size="large"
                      className="rounded-xl border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors"
                      style={{ padding: '12px 16px', fontSize: '16px' }}
                    />
                  </Form.Item>
                </div>

                <Form.Item 
                  label={<span className="text-gray-700 font-medium">Years of Experience</span>} 
                  name="experience"
                >
                  <Input 
                    placeholder="e.g., 3 years, 5+ years, Fresh Graduate" 
                    size="large"
                    className="rounded-xl border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors"
                    style={{ padding: '12px 16px', fontSize: '16px' }}
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="text-gray-700 font-medium">Skills & Technologies</span>}
                  name="skills"
                  help={<span className="text-gray-500">Separate multiple skills with commas</span>}
                >
                  <TextArea
                    placeholder="e.g., React, Node.js, JavaScript, Python, AWS, Docker"
                    rows={4}
                    size="large"
                    className="rounded-xl border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors resize-none"
                    style={{ padding: '12px 16px', fontSize: '16px' }}
                  />
                </Form.Item>
              </div>

              <div className="pt-4">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  disabled={!fileUploaded}
                  className={`w-full h-14 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 btn-gradient ${
                    fileUploaded 
                      ? "border-0 hover:shadow-xl hover:scale-105 animate-glow" 
                      : "bg-gray-400 border-0 cursor-not-allowed opacity-60"
                  }`}
                  icon={<UserOutlined />}
                >
                  {fileUploaded ? "🚀 Start My Interview Journey" : "📄 Please upload your resume first"}
                </Button>
                
                {!fileUploaded && (
                  <p className="text-center text-gray-500 text-sm mt-3">
                    Upload your resume to enable the interview process
                  </p>
                )}
              </div>
            </Form>
          </Card>
        </div>
      </div>

      {/* Enhanced Skills Section */}
      {parsedData?.skills && parsedData.skills.length > 0 && (
        <div className="mt-10">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-2xl blur opacity-25"></div>
            <Card 
              className="relative bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-2xl overflow-hidden"
              bodyStyle={{ padding: '2rem' }}
            >
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">🎯</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Detected Skills</h3>
                </div>
                <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-full"></div>
                <p className="text-gray-600 mt-3">Our AI has identified these skills from your resume:</p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {parsedData.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl px-4 py-3 text-center transition-all duration-300 hover:shadow-md hover:scale-105"
                  >
                    <span className="text-blue-700 font-medium text-sm">{skill}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
                <div className="flex items-center space-x-2 text-amber-800">
                  <span className="text-lg">💡</span>
                  <span className="font-medium text-sm">
                    These skills will be used to generate personalized interview questions for you.
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUploader;
