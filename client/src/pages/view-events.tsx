// client/src/pages/view-events.tsx
import { Layout, Row, Col, Card, Typography, Divider } from 'antd';
import Header from '../components/Header';
import Footer from '../components/Footer';
import themeConfig from '../theme/themeConfig';
import { EventApi } from '@/api/eventApi';
import { useEffect, useState } from 'react';

const { Title } = Typography;

const ViewEvents = () => {
  // Placeholder events array for layout skeleton
  const events = [
    { id: 1, title: 'Event 1', date: 'Dec 5, 2024', description: 'Event 1 description' },
    { id: 2, title: 'Event 2', date: 'Dec 6, 2024', description: 'Event 2 description' },
    { id: 3, title: 'Event 3', date: 'Dec 7, 2024', description: 'Event 3 description' },
    { id: 4, title: 'Event 4', date: 'Dec 8, 2024', description: 'Event 4 description' },
  ];

  const formatDate = (date:string) => {
    const eventDate = new Date(date);
    return(eventDate.toLocaleString('en-US', 
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

  const [eventsList, setEventsList] = useState([]);

  // useEffect(() => {
  //   EventApi.getEvents()
  //   .then(response => setEventsList(response.data))
  // }, []);

  //sorting by earliest first - thanks ChatGPT
  useEffect(() => {
    EventApi.getEvents()
    .then(response => {
      let data = (response.data);
      data = data.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
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
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Card
                    // hoverable
                    title={
                      <div style={{textAlign: "center"}}>
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
                    {(event.dietary_info).length > 0 ? (
                      <p style={{marginBottom:"16px", textAlign: "center"}}>
                        <span style={{backgroundColor: "#D3D3D3", padding:"5px", borderRadius: "8px"}}>{event.dietary_info}</span>
                      </p>
                    ) : (
                      <></>
                    )}

                    <div>
                      <p style={ {display: 'inline' }}> Starts: </p>
                      <p style={{ fontWeight: 'bold', color: themeConfig.colors.primary, display: 'inline' }}>
                        {formatDate(event.start_time)}
                      </p>
                    </div>

                    <div>
                      <p style={ {display: 'inline' }}> Ends: </p>
                      <p style={{ fontWeight: 'bold', color: themeConfig.colors.primary, display: 'inline' }}>
                        {formatDate(event.end_time)}
                      </p>
                    </div>

                    <p style={{marginTop: "10px"}}>Description</p>
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
