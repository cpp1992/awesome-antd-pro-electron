import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  InputNumber,
  Menu,
  Row,
  Select,
  message,
} from 'antd';
import React, { Component, Fragment } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import moment from 'moment';
import { param } from 'change-case';
import { StateType } from './model';
import CreateForm from './components/CreateForm';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import UpdateForm, { FormValsType } from './components/UpdateForm';
import { TableListItem, TableListPagination, TableListParams } from './data.d';

import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;

const getValue = (obj: { [x: string]: string[] }) => Object.keys(obj)
    .map(key => obj[key])
    .join(',');

type IStatusMapType = 'default' | 'processing' | 'success' | 'error';

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  userTableList: StateType;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  expandForm: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<TableListItem>;
  modelNameOptions: any[];
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    userTableList,
    loading,
  }: {
    userTableList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    userTableList,
    loading: loading.models.rule,
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    modelNameOptions: [
      {
        title: 'user',
        value: 'user',
      },
      {
        title: 'employee',
        value: 'employee',
      },
      {
        title: 'asset',
        value: 'asset',
      },
      {
        title: 'bank',
        value: 'bank',
      },
    ],
  };

  // hack here for table columns
  defaultColumns: StandardTableColumnProps[] = [
    {
      title: 'key',
      dataIndex: 'name',
    },
    {
      title: 'key',
      dataIndex: 'name',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>配置</a>
          <Divider type="vertical" />
          <a href="">订阅警报</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    console.log('Current Model Name: ', this.props.userTableList.modelName);
    this.queryModelFields();
  }

  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof TableListItem, string[]>,
    sorter: SorterResult<TableListItem>,
  ) => {
    const { userTableList: { modelName }, dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key] as any);
      return newObj;
    }, {});

    const pageParams: Partial<TableListParams> = {
      pagination,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };

    const data = {
      ...formValues,
      ...filters,
    };

    if (sorter.field) {
      pageParams.sorter = `${sorter.field}_${sorter.order}`;
    }

    console.log('Filter params: ', pageParams);

    dispatch({
      type: 'userTableList/queryModelData',
      payload: {
        url: `/api/${modelName}/data`,
        data,
        params: {
          pageParams,
        },
      },
    });
  };

  handleFormReset = () => {
    const { userTableList: { modelName }, dispatch, form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'userTableList/queryModelFields',
      payload: {
        url: `/api/${modelName}/fields`,
      },
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = (e: { key: string }) => {
    const { userTableList: { modelName }, dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'userTableList/queryModelData',
          payload: {
            url: `/api/${modelName}/data`,
            method: 'delete',
            data: {
              id: selectedRows.map(row => row.id),
            },
          },
          callback: () => {
            this.queryModelData();
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = (rows: TableListItem[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const { userTableList: { modelName }, dispatch, form } = this.props;

    form.validateFields((err, values) => {
      if (err) return;

      this.setState({
        formValues: values,
      });

      // fetch with payload in form as { name, key, }
      dispatch({
        type: 'userTableList/queryModelData',
        payload: {
          url: `/api/${modelName}/data`,
          data: values,
        },
      });
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag?: boolean, record?: FormValsType) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  /**
   * add func
   */
  handleAdd = fields => {
    const { userTableList: { modelName }, dispatch } = this.props;
    dispatch({
      type: 'userTableList/add',
      payload: {
        url: `/api/${modelName}/data`,
        method: 'post',
        data: fields,
      },
      callback: () => this.queryModelData(),
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  /**
   * update func
   */
  handleUpdate = (fields: FormValsType) => {
    const { userTableList: { modelName }, dispatch } = this.props;
    dispatch({
      type: 'userTableList/update',
      payload: {
        url: `/api/${modelName}/data`,
        method: 'patch',
        data: fields,
      },
      callback: () => this.queryModelData(),
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  selectChanged = (name) => {
    const { dispatch } = this.props;
    console.log('Change model: ', name);
    dispatch({
      type: 'userTableList/queryModelFields',
      payload: {
        url: `/api/${name}/fields`,
      },
      callback: () => this.queryModelData(),
    })
  }

  queryModelFields() {
    const { userTableList: { modelName }, dispatch } = this.props;
    dispatch({
      type: 'userTableList/queryModelFields',
      payload: {
        url: `/api/${modelName}/fields`,
      },
      callback: () => this.queryModelData()
    });
  }

  queryModelData() {
    const { userTableList: { modelName }, dispatch } = this.props;
    dispatch({
      type: 'userTableList/queryModelData',
      payload: {
        url: `/api/${modelName}/data`,
      },
    });
  }

  renderTitle() {
    const { modelNameOptions } = this.state;
    return (
      <Select showSearch defaultValue="user" style={{ width: 100, maxWidth: 220 }} onSelect={this.selectChanged}>
      {modelNameOptions.map(item => (
        <Option key={item.title} value={item.value}>
          {item.title}
        </Option>
        ))}
      </Select>
    )
  }

  renderSimpleForm() {
    const { form, userTableList: { columns } } = this.props;
    const { getFieldDecorator } = form;
    const formFields = columns.slice(1, 4);
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {formFields.map(field => <Col md={8} sm={24}>
            <FormItem label={field.key}>
              {getFieldDecorator(field.key)(<Input />)}
            </FormItem>
          </Col>)}
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { form, userTableList: { columns } } = this.props;
    const { getFieldDecorator } = form;
    const formFields = columns.slice(1, 8);
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {formFields.map(field => <Col md={8} sm={24}>
            <FormItem label={field.key}>
              {getFieldDecorator(field.key)(<Input />)}
            </FormItem>
          </Col>)}
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      userTableList: { data, columns = this.defaultColumns },
      loading,
      form,
    } = this.props;

    const formFields = columns.slice(1, 6);

    const {
 selectedRows, modalVisible, updateModalVisible, stepFormValues,
} = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };

    return (
      <PageHeaderWrapper>
        <Card title={this.renderTitle()} bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            {/* Table List */}
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={formFields}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        {/* Show Form to create */}
        <CreateForm {...parentMethods} modalVisible={modalVisible} form={form} />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
            form={form}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
