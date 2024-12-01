// // client\src\pages\create-event.tsx
// import React, { useState } from "react";
// import { Layout, Form, Input, DatePicker, TimePicker, InputNumber, Button } from "antd";
// import Header from "@/components/Header";

// const { Content } = Layout;

// const CreateEventPage: React.FC = () => {
//   const [form] = Form.useForm();

//   //jude will handle this part once bowen uploads the api routes
//   const handleSubmit = (values: any) => {
//     const storedEvents = JSON.parse(localStorage.getItem("events") || "[]");
//     const updatedEvents = [...storedEvents, values];
//     localStorage.setItem("events", JSON.stringify(updatedEvents));
//     form.resetFields();
//   };

  
//   {/*
//     TODO:
//     -necessary fields (1 field for each, all required except maybe? dietary_info):
//       event name, location, description, dietary_info, start_time, end_time, attendees (capacity)
//     -make visual style consistent with the sign up and log in pages (keep header)
//       -i would prefer it to be the same coding style as well but that is up to you
//       -id also say that start/end time should be in the same line
    
//     */}
//   return (
//     <Layout>
//       <Header />
//       <Content style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
//         <h2>Create an Event</h2>
//         <Form form={form} layout="vertical" onFinish={handleSubmit}>
//           <Form.Item label="Event Name" name="name" rules={[{ required: true }]}>
//             <Input placeholder="Enter event name" />
//           </Form.Item>
//           <Form.Item label="Date" name="date" rules={[{ required: true }]}>
//             <DatePicker style={{ width: "100%" }} />
//           </Form.Item>
//           <Form.Item label="Time" name="time" rules={[{ required: true }]}>
//             <TimePicker style={{ width: "100%" }} />
//           </Form.Item>
//           <Form.Item label="Location" name="location" rules={[{ required: true }]}>
//             <Input placeholder="Enter location" />
//           </Form.Item>
//           <Form.Item label="Food" name="food" rules={[{ required: true }]}>
//             <Input placeholder="Enter food options" />
//           </Form.Item>
//           <Form.Item label="People" name="people" rules={[{ required: true }]}>
//             <InputNumber min={1} style={{ width: "100%" }} />
//           </Form.Item>
//           <Form.Item>
//             <Button type="primary" htmlType="submit">
//               Create Event
//             </Button>
//           </Form.Item>
//         </Form>
//       </Content>
//     </Layout>
//   );
// };

// export default CreateEventPage;

import React, { useState } from "react";
import { Layout, Form, Input, DatePicker, TimePicker, InputNumber, Button } from "antd";
import Header from "@/components/Header";

const { Content } = Layout;

const CreateEventPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const storedEvents = JSON.parse(localStorage.getItem("events") || "[]");
      const updatedEvents = [...storedEvents, values];
      localStorage.setItem("events", JSON.stringify(updatedEvents));
      form.resetFields();
    } catch (error) {
      console.error("Error saving event:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={styles.layout}>
      <Header />
      <Content style={styles.content}>
        <div style={styles.container}>
          {/* Left Side: Form */}
          <div style={styles.formSection}>
            <h1 style={styles.title}>Create an Event</h1>
            <Form form={form} layout="vertical" onFinish={handleSubmit} style={styles.form}>
              <Form.Item
                label="Event Name"
                name="name"
                rules={[{ required: true, message: "Event name is required" }]}
              >
                <Input placeholder="Enter event name" style={styles.input} />
              </Form.Item>

              <Form.Item
                label="Location"
                name="location"
                rules={[{ required: true, message: "Location is required" }]}
              >
                <Input placeholder="Enter event location" style={styles.input} />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: "Description is required" }]}
              >
                <Input.TextArea rows={4} placeholder="Enter event description" style={styles.textarea} />
              </Form.Item>

              <Form.Item
                label="Date of Event"
                name="date"
                rules={[{ required: true, message: "Date is required" }]}
              >
                <DatePicker style={styles.input} />
              </Form.Item>

              <div style={styles.timeRow}>
                <Form.Item
                  label="Start Time"
                  name="start_time"
                  rules={[{ required: true, message: "Start time is required" }]}
                  style={{ flex: 1 }}
                >
                  <TimePicker use12Hours format="h:mm a" style={styles.input} />
                </Form.Item>
                <Form.Item
                  label="End Time"
                  name="end_time"
                  rules={[{ required: true, message: "End time is required" }]}
                  style={{ flex: 1 }}
                >
                  <TimePicker use12Hours format="h:mm a" style={styles.input} />
                </Form.Item>
              </div>

              <Form.Item
                label="Number of Attendees (Capacity)"
                name="capacity"
                rules={[{ required: true, message: "Capacity is required" }]}
              >
                <InputNumber min={1} style={styles.input} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" style={styles.button} loading={loading}>
                  {loading ? "Creating..." : "Create Event"}
                </Button>
              </Form.Item>
            </Form>
          </div>

          {/* Right Side: Image */}
          <div style={styles.imageSection}>
            <img
              src="/assets/IMG_990.jpeg"
              alt="Event Illustration"
              style={styles.image}
            />
          </div>
        </div>
      </Content>
    </Layout>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  layout: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: "0",
    marginTop: "0",
    backgroundColor: "#f5f5f5",
  },
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    gap: "30px",
    height: "100%",
    padding: "20px",
    flexWrap: "wrap",
  },
  formSection: {
    flex: 1,
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    minWidth: "300px",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "600",
    color: "#333",
    marginBottom: "20px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "15px",
    height: "40px",
  },
  textarea: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "15px",
    minHeight: "100px",
  },
  timeRow: {
    display: "flex",
    gap: "15px",
    marginBottom: "15px",
  },
  button: {
    padding: "12px 20px",
    backgroundColor: "#FF9100",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "bold",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  buttonHover: {
    backgroundColor: "#ff7a00",
  },
  imageSection: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    backgroundColor: "#f5f5f5",
    padding: "0 20px",
    marginTop: "20px",
  },
  image: {
    width: "100%",
    height: "auto",
    objectFit: "cover",
    borderRadius: "8px",
  },
};

export default CreateEventPage;
