import {
  Modal,
  Button,
  DatePicker,
  Form,
  Icon,
  Input,
  InputNumber,
  Radio,
  Select,
  Tooltip,
} from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';

import { param } from 'change-case';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { convertDate } from '@/utils/datetime';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface FormProps extends FormComponentProps{
  modelName: string;
  submitting: boolean;
  formItemList: any[];
  defaultItemList: any[];
  dispatch: Dispatch<any>;
}

class MForm extends Component<FormProps> {

  componentWillMount() {
    this.queryModelFields();
  }

  setDefaultModelFields() {
    const { dispatch, modelName, defaultItemList } = this.props;
    dispatch({
      type: 'userForm/changeModelName',
      payload: {
        name: modelName,
        fields: defaultItemList,
      },
    })
  }

  handleSubmit = (e: React.FormEvent) => {
    const {
 form, dispatch, modelName, formItemList,
} = this.props;
    const name = modelName.replace('Form', '');
    const type = 'userForm/submitForm';
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const data = convertDate(formItemList, values);
        const payload = {
          name,
          action: name,
          data,
        }
        Modal.info({
          title: JSON.stringify(payload),
        })
        dispatch({
          type,
          payload,
        });
      }
    });
  };

  queryModelFields() {
    const { dispatch, modelName } = this.props;
    dispatch({
      type: 'userForm/queryModelFields',
      payload: {
        name: modelName,
      },
    })
  }

  renderFormItem(item) {
    const {
      modelName,
      form: { getFieldDecorator },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    let itemDom = null;

    const { key, type, options } = item;
    const label = `${param(modelName)}.${key}.label`
    // const placeholderX = `${param(modelName)}.${key}.placeholder`
    const placeholderX = `${param(modelName)}.${key}.label`

    switch (type) {
      case 'input':
        itemDom = <FormItem {...formItemLayout} key={key} label={<FormattedMessage id={label} />}>
              {getFieldDecorator(String(key), {})(<Input />)}
            </FormItem>
        break;
      case 'textarea':
        itemDom = <FormItem {...formItemLayout} key={key} label={<FormattedMessage id={label} />}>
              {getFieldDecorator(String(key), {})(<TextArea rows={4} placeholder="请输入" />)}
            </FormItem>
        break;
      case 'select':
        itemDom = <FormItem {...formItemLayout} key={key} label={<FormattedMessage id={label} />}>
              {getFieldDecorator(String(key), {})(<Select showSearch labelInValue>
                {options.map(option => <Option key={option.label} value={option.value}>{option.label}</Option>)}
              </Select>)}
            </FormItem>
        break;
      case 'date':
        itemDom = <FormItem {...formItemLayout} key={key} label={<FormattedMessage id={label} />}>
              {getFieldDecorator(String(key), {})(<DatePicker style={{ width: '100%' }} />)}
            </FormItem>
        break;
      default:
        itemDom = <FormItem {...formItemLayout} key={key} label={<FormattedMessage id={label} />}>
              {getFieldDecorator(String(key), {})(<Input placeholder={`请输入${formatMessage({ id: placeholderX })}`}/>)}
            </FormItem>
        break;
    }
    return itemDom;
  }

  renderActions() {
    const { submitting } = this.props;
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    return (
      <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
        <Button type="primary" htmlType="submit" loading={submitting}>
          <FormattedMessage id="user-form.form.submit" />
        </Button>
        <Button style={{ marginLeft: 8 }}>
          <FormattedMessage id="user-form.form.save" />
        </Button>
      </FormItem>
    )
  }

  render() {
    const { formItemList } = this.props;
    return (
      <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
        {formItemList.map(item => this.renderFormItem(item))}
        {this.renderActions()}
      </Form>
    );
  }
}

export default Form.create<FormProps>()(MForm);
