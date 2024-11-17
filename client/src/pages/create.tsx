// client\src\pages\create.tsx
import { Button, Input } from 'antd';

const CreateEvent: React.FC = () => {
  return (
    <div style={{ padding: '50px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Create an Event</h1>
      <Input placeholder="Event Name" style={{ marginBottom: '20px' }} />
      <Input.TextArea placeholder="Event Description" rows={4} style={{ marginBottom: '20px' }} />
      <Input placeholder="Location" style={{ marginBottom: '20px' }} />
      <Button type="primary" style={{ width: '100%' }}>
        Create Event
      </Button>
    </div>
  );
};

export default CreateEvent;
