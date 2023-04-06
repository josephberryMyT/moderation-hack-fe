import styles from './index.module.css'
import { List, Button, Form, Input, Layout, Typography } from 'antd';
const { Header, Content, Footer } = Layout;
import { useEffect, useRef, useState } from 'react';
import NavBar from '@/components/NavBar';
import type { InputRef } from 'antd';

const { Title } = Typography;

interface Message {
  key: number;
  text: string;
  type: string;
}

export default function Home() {
  const [current, setCurrent] = useState('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [form] = Form.useForm();
  const [count, setCount] = useState(0)
  const inputRef = useRef<InputRef>(null);


  const addMessage = (input: string) => {
    const newMessages = [...messages];
    newMessages.push({ key: count, text: input, type: "MESSAGE"});
    setMessages(newMessages);
    setCount(newMessages.length);
  }

  const addWarning = (input: string, data: any) => {
    const newMessages = [...messages];
    newMessages.push({ key: count, text: input, type: "MESSAGE"});
    newMessages.push({ key: count + 1, text: data.response, type: "WARNING"});
    setMessages(newMessages);
    setCount(newMessages.length);
  }

  const onFinish = async (values: any) => {
    if(!values.input) {
      return;
    }
    await fetch(`http://localhost:8080/moderate/text`,
      { body: JSON.stringify({ input: values?.input, userId: "99999"}), method: "POST", headers: { "Content-Type": "application/json"}})
        .then(res => res.json())
        .then(data => {
          if (data.flagged) {
            addWarning(values.input, data);
          } else {
            addMessage(values.input);
          }
        })
        .catch(_err => {});
    form.resetFields();
  };

    useEffect(() => {
   inputRef.current!.focus({
              cursor: 'start',
            });
  });

  return (
      <Layout>
        <Header>
          <NavBar current={current} />
        </Header>
        <Content className={styles.content}>

          <div style={{ padding: 24, textAlign: 'center' }}>
          <Title level={1}>Chat page</Title>
          <div style={{ textAlign: "left", padding: "14px", minHeight: "60vh"}}>

          <List
    itemLayout="horizontal"
    dataSource={messages}
    renderItem={(item, index) => (
      <List.Item>
        <List.Item.Meta
          title={item.type === "WARNING" ? <h4>{item.type}</h4> : null}
          description={item.text}
        />
      </List.Item>

)}
/>
</div>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            layout='inline'
            size='large'
            onFinish={onFinish}
            form={form}
          >
            <Form.Item
              label="Type here"
              name="input"
            >
              <Input ref={inputRef}/>
            </Form.Item>
              <Button type="primary" htmlType="submit">
                Send
              </Button>
          </Form>

          </div>
        </Content>



      </Layout>
  )
}
