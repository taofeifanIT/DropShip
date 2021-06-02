import React, { useState, useRef, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Modal, Form, Select, Popconfirm, Tag, Switch } from 'antd';
import { FormInstance } from 'antd/lib/form';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { roleList } from '../../services/setting/roleManagement';
import { addUser, updateUser, deleteUser } from '../../services/setting/userManagement';
import { tags } from '../../services/publicKeys';
import { getKesGroup, getKesValue } from '../../utils/utils';
const { Option } = Select;
import request from 'umi-request';
import { useModel } from 'umi';

type role = {
  id: number;
  title: string;
};

const OperationModal = (props: {
  isModalVisible: boolean;
  setIsModalVisible: (fn: () => void) => void;
  dataInit: () => void;
  roleData: role[];
  record?: any;
}) => {
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 13 },
  };
  const formRef: any = React.createRef<FormInstance>();
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [showTag, setShowTag] = useState(false);
  const { record } = props;
  const onFinish = () => {
    formRef.current
      .validateFields()
      .then((value: any) => {
        let api = addUser;
        let param = value;
        param.open_tag_permission = param.open_tag_permission ? 1 : 0;
        if (record) {
          api = updateUser;
          param.id = record.id;
        }
        setConfirmLoading(true);
        api(param)
          .then((res) => {
            if (res.code) {
              message.success('The operation was successful！');
              form.resetFields();
              props.setIsModalVisible(() => {
                form.resetFields();
              });
              props.dataInit();
            } else {
              throw res.message;
            }
          })
          .catch((e: any) => {
            message.error(e);
            console.error(e);
          })
          .finally(() => {
            setConfirmLoading(false);
          });
      })
      .catch((errorInfo: Object) => {
        console.log(errorInfo);
      });
  };
  const onReset = () => {
    formRef.current.resetFields();
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  React.useEffect(() => {
    if (formRef.current && props.record && props.isModalVisible) {
      if (props.record.open_tag_permission) {
        setShowTag(true);
      }
      formRef.current.setFieldsValue({
        ...props.record,
        open_tag_permission: !!props.record.open_tag_permission,
        tag_ids: JSON.parse(props.record.tag_ids),
        group_id: props.record.group_id,
      });
    } else {
      setShowTag(false);
      form.resetFields();
    }
  }, [props.isModalVisible]);
  return (
    <>
      <Modal
        maskClosable={false}
        title={props.record ? 'edit' : 'add'}
        confirmLoading={confirmLoading}
        visible={props.isModalVisible}
        onOk={onFinish}
        onCancel={() => props.setIsModalVisible(onReset)}
      >
        <Form form={form} ref={formRef} {...layout} name="basic" onFinishFailed={onFinishFailed}>
          <Form.Item
            label="user name"
            name="username"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input />
          </Form.Item>
          {!record ? (
            <Form.Item
              label="password"
              name="password"
              rules={[
                {
                  required: true,
                  validator: async (_, password) => {
                    if (!password) {
                      return Promise.reject(new Error('Please input your password!'));
                      // return
                    }
                    if (password.length <= 3 || password.length > 50) {
                      return Promise.reject(new Error('Please input the correct password format!'));
                    }
                  },
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
          ) : null}
          <Form.Item
            label="role"
            name="group_id"
            rules={[{ required: true, message: 'Please select your role!' }]}
          >
            <Select>
              {props.roleData.map((item: any) => {
                return (
                  <Select.Option key={item.id} value={item.id}>
                    {item.title}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item label="tag permission" name="open_tag_permission" valuePropName="checked">
            <Switch
              onChange={(status) => {
                setShowTag(status);
              }}
            />
          </Form.Item>
          {showTag && (
            <Form.Item label="tags" name="tag_ids">
              <Select mode="multiple" placeholder="Please select" style={{ width: '100%' }}>
                {getKesGroup('tagsData').map((item: tags) => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.tag_name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </>
  );
};

interface GithubIssueItem {
  id: string;
  username: string;
  role: {
    title: string;
    id: number;
  };
  status: number;
}

function DeleteComponent(props: { id: number; initData: () => void }) {
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const showPopconfirm = () => {
    setVisible(true);
  };
  const handleOk = () => {
    setConfirmLoading(true);
    deleteUser(props.id)
      .then((res) => {
        if (res.code) {
          message.success('The operation was successful！');
          props.initData();
        } else {
          throw res.msg;
        }
      })
      .catch((e: string) => {
        message.error(e);
      })
      .finally(() => {
        setVisible(false);
        setConfirmLoading(false);
      });
  };

  const handleCancel = () => {
    setVisible(false);
  };
  return (
    <Popconfirm
      title="Are you sure you want to delete this data？"
      visible={visible}
      onConfirm={handleOk}
      okButtonProps={{ loading: confirmLoading }}
      onCancel={handleCancel}
    >
      <a onClick={showPopconfirm}>delete</a>
    </Popconfirm>
  );
}

export default () => {
  const [roleData, setRoleData] = useState([]);
  const getRoles = () => {
    roleList().then((res) => {
      setRoleData(res.data.list_groups);
    });
  };
  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: 'id',
      dataIndex: 'id',
    },
    {
      title: 'user name',
      dataIndex: 'username',
      copyable: true,
    },
    {
      title: 'role',
      dataIndex: 'group_id',
      render: (text: any) => {
        return <span key="roleShow">{roleData.find((item: any) => item.id === text)?.title}</span>;
      },
    },
    {
      title: 'Tag owned',
      dataIndex: 'hasTags',
      render: (
        hasTags: {
          id: number;
          tag_name: string;
        }[],
        record: {
          open_tag_permission: number;
        },
      ) => {
        if (record.open_tag_permission) {
          return hasTags.map((item, index) => {
            return <p key={item.id}>{`${index + 1}.${item.tag_name}`}</p>;
          });
        } else {
          return 'All tags';
        }
      },
    },
    {
      title: 'status',
      dataIndex: 'status',
      render: (status: any) => {
        if (status) {
          return <Tag color="#87d068">Enable</Tag>;
        }
        return <Tag color="#f50">Disable</Tag>;
      },
    },
    {
      title: 'operation',
      valueType: 'option',
      dataIndex: 'id',
      render: (text, row: any) => [
        <a
          key="show"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            setRecord(row);
            setIsModalVisible(true);
          }}
        >
          edit
        </a>,
        <DeleteComponent key="DeleteComponent" id={row.id} initData={dataInit} />,
      ],
    },
  ];
  const ref: any = useRef();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { initialState } = useModel('@@initialState');
  const [record, setRecord] = useState(null);
  const cancelModal = (fn: () => void) => {
    setRecord(null);
    fn();
    setIsModalVisible(false);
  };
  const dataInit = () => {
    ref.current.reload();
  };
  const getBestSize = (): number => {
    // 搜索栏+功能栏+表头+分页器/每行的高度 四舍五入
    let size: number = (initialState as any).pageHeight / 47;
    return Math.round(size);
  };
  useEffect(() => {
    getRoles();
  }, []);
  return (
    <div style={{ height: `${(initialState as any).pageHeight}px` }}>
      <ProTable<GithubIssueItem>
        actionRef={ref}
        columns={columns}
        request={async (params = {}) =>
          new Promise((resolve) => {
            request<{
              data: GithubIssueItem[];
            }>('/api/adminuser/list_adminusers', {
              params,
            }).then((res: any) => {
              let resultData = res.data.adminusers.map((item: any) => {
                return {
                  ...item,
                  hasTags: item.tag_ids
                    ? JSON.parse(item.tag_ids).map((tagId: number) => {
                        return getKesValue('tagsData', tagId);
                      })
                    : [],
                };
              });
              resolve({
                data: resultData,
                // success 请返回 true，
                // 不然 table 会停止解析数据，即使有数据
                success: !!res.code,
                // 不传会使用 data 的长度，如果是分页一定要传
                total: res.data.adminusers.length,
              });
            });
          })
        }
        pagination={{
          pageSize: getBestSize(),
        }}
        rowKey="id"
        dateFormatter="string"
        headerTitle="User management"
        search={false}
        toolBarRender={() => [
          <Button
            key="userBtn"
            type="primary"
            onClick={() => {
              setIsModalVisible(true);
            }}
          >
            <PlusOutlined />
            Add
          </Button>,
        ]}
      />
      <OperationModal
        isModalVisible={isModalVisible}
        setIsModalVisible={cancelModal}
        dataInit={dataInit}
        roleData={roleData}
        record={record}
      ></OperationModal>
    </div>
  );
};
