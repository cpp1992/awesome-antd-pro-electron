import {
  Card, Select,
} from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { log } from '@/utils';

import MForm from '@/components/MForm';

const Option = Select.Option;

interface ModelFormProps {
  userForm: {
    modelName: string
    modelFields: any[]
  },
  global: {
    models: any[]
  }
}

interface FormProps extends FormComponentProps {
  submitting: boolean;
  dispatch: Dispatch<any>;
  modelName: string;
  modelFields: any[];
  modelNameOptions: any[];
}

// FIXED: connect接收第一个参数，包含model的命名空间
// 返回的是一个映射后的对象
@connect(({ global, userForm }: ModelFormProps) => ({
  modelFields: userForm.modelFields,
  modelName: userForm.modelName,
  modelNameOptions: global.models,
}))
class UserForm extends Component<FormProps> {
  state = {
    modelName: 'member',
    defaultItemList: [],
  }

  selectChanged = (name) => {
    const { dispatch } = this.props;
    console.log('Change model: ', name);
    dispatch({
      type: 'userForm/queryModelFields',
      payload: {
        url: `/api/${name}/fields`,
      },
    })
  }

  renderTitle() {
    const { modelNameOptions } = this.props;
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

  render() {
    const {
 submitting, dispatch, modelFields, modelName,
} = this.props;
    const { defaultItemList } = this.state;
    log.info('UserForm props:', this.props);
    return (
      <PageHeaderWrapper content={<FormattedMessage id="user-form.basic.description" />}>
        <Card title={this.renderTitle()} bordered={false}>
          <MForm formItemList={modelFields} defaultItemList={defaultItemList} submitting={submitting} dispatch={dispatch} modelName={modelName} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default UserForm;
