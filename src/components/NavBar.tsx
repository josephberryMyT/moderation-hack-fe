import Link from 'next/link';

import { Menu, MenuProps } from 'antd';

const items: MenuProps['items'] = [
  {
    label: (<Link href="/">Chat</Link>),
    key: 'chat'
  },
  {
    label: (<Link href="/flags">Flagged Messages</Link>),
    key: 'flags'
  },
]


export default function NavBar({current} : { current: string}) {
  return <Menu selectedKeys={[current]} mode="horizontal" items={items} theme="dark"/>;

}