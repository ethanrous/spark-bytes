// create-event.tsx
import React, { useState } from "react";
import { Layout, Form, Input, DatePicker, TimePicker, InputNumber, Button } from "antd";
import Header from "@/components/Header";

const { Content } = Layout;

const CreateEventPage: React.FC = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    const storedEvents = JSON.parse(localStorage.getItem("events") || "[]");
    const updatedEvents = [...storedEvents, values];
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    form.resetFields();
  };

  return (
    <Layout>
      <Header />
      <Content style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <h2>Create an Event</h2>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Event Name" name="name" rules={[{ required: true }]}>
            <Input placeholder="Enter event name" />
          </Form.Item>
          <Form.Item label="Date" name="date" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Time" name="time" rules={[{ required: true }]}>
            <TimePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Location" name="location" rules={[{ required: true }]}>
            <Input placeholder="Enter location" />
          </Form.Item>
          <Form.Item label="Food" name="food" rules={[{ required: true }]}>
            <Input placeholder="Enter food options" />
          </Form.Item>
          <Form.Item label="People" name="people" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create Event
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
};

export default CreateEventPage;
