import {
  Badge,
  Button,
  Card,
  Descriptions,
  Flex,
  Input,
  Layout,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';

const { Content, Header } = Layout;
const { Title, Paragraph, Text } = Typography;

export type TransportPurpose = 'import' | 'transit' | 'transshipment' | 'rob';

export interface GoodItem {
  id: string;
  manifestNo: string;
  houseBill: string;
  containerNo: string;
  sealNo: string;
  commodity: string;
  quantity: number;
  unit: string;
  weight: number;
  dischargePort: string;
  status: 'Ready' | 'Pending' | 'Arrived';
  destination: string;
  transportPurpose: TransportPurpose;
}

const PURPOSE_OPTIONS: { label: string; value: TransportPurpose }[] = [
  { label: 'Nhập khẩu', value: 'import' },
  { label: 'Quá cảnh', value: 'transit' },
  { label: 'Trung chuyển', value: 'transshipment' },
  { label: 'ROB', value: 'rob' },
];

const STATUS_COLORS: Record<GoodItem['status'], string> = {
  Arrived: 'success',
  Pending: 'default',
  Ready: 'processing',
};

const PURPOSE_COLORS: Record<TransportPurpose, string> = {
  import: 'blue',
  transit: 'geekblue',
  transshipment: 'purple',
  rob: 'orange',
};

const MOCK_GOODS: GoodItem[] = [
  {
    id: '1',
    manifestNo: 'MNF-230045',
    houseBill: 'HBL-7821',
    containerNo: 'TCNU1234567',
    sealNo: 'SL1234',
    commodity: 'Linh kiện điện tử',
    quantity: 120,
    unit: 'thùng',
    weight: 8500,
    dischargePort: 'VNHPH',
    status: 'Arrived',
    destination: 'Hải Phòng',
    transportPurpose: 'import',
  },
  {
    id: '2',
    manifestNo: 'MNF-230049',
    houseBill: 'HBL-7923',
    containerNo: 'TCLU7654321',
    sealNo: 'SL2231',
    commodity: 'Máy móc thiết bị',
    quantity: 5,
    unit: 'container',
    weight: 12600,
    dischargePort: 'VNSGN',
    status: 'Ready',
    destination: 'Singapore',
    transportPurpose: 'transit',
  },
  {
    id: '3',
    manifestNo: 'MNF-230051',
    houseBill: 'HBL-8001',
    containerNo: 'MSCU4567890',
    sealNo: 'SL9988',
    commodity: 'Dệt may',
    quantity: 300,
    unit: 'kiện',
    weight: 6400,
    dischargePort: 'VNHPH',
    status: 'Pending',
    destination: 'Hà Nội',
    transportPurpose: 'transshipment',
  },
  {
    id: '4',
    manifestNo: 'MNF-230052',
    houseBill: 'HBL-8007',
    containerNo: 'TEMU7894561',
    sealNo: 'SL1100',
    commodity: 'Nông sản khô',
    quantity: 180,
    unit: 'bao',
    weight: 4300,
    dischargePort: 'VNSGN',
    status: 'Ready',
    destination: 'ROB - Giữ lại tàu',
    transportPurpose: 'rob',
  },
];

function App() {
  const [goods, setGoods] = useState<GoodItem[]>(MOCK_GOODS);
  const [purposeFilter, setPurposeFilter] = useState<TransportPurpose | 'all'>('all');
  const [search, setSearch] = useState('');

  const filteredGoods = useMemo(() => {
    return goods.filter((item) => {
      const matchesPurpose = purposeFilter === 'all' || item.transportPurpose === purposeFilter;
      const keywords = `${item.containerNo} ${item.houseBill} ${item.commodity}`.toLowerCase();
      const matchesSearch = keywords.includes(search.trim().toLowerCase());
      return matchesPurpose && matchesSearch;
    });
  }, [goods, purposeFilter, search]);

  const handlePurposeChange = (id: string, value: TransportPurpose) => {
    setGoods((prev) => prev.map((item) => (item.id === id ? { ...item, transportPurpose: value } : item)));
  };

  const columns: ColumnsType<GoodItem> = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 60,
      render: (_value, _record, index) => index + 1,
    },
    {
      title: 'Mã manifest',
      dataIndex: 'manifestNo',
      ellipsis: true,
    },
    {
      title: 'House B/L',
      dataIndex: 'houseBill',
      ellipsis: true,
    },
    {
      title: 'Số container',
      dataIndex: 'containerNo',
      render: (value: string) => <Text strong>{value}</Text>,
    },
    {
      title: 'Niêm chì',
      dataIndex: 'sealNo',
      ellipsis: true,
    },
    {
      title: 'Mô tả hàng hóa',
      dataIndex: 'commodity',
      ellipsis: true,
    },
    {
      title: 'SL',
      dataIndex: 'quantity',
      render: (value: number, record) => (
        <Text>
          {value.toLocaleString('vi-VN')} {record.unit}
        </Text>
      ),
    },
    {
      title: 'Khối lượng (kg)',
      dataIndex: 'weight',
      render: (value: number) => value.toLocaleString('vi-VN'),
    },
    {
      title: 'Cảng dỡ',
      dataIndex: 'dischargePort',
      render: (value: string) => <Tag color="cyan">{value}</Tag>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (value: GoodItem['status']) => <Badge status={STATUS_COLORS[value]} text={value} />,
    },
    {
      title: 'Điểm đến',
      dataIndex: 'destination',
      ellipsis: true,
    },
    {
      title: 'Mục đích vận chuyển',
      dataIndex: 'transportPurpose',
      render: (value: TransportPurpose, record) => (
        <Select
          value={value}
          options={PURPOSE_OPTIONS}
          style={{ width: 160 }}
          onChange={(selected) => handlePurposeChange(record.id, selected)}
        />
      ),
    },
  ];

  const purposeStatistics = useMemo(() => {
    return PURPOSE_OPTIONS.map((option) => ({
      ...option,
      count: goods.filter((good) => good.transportPurpose === option.value).length,
    }));
  }, [goods]);

  return (
    <Layout>
      <Header
        style={{
          background: '#001529',
          padding: '16px 24px',
        }}
      >
        <Flex align="center" justify="space-between">
          <div>
            <Title level={3} style={{ color: '#fff', margin: 0 }}>
              PCS - Danh sách hàng hoá dự kiến dỡ
            </Title>
            <Paragraph style={{ color: '#d6e4ff', margin: 0 }}>
              Đồng bộ từ VASSCM, cập nhật mục đích vận chuyển và phản hồi về hệ thống hải quan.
            </Paragraph>
          </div>
          <Space>
            <Button type="default">Tải xuống CSV</Button>
            <Button type="primary">Gửi VASSCM</Button>
          </Space>
        </Flex>
      </Header>
      <Content style={{ padding: 24 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Card bordered={false} title="Thông tin chuyến tàu">
            <Descriptions size="small" column={{ xs: 1, sm: 2, md: 3 }}>
              <Descriptions.Item label="Tàu/Chuyến">YM ULTIMATE / 012W</Descriptions.Item>
              <Descriptions.Item label="Cảng dỡ dự kiến">Hải Phòng (VNHPH)</Descriptions.Item>
              <Descriptions.Item label="Ngày cập nhật">12/03/2024 09:30</Descriptions.Item>
              <Descriptions.Item label="Đối soát eMNF">Đã nhận từ eMNF</Descriptions.Item>
              <Descriptions.Item label="Luồng xử lý">eMNF → VASSCM → PCS → KBC</Descriptions.Item>
              <Descriptions.Item label="Ghi chú">Cho phép chọn 4 mục đích vận chuyển</Descriptions.Item>
            </Descriptions>
          </Card>

          <Flex gap={16} wrap>
            {purposeStatistics.map((stat) => (
              <Card key={stat.value} style={{ width: 220 }}>
                <Space direction="vertical" size={4}>
                  <Text type="secondary">{stat.label}</Text>
                  <Title level={3} style={{ margin: 0 }}>
                    {stat.count.toLocaleString('vi-VN')}
                  </Title>
                  <Tag color={PURPOSE_COLORS[stat.value]}>Mục đích</Tag>
                </Space>
              </Card>
            ))}
          </Flex>

          <Card bordered={false} title="Màn hình danh sách hàng hoá dự kiến dỡ" extra={<Text type="secondary">Mock data</Text>}>
            <Space style={{ marginBottom: 16 }} wrap>
              <Input.Search
                allowClear
                placeholder="Tìm kiếm container, house B/L, mô tả hàng hóa"
                style={{ width: 320 }}
                onChange={(event) => setSearch(event.target.value)}
              />
              <Select
                value={purposeFilter}
                options={[{ label: 'Tất cả mục đích', value: 'all' }, ...PURPOSE_OPTIONS]}
                style={{ width: 200 }}
                onChange={setPurposeFilter}
              />
            </Space>
            <Table
              rowKey="id"
              columns={columns}
              dataSource={filteredGoods}
              pagination={{ pageSize: 5, showSizeChanger: false }}
              scroll={{ x: 1200 }}
            />
          </Card>
        </Space>
      </Content>
    </Layout>
  );
}

export default App;
