// index.tsx
import React, { useEffect, useState } from "react";
import { Layout, Input, Row, Col } from "antd";
import Header from "@/components/Header";

const { Content } = Layout;

const Home: React.FC = () => {
  const [name, setName] = useState("");

  useEffect(() => {
    // Fetch data from the API route
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
      <Header />
      <Content style={{ padding: "20px", textAlign: "center" }}>
        <Row justify="center" align="middle" style={{ marginTop: "20px" }}>
          <Col>
            <Input.Search
              placeholder="Find Events"
              enterButton
              size="large"
              style={{ maxWidth: "400px" }}
            />
          </Col>
        </Row>
        <div style={{ marginTop: "20px", fontSize: "18px" }}>
          <p>Welcome, {name || "Guest"}!</p>
        </div>
      </Content>
    </Layout>
  );
};

export default Home;
