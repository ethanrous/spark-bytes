// client/src/pages/view-events.tsx
import { EventApi } from '@/api/eventApi';
import { EventInfo } from '@/api/swag';
import { Card, Col, Row, Typography, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import themeConfig from '../theme/themeConfig';

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

const ViewEvents = () => {
	const [defaultSortList, setDefaultSortList] = useState<EventInfo[]>([]);
	const [eventsList, setEventsList] = useState<EventInfo[]>([]);
	const [sortBy, setSortBy] = useState("Default");

	useEffect(() => {
		EventApi.getEvents()
		.then(response => 
			{
				setEventsList(response.data);
				setDefaultSortList(response.data);
			}
		)
	}, []);

	const items: MenuProps['items'] = [
		{
			label: "Default",
			key: "default",
			onClick: () => {
				setEventsList(defaultSortList);
				setSortBy("Default");
			}
		},
		{
			label: "Dietary Info First",
			key: "dietary-info-first",
			onClick: () => {
				EventApi.getEvents()
				.then(response => {
					let data = response.data;
						data = data.sort((a, b) => {
							if (a.dietaryInfo && !b.dietaryInfo) {
								return -1
							}
							if (!a.dietaryInfo && b.dietaryInfo) {
								return 1
							}
							return 0;
							});
					setEventsList(data);
				});
				setSortBy("Dietary Info First");
			}
		},
		{
			label: "Start Date (Earliest to Latest)",
			key: "start-date-earliest-latest",
			onClick: () => {
				EventApi.getEvents()
				.then(response => {
					let data = (response.data);
					data = data.sort((a, b) => {
						if (!a.startTime || !b.startTime) {
							throw new Error('Event start time is missing');
						}
						return a.startTime - b.startTime
					});
					setEventsList(data);
				});
				setSortBy("Start Date (Earliest to Latest)");
			}
		},
		{
			label: "Start Date (Latest to Earliest)",
			key: "start-date-latest-earliest",
			onClick: () => {
				EventApi.getEvents()
				.then(response => {
					let data = (response.data);
					data = data.sort((a, b) => {
						if (!a.startTime || !b.startTime) {
							throw new Error('Event start time is missing');
						}
						return b.startTime - a.startTime
					});
					setEventsList(data);
				});
				setSortBy("Start Date (Latest to Earliest)");
			}
		},
		{
			label: "End Date (Earliest to Latest)",
			key: "end-date-earliest-latest",
			onClick: () => {
				EventApi.getEvents()
				.then(response => {
					let data = (response.data);
					data = data.sort((a, b) => {
						if (!a.endTime || !b.endTime) {
							throw new Error('Event start time is missing');
						}
						return a.endTime - b.endTime
					});
					setEventsList(data);
				});
				setSortBy("End Date (Earliest to Latest)");
			}
		},
		{
			label: "End Date (Latest to Earliest)",
			key: "end-date-latest-earliest",
			onClick: () => {
				EventApi.getEvents()
				.then(response => {
					let data = (response.data);
					data = data.sort((a, b) => {
						if (!a.endTime || !b.endTime) {
							throw new Error('Event start time is missing');
						}
						return b.endTime - a.endTime
					});
					setEventsList(data);
				});
				setSortBy("End Date (Latest to Earliest)");
			}
		},
		{
			label: "Alphabetical (Name)",
			key: "alphabetical-event-name",
			onClick: () => {
				EventApi.getEvents()
				.then(response => {
					let data = response.data;
					data = data.sort((a, b) => {
					if (!a.name || !b.name) {
						throw new Error('Event name is missing');
					}
					return a.name.localeCompare(b.name);
					});
					setEventsList(data);
				});
				setSortBy("Alphabetical (Name)");
			}
		},
		{
			label: "Alphabetical (Location)",
			key: "alphabetical-event-location",
			onClick: () => {
				EventApi.getEvents()
				.then(response => {
					let data = response.data;
					data = data.sort((a, b) => {
					if (!a.location || !b.location) {
						throw new Error('Event name is missing');
					}
					return a.location.localeCompare(b.location);
					});
					setEventsList(data);
				});
				setSortBy("Alphabetical (Location)");
			}
		},
	];

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
							onMouseEnter={(e) => {
								const target = e.target as HTMLSpanElement;
								target.style.backgroundColor = "#f8f8f8";
							}}
							onMouseLeave={(e) => {
								const target = e.target as HTMLSpanElement;
								target.style.backgroundColor = "#ffffff";
							}} >
							Sort by: {sortBy}
							<DownOutlined style={{marginLeft:"5px"}}/>
						</span>
					</Dropdown>
				</div>

				<Row gutter={[16, 16]}>
					{eventsList.length > 0 ? (
						eventsList.map((event) => (
							<Col key={event.eventId} xs={24} sm={12} md={8} lg={6}>
								<Card
									title={
										<div style={{ textAlign: "center" }}>
											{event.name} <br/> <i style={{fontWeight:'normal'}}> {event.location} </i>
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
										<p style={{ display: 'inline', fontWeight: 'bold', color: themeConfig.colors.primary, }}> Starts: </p>
										<p style={{ display: 'inline' }}>
											{formatDate(new Date(event.startTime ?? ""))}
										</p>
									</div>

									<div>
									<p style={{ display: 'inline', fontWeight: 'bold', color: themeConfig.colors.primary, }}> Ends: </p>
									<p style={{ display: 'inline' }}>
											{formatDate(new Date(event.endTime ?? ""))}
										</p>
									</div>

									<br/>
									<p> {event.description} </p>
								</Card>
							</Col>
						))
					) : (
						<p style={{ color: themeConfig.colors.textSecondary }}>
							No events available.
						</p>
					)}
				</Row>
			</div>

			<Footer />
		</>
	);
};

export default ViewEvents;
