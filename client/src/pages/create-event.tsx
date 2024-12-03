import React, { useState } from "react";
import { Form, Input, DatePicker, TimePicker, InputNumber, Button } from "antd";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import themeConfig from "@/theme/themeConfig";
import { start } from "repl";

const CreateEventPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState();
  const [location, setLocation] = useState();
  const [description, setDescription] = useState();
  const [dietary_info, setDietaryInfo] = useState();
  const [start_time, setStartTime] = useState();
  const [end_time, setEndTime] = useState();
  const [attendees, setAttendees] = useState();

  const handleSubmit = async (values: any) => {
    console.log('Creating event with: ', name, location, description, dietary_info, start_time, end_time, attendees);
    setLoading(true);

    try {
      // const res = await EventApi.createEvent( { } )
      alert()
    } catch (err) {
      console.error('Error creating event: ', err);
    } finally {
      setLoading(false);
      form.resetFields();
    }
    // setLoading(true);
    // try {
    //   const storedEvents = JSON.parse(localStorage.getItem("events") || "[]");
    //   const updatedEvents = [...storedEvents, values];
    //   localStorage.setItem("events", JSON.stringify(updatedEvents));
    //   form.resetFields();
    // } catch (error) {
    //   console.error("Error saving event:", error);
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div style={{ ...styles.layout, backgroundColor: themeConfig.colors.background }}>
      <Header />
      <div style={styles.content}>
        <div style={styles.container}>
          {/* Left Side: Form */}
          <div style={styles.formSection}>
            <h1 style={{ ...styles.title, color: themeConfig.colors.textPrimary }}>Create an Event</h1>
            <Form form={form} layout="vertical" onFinish={handleSubmit} style={styles.form}>
              <Form.Item
                label="Event Name"
                name="name"
                rules={[{ required: true, message: "Event name is required" }]}>
                <Input placeholder="Enter event name" style={styles.input} 
                onChange={(e) => setName(e.target.value)}/>
              </Form.Item>

              <Form.Item
                label="Location"
                name="location"
                rules={[{ required: true, message: "Location is required" }]}>
                <Input placeholder="640 Comm Ave, CAS B26, etc." style={styles.input}
                onChange={(e) => setLocation(e.target.value)} />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: "Description is required" }]}>
                <Input.TextArea rows={4} placeholder="Available food, highlights, activities, etc." style={styles.textarea}
                onChange={(e) => setDescription(e.target.value)} />
              </Form.Item>

              <Form.Item
                label="Dietary Info"
                name="dietary_info"
                rules={[{ required: true, message: "Dietary information is required" }]}>
                <Input placeholder="Vegetarian, Gluten-Free, Vegan, etc." style={styles.input}
                onChange={(e) => setDietaryInfo(e.target.value)} />
              </Form.Item>

              {/* <Form.Item
                label="Date of Event"
                name="date"
                rules={[{ required: true, message: "Date is required" }]}>
                <DatePicker style={styles.input} />
              </Form.Item> */}

              <div style={styles.timeRow}>
                <Form.Item
                  label="Start Time"
                  name="start_time"
                  rules={[{ required: true, message: "Start time is required" }]}>
                  <TimePicker use12Hours format="h:mm a" style={styles.input}
                  onChange={(e) => setStartTime(e)} />
                </Form.Item>

                <Form.Item
                  label="End Time"
                  name="end_time"
                  rules={[{ required: true, message: "End time is required" }]}>
                  <TimePicker use12Hours format="h:mm a" style={styles.input}
                  onChange={(e) => setEndTime(e)} />
                </Form.Item>
              </div>

              <Form.Item
                label="Number of Attendees"
                name="capacity"
                rules={[{ required: true, message: "Capacity is required" }]}>
                <InputNumber min={1} style={styles.input} 
                onChange={(e) => setAttendees(e)}/>
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
        <Footer />
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  layout: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  content: {
    flex: 1,
    padding: "0",
    marginTop: "0",
  },
  container: {
    display: "flex",
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
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "auto",
  },
  imageSection: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    minHeight: "100%",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "600",
    color: themeConfig.colors.textPrimary,
    marginBottom: "20px",
    textAlign: "center",
    fontFamily: themeConfig.typography.fontFamily,
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
    fontFamily: themeConfig.typography.fontFamily,
  },
  textarea: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "15px",
    minHeight: "100px",
    fontFamily: themeConfig.typography.fontFamily,
  },
  timeRow: {
    display: "flex",
    gap: "15px",
    marginBottom: "15px",
  },
  button: {
    padding: "12px 20px",
    backgroundColor: themeConfig.colors.accent,
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "bold",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    fontFamily: themeConfig.typography.fontFamily,
  },
  buttonHover: {
    backgroundColor: "#ff7a00",
  },
  image: {
    width: "100%",
    height: "auto",
    objectFit: "cover",
    borderRadius: "8px",
  },
};

export default CreateEventPage;
