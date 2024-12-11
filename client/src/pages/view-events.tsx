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
import { useSessionStore } from '@/state/session';
import { useQuery } from '@tanstack/react-query';

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
		case SortByT.START_DATE:
			return events.sort((a, b) => {
				return (a.startTime - b.startTime) * direction;
			});
		case SortByT.END_DATE:
			return events.sort((a, b) => {
				return (a.endTime - b.endTime) * direction;
			});
		case SortByT.NAME:
			return events.sort((a, b) => {
				return a.name.localeCompare(b.name) * direction;
			});
		case SortByT.EVENT_LOCATION:
			return events.sort((a, b) => {
				return a.location.localeCompare(b.location) * direction;
			});

		default:
			console.error('Invalid sort type:', sortBy, SortByT.NAME === sortBy);
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
	const [sortBy, setSortBy] = useState<SortByT>(SortByT.NAME);
	const [sortDirection, setSortDirection] = useState(1);
	const user = useSessionStore(state => state.user);

	const { data: eventsMap, refetch } = useQuery<Map<number, EventInfo>>({
		queryKey: ['remotes'],
		initialData: new Map(),
		queryFn: async () => {
			return EventApi.getEvents()
				.then((response) => {
					const events = new Map<number, EventInfo>();
					for (const e of response.data) {
						if (!e.eventId) {
							console.error('Event ID is missing');
							continue;
						}
						events.set(e.eventId, e);
					}
					return events;
				})
		},
	})

	const registerForEvent = async (eventId: number) => {
		console.log('Registering for event as user:', user);
		if (!user?.loggedIn || user?.id === undefined) {
			console.error('User is not logged in');
			router.push('/login');
			return;
		}

		refetch();
		try {
			await EventApi.reserveEvent(eventId);
			refetch();
		} catch (err) {
			console.error('Error registering for event:', err);
		}
	};

	const unregisterForEvent = async (eventId: number) => {
		console.log('Unregistering for event as user:', user);
		if (!user?.loggedIn || user?.id === undefined) {
			console.error('User is not logged in');
			router.push('/login');
			return;
		}

		try {
			await EventApi.removeReservationFromUser(eventId);
			refetch();
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

	const eventsList = useMemo(() => {
		if (!eventsMap) {
			return [];
		}
		const eventsList = Array.from(eventsMap.values())
		return getSortedEvents(eventsList, sortBy, sortDirection)
	}, [eventsMap, sortBy, sortDirection])

	if (!user || user.id === undefined) {
		console.error('User ID is missing');
		return null
	}

	return (
		<>
			<Header />

			<div style={{ padding: '20px 40px', height: "100%" }}>
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

							if (user.id === undefined) {
								return null
							}

							let reserveButtonText = 'Reserve';
							let registered = false;
							let eventFull = false;
							if (event.reservationIds?.includes(user.id)) {
								registered = true;
								reserveButtonText = 'Unreserve';
							}
							if (event.registeredCount >= event.capacity && !registered) {
								eventFull = true;
								reserveButtonText = 'Full';
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
												disabled={eventFull}
												onClick={() => { if (registered) { unregisterForEvent(event.eventId) } else { registerForEvent(event.eventId) } }}
											>
												{reserveButtonText}
											</Button>
										</div>
										<div style={{ marginTop: "10px", textAlign: "center" }}>
											<p>
												<strong>Attendees:</strong> {event.registeredCount} / {event.capacity}
											</p>
										</div>
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
