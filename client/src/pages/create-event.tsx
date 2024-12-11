import { EventApi } from "@/api/eventApi";
import { EventInfo } from "@/api/swag";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useSessionStore } from "@/state/session";
import themeConfig from "@/theme/themeConfig";
import { Button, Form, Input, InputNumber, TimePicker } from "antd";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, FC } from "react";

const CreateEventPage: FC = () => {
	const router = useRouter();
	const user = useSessionStore(state => state.user)
	const params = useSearchParams();

	const [form] = Form.useForm();
	const [editingEvent, setEditingEvent] = useState<EventInfo | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [name, setName] = useState<string>();
	const [location, setLocation] = useState<string>();
	const [description, setDescription] = useState<string>();
	const [dietary_info, setDietaryInfo] = useState<string>();
	const [start_time, setStartTime] = useState<Date>();
	const [end_time, setEndTime] = useState<Date>();
	const [capacity, setCapacity] = useState<number>(0);

	useEffect(() => {
		if (!user?.loggedIn) {
			router.push("/login?redirect=create-event");
		}
	}, [router, user]);

	const editEventId = Number(params.get("editEventId"));

	useEffect(() => {
		if (editEventId) {
			EventApi.getEvent(editEventId).then((response) => {
				setEditingEvent(response.data);
				form.setFieldsValue({
					...response.data,
					start_time: new Date(response.data.startTime ?? 0),
					end_time: new Date(response.data.endTime ?? 0),
				});
			});
		}
	}, [editEventId, form]);

	const handleSubmit = async () => {
		console.log('Creating or updating event with:', name, location, description, dietary_info, start_time, end_time, capacity);
		setLoading(true);

		if (!start_time || !end_time) {
			setLoading(false);
			return;
		}

		if (editingEvent) {
			// Modify existing event
			EventApi.modifyEvent(editingEvent.eventId, {
				name,
				location,
				description,
				dietary_info,
				start_time: start_time.getTime(),
				end_time: end_time.getTime(),
				capacity: capacity,
			})
				.then(() => {
					setLoading(false);
					router.push('/view-events'); // Redirect to view events page
				})
				.catch((err: Error) => {
					console.error('Error modifying event:', err);
					setLoading(false);
				});
			return;
		}

		EventApi.createEvent({
			end_time: end_time?.getTime(),
			start_time: start_time?.getTime(),
			description,
			dietary_info,
			location,
			name,
			capacity
		})
			.then(() => setLoading(false))
			.catch((err) => {
				console.error('Error creating event:', err);
				setLoading(false);
			});
	};

	useEffect(() => {
		if (!user) {
			return
		}
		if (!user.loggedIn) {
			router.push('/login')
		}
	}, [user, router]);

	if (!user || !user.loggedIn) {
		return null
	}

	return (
		<div style={{ ...styles.layout, backgroundColor: themeConfig.colors.background }}>
			<Header />
			<div style={styles.content}>
				<div style={styles.container}>

					<div style={styles.formSection}>
						<h1 style={{ ...styles.title, color: themeConfig.colors.textPrimary }}>Create an Event</h1>
						<Form form={form} layout="vertical" onFinish={handleSubmit} style={styles.form}>
							<Form.Item
								label="Event Name"
								name="name"
								rules={[{ required: true, message: "Event name is required" }]}>
								<Input placeholder="Enter event name" style={styles.input}
									onChange={(e) => setName(e.target.value)}
								/>
							</Form.Item>

							<Form.Item
								label="Location"
								name="location"
								rules={[{ required: true, message: "Location is required" }]}>
								<Input placeholder="640 Comm Ave, CAS B26, etc." style={styles.input}
									onChange={(e) => setLocation(e.target.value)}
								/>
							</Form.Item>

							<Form.Item
								label="Description"
								name="description"
								rules={[{ required: true, message: "Description is required" }]}>
								<Input.TextArea rows={4} placeholder="Available food, highlights, activities, etc." style={styles.textarea}
									onChange={(e) => setDescription(e.target.value)}
								/>
							</Form.Item>

							<Form.Item
								label="Dietary Info"
								name="dietary_info">
								{/* rules={[{ required: true, message: "Dietary information is required" }]}> */}
								<Input placeholder="Vegetarian, Gluten-Free, Vegan, etc." style={styles.input}
									onChange={(e) => setDietaryInfo(e.target.value)}
								/>
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
										onChange={(e) => setStartTime(e.toDate())} />
								</Form.Item>

								<Form.Item
									label="End Time"
									name="end_time"
									rules={[{ required: true, message: "End time is required" }]}>
									<TimePicker use12Hours format="h:mm a" style={styles.input}
										onChange={(e) => setEndTime(e.toDate())} />
								</Form.Item>
							</div>

							<Form.Item
								label="Number of Attendees"
								name="capacity"
								rules={[{ required: true, message: "Capacity is required" }]}>
								<InputNumber min={1} style={styles.input}
									onChange={(e) => {
										if (e) {
											setCapacity(e)
										}
									}}
								/>
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
						<Image
							src="/assets/IMG_990.jpeg"
							alt={"Event Illustration"}
							fill={true}
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
		objectFit: "cover",
		borderRadius: "8px",
	},
};

export default CreateEventPage;
