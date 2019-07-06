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

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface FormProps extends FormComponentProps{
  modelName: string;
  submitting: boolean;
  formItemList: any[];
  dispatch: Dispatch<any>;
}

class MForm extends Component<FormProps> {
  componentWillMount() {
    const { dispatch, modelName } = this.props;
    dispatch({
      type: 'global/queryModel',
      payload: {
        name: modelName,
      },
    })
  }

  handleSubmit = (e: React.FormEvent) => {
    const { form, dispatch, modelName } = this.props;
    const type = `${modelName}Form/submitForm`;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        Modal.info({
          title: JSON.stringify(values),
        })
        dispatch({
          type,
          payload: values,
        });
      }
    });
  };

  renderFormItem(item) {
    const {
      form: { getFieldDecorator, getFieldValue },
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

    const { key, type } = item;
    const label = `user-form.${key}.label`
    const placeholderX = `user-form.${key}.placeholder`

    switch (type) {
      case 'input':
        itemDom = <FormItem {...formItemLayout} key={key} label={<FormattedMessage id={label} />}>
              {getFieldDecorator(String(key), {})(<Input placeholder={formatMessage({ id: placeholderX })} />)}
            </FormItem>
        break;
      default:
        itemDom = <FormItem {...formItemLayout} label={<FormattedMessage id={label} />}>
              {getFieldDecorator(String(key), {})(<Input placeholder={formatMessage({ id: placeholderX })}/>)}
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
