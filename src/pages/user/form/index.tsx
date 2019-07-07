import {
  Card,
} from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { log } from '@/utils';

import MForm from '@/components/MForm';
import { defaultItemList } from './config';

interface ModelFormProps {
  userForm: {
    modelName: string
    modelFields: any[]
  }
}

interface FormProps extends FormComponentProps {
  submitting: boolean;
  dispatch: Dispatch<any>;
  modelName: string;
  modelFields: any[];
}

// FIXED: connect接收第一个参数，包含model的命名空间
// 返回的是一个映射后的对象
@connect(({ userForm }: ModelFormProps) => ({
  modelFields: userForm.modelFields,
  modelName: userForm.modelName,
}))
class UserForm extends Component<FormProps> {
  state = {
    modelName: 'userForm',
    formItemList: defaultItemList,
  }

  // componentWillMount() {
  //   const { dispatch, modelName } = this.props;
  //   const { formItemList } = this.state;
  //   const name = modelName.replace('Form', '');
  //   dispatch({
  //     type: 'global/editModelFields',
  //     payload: {
  //       name,
  //       fields: formItemList
  //     }
  //   })
  // }

  render() {
    const {
 submitting, dispatch, modelFields, modelName,
} = this.props;
    log.info('UserForm props:', this.props);
    return (
      <PageHeaderWrapper content={<FormattedMessage id="user-form.basic.description" />}>
        <Card title={modelName} bordered={false}>
          <MForm formItemList={modelFields} submitting={submitting} dispatch={dispatch} modelName={modelName} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default UserForm;
