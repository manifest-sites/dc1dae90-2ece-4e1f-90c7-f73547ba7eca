import { useState, useEffect } from 'react'
import { Card, Button, Modal, Form, Input, Select, InputNumber, Switch, Space, Row, Col, Typography, Divider, Tag } from 'antd'
import { PlusOutlined, HeartOutlined, HeartFilled, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Llama } from '../entities/Llama'

const { Title, Text, Paragraph } = Typography
const { Option } = Select

function LlamaApp() {
  const [llamas, setLlamas] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingLlama, setEditingLlama] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    loadLlamas()
  }, [])

  const loadLlamas = async () => {
    try {
      const response = await Llama.list()
      if (response.success) {
        setLlamas(response.data || [])
      }
    } catch (error) {
      console.error('Error loading llamas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (values) => {
    try {
      if (editingLlama) {
        await Llama.update(editingLlama._id, values)
      } else {
        await Llama.create(values)
      }
      setModalVisible(false)
      setEditingLlama(null)
      form.resetFields()
      loadLlamas()
    } catch (error) {
      console.error('Error saving llama:', error)
    }
  }

  const handleEdit = (llama) => {
    setEditingLlama(llama)
    form.setFieldsValue(llama)
    setModalVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      // Note: Delete functionality would need to be implemented in the backend
      console.log('Delete llama:', id)
      loadLlamas()
    } catch (error) {
      console.error('Error deleting llama:', error)
    }
  }

  const toggleFavorite = async (llama) => {
    try {
      await Llama.update(llama._id, { ...llama, isFavorite: !llama.isFavorite })
      loadLlamas()
    } catch (error) {
      console.error('Error updating favorite:', error)
    }
  }

  const llamaBreeds = [
    'Classic Llama',
    'Suri Llama',
    'Wooly Llama',
    'Silky Llama',
    'Huacaya Llama'
  ]

  const temperaments = [
    'Gentle',
    'Playful',
    'Calm',
    'Energetic',
    'Friendly',
    'Independent',
    'Curious'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Title level={1} className="text-4xl md:text-6xl mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Llama World
          </Title>
          <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
            Welcome to the amazing world of llamas! Discover, manage, and learn about these wonderful animals.
          </Paragraph>
        </div>

        {/* Quick Facts Section */}
        <div className="mb-8">
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <Title level={3} className="text-center mb-4">🌟 Did You Know?</Title>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <div className="text-center p-4">
                  <div className="text-3xl mb-2">🚫</div>
                  <Text strong>Llamas don't spit at humans unless they feel threatened!</Text>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="text-center p-4">
                  <div className="text-3xl mb-2">🏔️</div>
                  <Text strong>They can carry 25-30% of their body weight in the mountains!</Text>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="text-center p-4">
                  <div className="text-3xl mb-2">👥</div>
                  <Text strong>Llamas are social animals and prefer living in herds!</Text>
                </div>
              </Col>
            </Row>
          </Card>
        </div>

        {/* Action Button */}
        <div className="mb-6 text-center">
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingLlama(null)
              form.resetFields()
              setModalVisible(true)
            }}
            className="bg-gradient-to-r from-green-500 to-blue-500 border-0 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Add New Llama
          </Button>
        </div>

        {/* Llamas Grid */}
        <Row gutter={[16, 16]}>
          {llamas.map((llama) => (
            <Col xs={24} sm={12} lg={8} xl={6} key={llama._id}>
              <Card
                hoverable
                className="h-full shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm"
                cover={
                  llama.imageUrl ? (
                    <div className="h-48 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                      <img
                        src={llama.imageUrl}
                        alt={llama.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.parentNode.innerHTML = '<div class="text-6xl">🦙</div>'
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center text-6xl">
                      🦙
                    </div>
                  )
                }
                actions={[
                  <Button
                    type="text"
                    icon={llama.isFavorite ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                    onClick={() => toggleFavorite(llama)}
                  />,
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(llama)}
                  />,
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(llama._id)}
                    danger
                  />
                ]}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Title level={4} className="mb-0">{llama.name}</Title>
                    {llama.isFavorite && <HeartFilled style={{ color: '#ff4d4f' }} />}
                  </div>
                  
                  <div className="space-y-1">
                    <Tag color="blue">{llama.breed}</Tag>
                    <Tag color="green">{llama.color}</Tag>
                  </div>
                  
                  {llama.age && <Text type="secondary">Age: {llama.age} years</Text>}
                  {llama.temperament && (
                    <div>
                      <Tag color="purple">{llama.temperament}</Tag>
                    </div>
                  )}
                  
                  {llama.funFact && (
                    <Paragraph ellipsis={{ rows: 2 }} className="text-sm text-gray-600 mt-2">
                      💡 {llama.funFact}
                    </Paragraph>
                  )}
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {llamas.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-8xl mb-4">🦙</div>
            <Title level={3} type="secondary">No llamas yet!</Title>
            <Paragraph type="secondary">Add your first llama to get started.</Paragraph>
          </div>
        )}

        {/* Add/Edit Modal */}
        <Modal
          title={editingLlama ? "Edit Llama" : "Add New Llama"}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false)
            setEditingLlama(null)
            form.resetFields()
          }}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            className="mt-4"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[{ required: true, message: 'Please enter a name' }]}
                >
                  <Input placeholder="Enter llama name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="breed"
                  label="Breed"
                  rules={[{ required: true, message: 'Please select a breed' }]}
                >
                  <Select placeholder="Select breed">
                    {llamaBreeds.map(breed => (
                      <Option key={breed} value={breed}>{breed}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="color"
                  label="Color"
                  rules={[{ required: true, message: 'Please enter a color' }]}
                >
                  <Input placeholder="Enter primary color" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="temperament"
                  label="Temperament"
                >
                  <Select placeholder="Select temperament">
                    {temperaments.map(temp => (
                      <Option key={temp} value={temp}>{temp}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="age"
                  label="Age (years)"
                >
                  <InputNumber min={0} max={30} placeholder="Age" className="w-full" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="weight"
                  label="Weight (lbs)"
                >
                  <InputNumber min={0} max={500} placeholder="Weight" className="w-full" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="imageUrl"
              label="Image URL"
            >
              <Input placeholder="Enter image URL (optional)" />
            </Form.Item>

            <Form.Item
              name="funFact"
              label="Fun Fact"
            >
              <Input.TextArea 
                placeholder="Enter an interesting fact about this llama" 
                rows={3}
              />
            </Form.Item>

            <Form.Item
              name="isFavorite"
              valuePropName="checked"
            >
              <Switch checkedChildren="Favorite" unCheckedChildren="Regular" />
            </Form.Item>

            <Form.Item className="mb-0 text-right">
              <Space>
                <Button onClick={() => setModalVisible(false)}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingLlama ? "Update" : "Add"} Llama
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  )
}

export default LlamaApp