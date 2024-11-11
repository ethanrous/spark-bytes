// pages/index.tsx
import React, { useEffect, useState } from "react";
import Link from "next/link"; // Import Next.js Link
import { Layout, Button, Input, Space, Row, Col } from "antd";
import {
  InstagramOutlined,
  TwitterOutlined,
  FacebookOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import SearchID from "@/components/SearchID";
import theme from "@/theme/themeConfig";

const { Header, Footer, Content } = Layout;

export default function Home() {
  const [name, setName] = useState("");

  // Fetch data from the API route in hello.ts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/hello");
        const data = await response.json();
        setName(data.name);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      {/* Navigation Bar */}
      <Header
        style={{
          backgroundColor: theme.token.colorPrimary,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
          Spark! Bytes
        </div>
        <Space size="large">
          <Button type="link" style={{ color: "white" }}>
            About
          </Button>
          <Button type="link" style={{ color: "white" }}>
            Create Events
          </Button>
          <Button type="link" style={{ color: "white" }}>
            Sign Up
          </Button>
          <Link href="/login" passHref> {/* Link to the login page */}
            <Button type="link" style={{ color: "white" }}>
              Log In
            </Button>
          </Link>

        </Space>
      </Header>

      {/* Content Area */}
      <Content style={{ padding: "20px", textAlign: "center", minHeight: "70vh" }}>
        <Row justify="center" align="middle" style={{ marginTop: "20px" }}>
          <Col>
            {/* Find Events Search Button */}
            <Input.Search
              placeholder="Find Events"
              enterButton
              size="large"
              style={{ maxWidth: "400px", fontSize: theme.token.fontSize }}
            />
          </Col>
        </Row>
        {/* Display fetched name from API */}
        <div style={{ marginTop: "20px", fontSize: "18px" }}>
          <p>Welcome, {name || "Guest"}!</p>
        </div>
      </Content>

      {/* Footer Area */}
      <Footer style={{ backgroundColor: "#f6f6f6", textAlign: "center" }}>
        <Row justify="center" style={{ padding: "20px 0" }}>
          <Col span={24} style={{ textAlign: "center" }}>
            <Space size="middle">
              <InstagramOutlined style={{ fontSize: "24px", color: "#000" }} />
              <TwitterOutlined style={{ fontSize: "24px", color: "#000" }} />
              <FacebookOutlined style={{ fontSize: "24px", color: "#000" }} />
              <LinkOutlined style={{ fontSize: "24px", color: "#000" }} />
            </Space>
          </Col>
        </Row>
        <div style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}>
          Copyright © 2023 Spark!, All rights reserved.
        </div>
        <div style={{ fontSize: "14px", color: "#666" }}>
          Want to change how you receive these emails?
          <br />
          You can{" "}
          <a href="#" style={{ color: theme.token.colorPrimary }}>
            update your preferences
          </a>{" "}
          or{" "}
          <a href="#" style={{ color: theme.token.colorPrimary }}>
            unsubscribe from this list
          </a>
          .
        </div>
      </Footer>
    </Layout>
  );
}