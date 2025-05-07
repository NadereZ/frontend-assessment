import React from "react";
import {
  Drawer,
  Form,
  Input,
  Select,
  Switch,
  Button,
  Space,
  message,
} from "antd";
import { useAddDomainMutation } from "../redux/domainApi";

const { Option } = Select;

const DomainDrawer = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [addDomain, { isLoading }] = useAddDomainMutation();

  const handleFinish = async (values) => {
    try {
      await addDomain(values).unwrap();
      message.success("Domain added successfully");
      form.resetFields();
      onClose();
    } catch (error) {
      message.error(error.data?.message || "Failed to add domain");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Drawer
      title="Add Domain"
      placement="right"
      width={480}
      onClose={onClose}
      open={open}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div className="text-right">
          <Space>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              type="primary"
              onClick={() => form.submit()}
              loading={isLoading}
            >
              Add Domain
            </Button>
          </Space>
        </div>
      }
    >
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item
          label="Domain"
          name="domain"
          rules={[{ required: true, message: "Please enter a domain" }]}
        >
          <Input placeholder="e.g. example.com" />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default DomainDrawer;
