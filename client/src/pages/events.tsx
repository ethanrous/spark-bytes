// events.tsx
import React, { useState, useEffect } from "react";
import { Layout, Input, Card, Row, Col } from "antd";
import Header from "@/components/Header";

const { Content } = Layout;

const EventsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("events") || "[]");
    setEvents(storedEvents);
  }, []);

  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.food.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <Header />
      <Content style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        <Input.Search
          placeholder="Search events..."
          enterButton="Search"
          size="large"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: "20px" }}
        />
        <Row gutter={[16, 16]}>
          {filteredEvents.map((event, index) => (
            <Col span={8} key={index}>
              <Card
                title={event.name}
                bordered={true}
                style={{
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  padding: "16px",
                  backgroundColor: "#f9f9f9",
                  height: "auto", // Allow cards to grow dynamically
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <p>
                  <strong>Date:</strong> {event.date}
                </p>
                <p>
                  <strong>Time:</strong> {event.time}
                </p>
                <p>
                  <strong>Location:</strong> {event.location}
                </p>
                <p>
                  <strong>Food:</strong> {event.food}
                </p>
                <p>
                  <strong>People:</strong> {event.people}
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  );
};

export default EventsPage;
