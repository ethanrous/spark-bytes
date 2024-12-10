// client/src/pages/view-events.tsx
import { EventApi } from '@/api/eventApi';
import { EventInfo } from '@/api/swag';
import { Card, Col, Row, Typography, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import themeConfig from '../theme/themeConfig';

import { Button } from "antd";
import { useRouter } from 'next/navigation';

const { Title } = Typography;

const formatDate = (date: Date) => {
	return (date.toLocaleString('en-US',
		{
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit',
			timeZoneName: 'short',
		}
	))
}

function getSortedEvents(events: EventInfo[], sortBy: string, direction: number): EventInfo[] {
	switch (sortBy) {
		case "start-date":
			return events.sort((a, b) => {
				return (a.startTime - b.startTime) * direction;
			});

		default:
			console.error('Invalid sort type:', sortBy);
			return events;
	}
}

enum SortByT {
	NAME = "Name",
	START_DATE = "Start Date",
	END_DATE = "End Date",
	EVENT_LOCATION = "Event Location",
}

const ViewEvents = () => {
	const router = useRouter();
	const [eventsMap, setEventsMap] = useState<Map<number, EventInfo>>(new Map());
	const [sortBy, setSortBy] = useState<SortByT>(SortByT.NAME);
	const [sortDirection, setSortDirection] = useState(1);

	const getUser = () => {
		if (typeof window !== 'undefined') {
			const user = localStorage.getItem('user');
			return user ? JSON.parse(user) : null;
		}
		return null;
	};
	const user = getUser();

	useEffect(() => {
		EventApi.getEvents()
			.then((response) => {
				const events = new Map<number, EventInfo>();
				console.log('Events:', response.data);
				for (const e of response.data) {
					if (!e.eventId) {
						console.error('Event ID is missing');
						continue;
					}
					events.set(e.eventId, e);
				}
				setEventsMap(events);
			})
			.catch((err) => console.error("Error fetching events:", err));
	}, []);


	const registerForEvent = async (eventId: number) => {
		if (!user) {
			alert('Please log in to register for events.');
			return;
		}

		try {
			await EventApi.reserveEvent(eventId);
			const event = eventsMap.get(eventId);
			if (!event) {
				console.error('Event not found');
				return
			}
			event.registeredCount++
			event.reservationIds.push(user.id);
			eventsMap.set(eventId, event);

			setEventsMap(new Map(eventsMap));

		} catch (err) {
			console.error('Error registering for event:', err);
		}
	};

	const items: MenuProps['items'] = [
		{
			label: SortByT.NAME,
			key: SortByT.NAME,
			onClick: () => {
				setSortBy(SortByT.NAME);
			}
		},
		// {
		// 	label: "Dietary Info First",
		// 	key: "dietary-info-first",
		// 	onClick: () => {
		// 		EventApi.getEvents()
		// 			.then(response => {
		// 				let data = response.data;
		// 				data = data.sort((a, b) => {
		// 					if (a.dietaryInfo && !b.dietaryInfo) {
		// 						return -1
		// 					}
		// 					if (!a.dietaryInfo && b.dietaryInfo) {
		// 						return 1
		// 					}
		// 					return 0;
		// 				});
		// 				setEventsMap(data);
		// 			});
		// 		setSortBy("Dietary Info First");
		// 	}
		// },
		{
			label: SortByT.START_DATE,
			key: SortByT.START_DATE,
			onClick: () => {
				setSortBy(SortByT.START_DATE)
			}
		},
		{
			label: SortByT.END_DATE,
			key: SortByT.END_DATE,
			onClick: () => {
				setSortBy(SortByT.END_DATE)
			}
		},
		{
			label: SortByT.EVENT_LOCATION,
			key: SortByT.EVENT_LOCATION,
			onClick: () => {
				setSortBy(SortByT.EVENT_LOCATION)
			}
		},
	];

	const toggleReservation = async (eventId: number, isReserved: boolean) => {
		if (!user.loggedIn) {
			router.push('/login');
			return;
		}

		try {
			if (isReserved) {
				// Unreserve the event
				await EventApi.removeReservationFromUser(eventId);
				const event = eventsMap.get(eventId);
				if (!event) {
					console.error('Event not found');
					return
				}
				event.registeredCount--
				event.reservationIds = event.reservationIds.filter(id => id !== user.id);
				eventsMap.set(eventId, event);

				setEventsMap(new Map(eventsMap));
			} else {
				registerForEvent(eventId);
			}
		} catch (err) {
			console.error('Error toggling reservation:', err);
		}
	};

	const eventsList = useMemo(() => {
		if (!eventsMap) {
			return [];
		}
		const eventsList = Array.from(eventsMap.values())
		return getSortedEvents(eventsList, sortBy, sortDirection)
	}, [eventsMap])


	return (
		<>
			<Header />

			<div style={{ padding: '20px 40px' }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<Title level={1} style={{ fontFamily: themeConfig.typography.fontFamily, color: themeConfig.colors.textPrimary, display: 'inline' }}>
						View Events
					</Title>
					<Dropdown menu={{ items }} trigger={['click']}>
						<span onClick={(e) => e.preventDefault()} style={{ backgroundColor: "#ffffff", padding: "5px", borderRadius: "8px", outline: "2px solid #CCCCCC" }}
							onMouseEnter={(e) => { (e.target as HTMLSpanElement).style.backgroundColor = "#f8f8f8" }}
							onMouseLeave={(e) => { (e.target as HTMLSpanElement).style.backgroundColor = "#ffffff" }} >
							Sort by: {sortBy}
							<DownOutlined style={{ marginLeft: "5px" }} />
						</span>
					</Dropdown>

					<Button onClick={() => { setSortDirection(d => d * -1) }}>{sortDirection == 1 ? "Up" : "Down"}</Button>
				</div>

				<Row gutter={[16, 16]}>
					{eventsList.length > 0 && (
						eventsList.map((event) => {
							if (!event || event.registeredCount === undefined || event.capacity === undefined || event.eventId === undefined) {
								console.error('Event is missing or malformed');
								return null;
							}

							return (
								<Col key={event.eventId} xs={24} sm={12} md={8} lg={6}>
									<Card
										title={
											<div style={{ textAlign: "center" }}>
												{event.name} <br /> <i style={{ fontWeight: 'normal' }}> {event.location} </i>
											</div>
										}
										style={{
											backgroundColor: '#fff',
											borderRadius: '8px',
											boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
											transition: 'transform 0.3s ease',
											maxHeight: '300px',
											overflow: 'auto'
										}}
									>
										{event.dietaryInfo && (
											<p style={{ marginBottom: "16px", textAlign: "center" }}>
												<span style={{ backgroundColor: "#A8D5BA", padding: "5px", borderRadius: "8px" }}>{event.dietaryInfo}</span>
											</p>
										)}

										<div>
											<p style={{ display: 'inline', fontWeight: 'bold', color: themeConfig.colors.primary }}> Starts: </p>
											<p style={{ display: 'inline' }}>
												{formatDate(new Date(event.startTime ?? ""))}
											</p>
										</div>

										<div>
											<p style={{ display: 'inline', fontWeight: 'bold', color: themeConfig.colors.primary }}> Ends: </p>
											<p style={{ display: 'inline' }}>
												{formatDate(new Date(event.endTime ?? ""))}
											</p>
										</div>

										<br />
										<p> {event.description} </p>
										<div style={{ textAlign: "center", marginTop: "10px" }}>
											<Button
												type="primary"
												disabled={event.registeredCount >= event.capacity}
												onClick={() => registerForEvent(event.eventId)}
											>
												{event.registeredCount >= event.capacity ? 'Full' : 'Register'}
											</Button>
										</div>
										<div style={{ marginTop: "10px", textAlign: "center" }}>
											<p>
												<strong>Attendees:</strong> {event.registeredCount} / {event.capacity}
											</p>
										</div>
										<Button
											type="primary"
											onClick={() => {
												if (!event.eventId) {
													console.error('Event ID is missing');
													return
												}

												toggleReservation(
													event.eventId,
													event.reservationIds.includes(user.id) // Check if the user has already reserved
												)
											}
											}
										>
											{event.reservationIds.includes(user.id) ? 'Unreserve' : 'Reserve'}
										</Button>
									</Card>
								</Col>
							)
						}))}
				</Row>
			</div >

			<Footer />
		</>
	);
};

export default ViewEvents;
