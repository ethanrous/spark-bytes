// client\src\pages\viewEvents.tsx
import { List } from 'antd';

const events = [
  { id: 1, name: 'Pizza Party', location: 'Student Union' },
  { id: 2, name: 'Leftover Sandwiches', location: 'Library' },
];

const ViewEvents: React.FC = () => {
  return (
    <div style={{ padding: '50px' }}>
      <h1>View Events</h1>
      <List
        dataSource={events}
        renderItem={(event) => (
          <List.Item>
            <h3>{event.name}</h3>
            <p>{event.location}</p>
          </List.Item>
        )}
      />
    </div>
  );
};

export default ViewEvents;
