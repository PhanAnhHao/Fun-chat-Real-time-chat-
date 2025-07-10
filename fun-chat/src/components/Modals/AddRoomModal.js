import { Form, Input, Modal } from 'antd'
import React, { useContext } from 'react'
import { AppContext } from '../../context/AppProvider'
import { addDocument } from '../../firebase/services';
import { AuthContext } from '../../context/AuthProvider';
import { serverTimestamp } from 'firebase/firestore';

export default function AddRoomModal() {

  const { isAddRoomVisible, setIsAddRoomVisible } = useContext(AppContext);
  const { user: { uid } } = useContext(AuthContext);
  const [form] = Form.useForm();

  const handleOk = () => {
    // handle logic
    // add new room to firestore
    console.log({ formData: form.getFieldValue() });
    addDocument('rooms', { ...form.getFieldValue(), members: [uid], createdAt: serverTimestamp() });

    // reset form value
    form.resetFields();

    setIsAddRoomVisible(false);
  }

  const handleCancel = () => {
    // reset form value
    form.resetFields();

    setIsAddRoomVisible(false);
  }

  return (
    <div>
      <Modal title='Tạo phòng' open={isAddRoomVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} layout='vertical'>
          <Form.Item label='Tên phòng' name='name' style={{ marginTop: 30 }}>
            <Input placeholder='Nhập tên phòng' />
          </Form.Item>
          <Form.Item label='Mô tả' name='description'>
            <Input.TextArea placeholder='Nhập mô tả' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
