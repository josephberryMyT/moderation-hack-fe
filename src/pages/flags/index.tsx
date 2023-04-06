import styles from './index.module.css'

import useSWR from 'swr'

import NavBar from '@/components/NavBar';

import { Button, Layout, Space, Table, TablePaginationConfig, Typography } from 'antd';
const { Header, Content } = Layout;

const { Title } = Typography;
const { Column, ColumnGroup } = Table;

import 'antd/dist/reset.css';
import axios from 'axios';
import { config } from 'process';
import { useEffect, useState } from 'react';

interface DataType {
  key: React.Key;
  createdDate: string;
  input: string;
  response: string;
  userId: string;
}


export default function Flags() {
    const [current, _setCurrent] = useState('flags');
    const [page, setPage] = useState(0);
    const [size, _setSize] = useState(20);
    const [total, setTotal] = useState(1);

    const handleChange = async (pagination: TablePaginationConfig) => {
      setPage((pagination.current ? pagination.current : 1) -1);
    };

    const fetchFlaggedMessages = async (keys: any[]) => {
      const [path, page, size] = keys;
      return fetch(`http://localhost:8080${path}?page=${page}&size=${size}`)
        .then(res => res.json())
        .then(data => {
          setTotal(data?.totalPages);
          return data?.content
        })
        .catch(_err => []);
      }

    const { data } = useSWR(["/flagged", page, size], fetchFlaggedMessages)


  return (
     <Layout>
        <Header>
          <NavBar current={current} />
        </Header>
        <Content className={styles.content}>

          <div style={{ padding: 24, textAlign: 'center' }}>
            <Title level={1}>Flagged Messages</Title>
            <Table 
              dataSource={data}
              onChange={handleChange}
              pagination={{
                total, pageSize: size
              }}
              size='large'
            >
              <Column title="UserId" dataIndex="userId" key="userId" />
              <Column title="Created Date" dataIndex="createdDate" key="createdDate" />
             <Column
               title="Input"
                dataIndex="input"
                key="input"
              />
              <Column
               title="Launch"
               dataIndex="spaceId"
               key="spaceId"
                render={(_: any, record: DataType) => (
                  <Space size="middle">
                    <Button>Launch</Button>
                  </Space>
                )}
              />
            </Table>
          </div>
        </Content>
      </Layout>
  )
}
