import { useState } from "react";
import { Button, Card, Form, Input, message } from "antd";
import { login } from "@/lib/auth";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  async function onLogin(values) {
    setLoading(true);
    try {
      await login(values.username, values.password);
      message.success("Logged in");
      window.location.href = "/";
    } catch (e) {
      message.error("Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card title="Sign in" className="w-full max-w-md">
        <Form layout="vertical" onFinish={onLogin}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Log in
          </Button>
        </Form>
      </Card>
    </div>
  );
}
