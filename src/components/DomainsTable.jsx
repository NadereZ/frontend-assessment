import React, { useState, useMemo } from "react";
import {
  Table,
  Tag,
  Button,
  Input,
  Select,
  Dropdown,
  Modal,
  message,
} from "antd";
import {
  PlusOutlined,
  MoreOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  useGetDomainsQuery,
  useDeleteDomainMutation,
  useUpdateDomainMutation,
} from "../redux/domainApi";
import DomainDrawer from "./DomainDrawer";

const { Option } = Select;
const { confirm } = Modal;

const DomainsTable = () => {
  const { data: domains = [], isLoading } = useGetDomainsQuery();
  const [deleteDomain] = useDeleteDomainMutation();
  const [updateDomain] = useUpdateDomainMutation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  const showDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const handleDelete = async (record) => {
    confirm({
      title: "Are you sure you want to delete this domain?",
      icon: <ExclamationCircleOutlined />,
      content: record.domain,
      async onOk() {
        try {
          await deleteDomain(record.id).unwrap();
          message.success("Domain deleted successfully");
        } catch (error) {
          message.error(error.message || "Failed to delete domain");
        }
      },
    });
  };

  const handleVerify = async (record) => {
    try {
      await updateDomain({
        id: record.id,
        status: "verified",
      }).unwrap();
      message.success("Domain verified successfully");
    } catch (error) {
      message.error(error.message || "Failed to verify domain");
    }
  };

  const handleViewPages = (record) => {
    console.log("Viewing pages for:", record.domain);
  };

  const handleInstallScript = (record) => {
    console.log("Installing script for:", record.domain);
  };

  const filteredDomains = useMemo(() => {
    const filtered = domains.filter((d) =>
      d.domain.toLowerCase().includes(searchText.toLowerCase())
    );
    return filtered.sort((a, b) => {
      const aTime = a.createdDate || 0;
      const bTime = b.createdDate || 0;
      return sortOrder === "asc" ? aTime - bTime : bTime - aTime;
    });
  }, [domains, searchText, sortOrder]);

  const columns = [
    {
      title: "Domain URL",
      dataIndex: "domain",
      key: "domain",
      render: (text, record) => (
        <div className="flex items-center">
          <span
            className={`w-3 h-3 rounded-full mr-2 ${
              record.isActive ? "bg-green-500" : "bg-red-500"
            }`}
          ></span>
          <a
            href={text}
            className="text-blue-600"
            target="_blank"
            rel="noreferrer"
          >
            {text}
          </a>
        </div>
      ),
    },
    {
      title: "Active Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Active" : "Not Active"}
        </Tag>
      ),
    },
    {
      title: "Verification Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "verified" ? "green" : "red"}>
          {status === "verified" ? "Verified" : "Not Verified"}
        </Tag>
      ),
    },
    {
      title: "",
      key: "actions",
      render: (text, record) => {
        const items = [
          { key: "view", label: "View Pages" },
          { key: "verify", label: "Verify" },
          { key: "install", label: "Install Script" },
          { key: "delete", label: "Delete", danger: true },
        ];

        const handleMenuClick = ({ key }) => {
          switch (key) {
            case "view":
              handleViewPages(record);
              break;
            case "verify":
              handleVerify(record);
              break;
            case "install":
              handleInstallScript(record);
              break;
            case "delete":
              handleDelete(record);
              break;
            default:
              break;
          }
        };

        return (
          <Dropdown
            menu={{ items, onClick: handleMenuClick }}
            trigger={["click"]}
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-left">DOMAINS</h2>

      <div className="flex justify-between items-center mb-4">
        <Button type="primary" icon={<PlusOutlined />} onClick={showDrawer}>
          Add Domain
        </Button>

        <div className="flex gap-2">
          <Select
            value={sortOrder}
            onChange={(val) => setSortOrder(val)}
            style={{ width: 200 }}
          >
            <Option value="asc">Order by Ascending</Option>
            <Option value="desc">Order by Descending</Option>
          </Select>

          <Input
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredDomains}
        rowKey="id"
        pagination={false}
        loading={isLoading}
      />

      <DomainDrawer open={isDrawerOpen} onClose={closeDrawer} />
    </div>
  );
};

export default DomainsTable;
