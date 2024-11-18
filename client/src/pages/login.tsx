import React from "react";
import { Layout, Form, Input, Button, Typography } from "antd";
import Header from "@/components/Header";

const { Content } = Layout;
const { Title } = Typography;

const LoginPage: React.FC = () => {
  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Layout>
      <Header />
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          backgroundColor: "#f6f6f6",
        }}
      >
        <div
          style={{
            maxWidth: "400px",
            width: "100%",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            backgroundColor: "white",
          }}
        >
          <Title level={3} style={{ textAlign: "center", color: "#8bc34a" }}>
            Log In
          </Title>
          <Form
            name="login"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
          >
            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email address!",
                },
              ]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{
                  backgroundColor: "#ff9800",
                  borderColor: "#ff9800",
                  color: "white",
                }}
              >
                Log In
              </Button>
            </Form.Item>
          </Form>
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <a href="/sign-up" style={{ color: "#8bc34a" }}>
              Don’t have an account? Sign Up
            </a>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default LoginPage;
