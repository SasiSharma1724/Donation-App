import React, { useState, useEffect } from 'react';
import { Form, Input, Button, List, DatePicker, Card, Layout, Typography, Row, Col, Select, Modal } from 'antd';
import { MinusCircleOutlined, EditOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Header, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

function DonationApp() {
  const [donations, setDonations] = useState([]);
  const [editingDonation, setEditingDonation] = useState(null);
  const [form] = Form.useForm();
  const [filterType, setFilterType] = useState('all');
  const [visible, setVisible] = useState(false);

  // Effect hook to reset form when editing donation changes
  useEffect(() => {
    if (editingDonation !== null) {
      form.setFieldsValue({
        ...editingDonation,
        date: moment(editingDonation.date),
      });
      setVisible(true);
    } else {
      form.resetFields();
      setVisible(false);
    }
  }, [editingDonation, form]);

  // Function to handle form submission for both adding and updating donations
  const handleSubmit = (values) => {
    if (editingDonation) {
      // Update logic for existing donation
      updateDonation(values);
    } else {
      // Add logic for new donation
      setDonations([...donations, { ...values, id: donations.length, date: values['date'].format('YYYY-MM-DD') }]);
      form.resetFields(); 
    }
    setEditingDonation(null); // Reset editing after submission
  };

  // Function to set a donation for editing
  const editDonation = (donation) => {
    setEditingDonation(donation);
  };

  // Function to update a donation in the list
  const updateDonation = (values) => {
    const updatedDonations = donations.map((donation) => {
      if (donation.id === editingDonation.id) {
        return { ...donation, ...values, date: values['date'].format('YYYY-MM-DD') };
      }
      return donation;
    });
    setDonations(updatedDonations);
    setEditingDonation(null); // Reset editing donation state
  };

  // Function to delete a donation from the list
  const deleteDonation = (id) => {
    setDonations(donations.filter((donation) => donation.id !== id));
  };

  // Function to handle donation type filtering
  const handleFilterChange = (value) => {
    setFilterType(value);
  };

  // Get filtered list based on the type of donation selected
  const filteredDonations = filterType === 'all' ? donations : donations.filter((donation) => donation.type === filterType);

  // Calculate statistics for the currently filtered donation types
  const totalOfType = filteredDonations.reduce((acc, donation) => acc + Number(donation.amount), 0);

  // Render a modal for editing donations
  const renderEditModal = () => (
    <Modal
      title="Edit Donation"
      visible={visible}
      onOk={() => form.submit()}
      onCancel={() => setEditingDonation(null)}
      okText="Update"
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item name="donorName" rules={[{ required: true, message: "Please input donor's name!" }]}>
          <Input placeholder="Donor's Name" />
        </Form.Item>
        <Form.Item name="type" rules={[{ required: true, message: 'Please input type of donation!' }]}>
          <Input placeholder="Type of Donation" />
        </Form.Item>
        <Form.Item name="amount" rules={[{ required: true, message: 'Please input amount donated!' }]}>
          <Input placeholder="Amount Donated" type="number" />
        </Form.Item>
        <Form.Item name="date" rules={[{ required: true, message: 'Please select date of donation!' }]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );

  // Main render
  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#1890ff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Title level={2} style={{ color: '#fff' }}>
          Donation App
        </Title>
      </Header>
      <Content style={{ padding: '50px', maxWidth: '700px', margin: 'auto' }}>
        <Row justify="center" gutter={16}>
          <Col xs={24} lg={16}>
            <Card>
            <Form form={form} onFinish={handleSubmit} layout="vertical">
                <Title level={4}>Add a New Donation</Title>
                {/* Form fields with validation */}
                <Form.Item name="donorName" rules={[{ required: true, message: "Please input donor's name!" }]}>
                  <Input placeholder="Donor's Name" />
                </Form.Item>
                <Form.Item name="type" rules={[{ required: true, message: 'Please input type of donation!' }]}>
                  <Input placeholder="Type of Donation" />
                </Form.Item>
                <Form.Item name="amount" rules={[{ required: true, message: 'Please input amount donated!' }]}>
                  <Input placeholder="Amount Donated" type="number" />
                </Form.Item>
                <Form.Item name="date" rules={[{ required: true, message: 'Please select date of donation!' }]}>
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                    Add Donation
                  </Button>
                </Form.Item>
              </Form>
            </Card>
            <Card>
              <Title level={4}>Filter Donations</Title>
              <Select defaultValue="all" style={{ width: '100%' }} onChange={handleFilterChange}>
                <Option value="all">All</Option>
                <Option value="money">Money</Option>
                <Option value="food">Food</Option>
                <Option value="clothing">Clothing</Option>
              </Select>
            </Card>
            <List
              header={<Title level={4}>Donation List</Title>}
              bordered
              dataSource={filteredDonations}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <EditOutlined onClick={() => editDonation(item)} style={{ color: 'blue', fontSize: '16px' }} />,
                    <MinusCircleOutlined onClick={() => deleteDonation(item.id)} style={{ color: 'red', fontSize: '16px' }} />,
                  ]}
                >
                  <List.Item.Meta
                    title={item.donorName}
                    description={`Donated ${item.amount} as ${item.type} on ${item.date}`}
                  />
                </List.Item>
              )}
            />
            {renderEditModal()}
          </Col>
          <Col xs={24} lg={8}>
            <Card>
              <Title level={4}>Donation Statistics</Title>
              <p><strong>Total of Type ({filterType}):</strong> {totalOfType.toFixed(2)}</p>
              <p><strong>Number of Donations:</strong> {filteredDonations.length}</p>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default DonationApp;
