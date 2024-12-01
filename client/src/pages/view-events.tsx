// client/src/pages/view-events.tsx
import { Layout, Row, Col, Card, Typography } from 'antd';
import Header from '../components/Header';
import Footer from '../components/Footer';
import themeConfig from '../theme/themeConfig';

const { Title } = Typography;

const ViewEvents = () => {
  // Placeholder events array for layout skeleton
  const events = [
    { id: 1, title: 'Event 1', date: 'Dec 5, 2024', description: 'Event 1 description' },
    { id: 2, title: 'Event 2', date: 'Dec 6, 2024', description: 'Event 2 description' },
    { id: 3, title: 'Event 3', date: 'Dec 7, 2024', description: 'Event 3 description' },
    { id: 4, title: 'Event 4', date: 'Dec 8, 2024', description: 'Event 4 description' },
  ];

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: themeConfig.colors.background }}>
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <Layout.Content style={{ padding: '20px 40px', marginLeft: '0px', marginRight: '0px' }}>
        {/* Title */}
        <Title level={1} style={{ fontFamily: themeConfig.typography.fontFamily, color: themeConfig.colors.textPrimary }}>
          View Events
        </Title>

        {/* Event Cards */}
        <Row gutter={[16, 16]}>
          {events.length > 0 ? (
            events.map((event) => (
              <Col key={event.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  title={event.title}
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease',
                  }}
                >
                  <p style={{ fontWeight: 'bold', color: themeConfig.colors.primary }}>
                    {event.date}
                  </p>
                  <p style={{ marginTop: '10px', color: themeConfig.colors.textPrimary }}>
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

      {/* Footer */}
      <Footer />
    </Layout>
  );
};

export default ViewEvents;
