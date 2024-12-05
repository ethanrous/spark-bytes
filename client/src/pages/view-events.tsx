// client/src/pages/view-events.tsx
import { EventApi } from '@/api/eventApi';
import { EventInfo } from '@/api/swag';
import { Card, Col, Layout, Row, Typography, } from 'antd';
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
	// Placeholder events array for layout skeleton
	const events = [
		{ id: 1, title: 'Event 1', date: 'Dec 5, 2024', description: 'Event 1 description' },
		{ id: 2, title: 'Event 2', date: 'Dec 6, 2024', description: 'Event 2 description' },
		{ id: 3, title: 'Event 3', date: 'Dec 7, 2024', description: 'Event 3 description' },
		{ id: 4, title: 'Event 4', date: 'Dec 8, 2024', description: 'Event 4 description' },
	];

	const [eventsList, setEventsList] = useState<EventInfo[]>([]);

	// useEffect(() => {
	//   EventApi.getEvents()
	//   .then(response => setEventsList(response.data))
	// }, []);

	//sorting by earliest first - thanks ChatGPT
	useEffect(() => {
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
			})
	}, []);

	return (
		<>
			<Header />
			<Layout style={{ minHeight: '100vh', backgroundColor: themeConfig.colors.background }}>

				<Layout.Content style={{ padding: '20px 40px', marginLeft: '0px', marginRight: '0px' }}>
					<Title level={1} style={{ fontFamily: themeConfig.typography.fontFamily, color: themeConfig.colors.textPrimary }}>
						View Events
					</Title>

					<Row gutter={[16, 16]}>
						{eventsList.length > 0 ? (
							eventsList.map((event) => (
								<Col key={event.eventId} xs={24} sm={12} md={8} lg={6}>
									<Card
										// hoverable
										title={
											<div style={{ textAlign: "center" }}>
												{event.name} @ {event.location}
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
												<span style={{ backgroundColor: "#D3D3D3", padding: "5px", borderRadius: "8px" }}>{event.dietaryInfo}</span>
											</p>
										)}

										<div>
											<p style={{ display: 'inline' }}> Starts: </p>
											<p style={{ fontWeight: 'bold', color: themeConfig.colors.primary, display: 'inline' }}>
												{formatDate(new Date(event.startTime ?? ""))}
											</p>
										</div>

										<div>
											<p style={{ display: 'inline' }}> Ends: </p>
											<p style={{ fontWeight: 'bold', color: themeConfig.colors.primary, display: 'inline' }}>
												{formatDate(new Date(event.endTime ?? ""))}
											</p>
										</div>

										<p style={{ marginTop: "10px" }}>Description</p>
										<p style={{ fontWeight: 'bold', color: themeConfig.colors.primary }}>
											{event.description}
										</p>
									</Card>
								</Col>
							))
						) : (
							<p style={{ color: themeConfig.colors.textSecondary }}>
								No events available.
							</p>
						)}
					</Row>
				</Layout.Content>

			</Layout>
			<Footer />
		</>
	);
};

export default ViewEvents;
