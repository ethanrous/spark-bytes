import React, { useEffect, useState } from 'react';
import { EventApi } from '@/api/eventApi';
import { EventInfo } from '@/api/swag';
import { Card, Button, Input, Row, Col, DatePicker } from 'antd';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useRouter } from 'next/router';
import { useSessionStore } from '@/state/session';
import { nsToHumanTime } from '@/util/time';
import dayjs from "dayjs";

const { TextArea } = Input;

const MyEvents = () => {
	const [createdEvents, setCreatedEvents] = useState<EventInfo[]>([]);
	const user = useSessionStore((state) => state.user);

	const router = useRouter();

	useEffect(() => {
		if (!user) {
			router.push("/login");
			return;
		}

		// Fetch created events
		EventApi.getOwnEvent()
			.then((response) => setCreatedEvents(response.data))
			.catch((err) => console.error("Error fetching created events:", err));
	}, [router]);

	const editEvent = async (eventId: number, updatedEvent: EventInfo) => {
		try {
			await EventApi.modifyEvent(eventId, updatedEvent);
			const updatedCreatedEvents = createdEvents.map((event) =>
				event.eventId === eventId ? { ...event, ...updatedEvent } : event
			);
			setCreatedEvents(updatedCreatedEvents);
			alert("Event modified successfully!");
		} catch (err) {
			console.error("Error modifying event:", err);
			alert("Failed to modify the event. Please try again.");
		}
	};

	return (
		<>
			<Header />
			<div style={{ padding: "20px 40px" }}>
				<h1>My Events</h1>

				{/* Created Events Section */}
				<h2>Events I Created</h2>
				<Row gutter={[16, 16]}>
					{createdEvents.map((event) => (
						<Col key={event.eventId} xs={24} sm={12} md={8} lg={6}>
							<Card
								title={
									<Input
										value={event.name}
										onChange={(e) =>
											setCreatedEvents((prev) =>
												prev.map((ev) =>
													ev.eventId === event.eventId
														? { ...ev, name: e.target.value }
														: ev
												)
											)
										}
										placeholder="Event Name"
									/>
								}
							>
								<p>
									<strong>Start:</strong>{" "}
									<DatePicker
										value={dayjs(new Date(event.startTime))}
										onChange={(date) => {
											setCreatedEvents((prev) => {
												const i = prev.findIndex(
													(ev) => ev.eventId === event.eventId
												);
												prev[i].endTime = date.valueOf();
												return [...prev];
											});
										}}
									/>
								</p>
								<p>
									<strong>End:</strong>{" "}
									<DatePicker
										value={dayjs(new Date(event.endTime))}
										onChange={(date) => {
											setCreatedEvents((prev) => {
												const i = prev.findIndex(
													(ev) => ev.eventId === event.eventId
												);
												prev[i].endTime = date.valueOf();
												return [...prev];
											});
										}}
									/>
								</p>
								<p>
									<TextArea
										value={event.description}
										onChange={(e) =>
											setCreatedEvents((prev) =>
												prev.map((ev) =>
													ev.eventId === event.eventId
														? { ...ev, description: e.target.value }
														: ev
												)
											)
										}
										placeholder="Event Description"
									/>
								</p>
								<Button
									type="primary"
									onClick={() =>
										editEvent(event.eventId, {
											...event,
											startTime: new Date(event.startTime).getTime(),
											endTime: new Date(event.endTime).getTime(),
										})
									}
								>
									Save Changes
								</Button>
							</Card>
						</Col>
					))}
				</Row>
			</div>
			<Footer />
		</>
	);
};

export default MyEvents;
