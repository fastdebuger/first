import React from 'react';
import { useIntl } from 'umi';
import { connect } from 'umi';
import { BasicTaskForm } from 'qcx4-components';

interface BaseTaskFormI {
  formColumns: any[];
  footerBarRender: (form: any) => JSX.Element;
  initialValue?: any;
  labelAlign?: string;
  colSpan?: number;
}

const BaseTaskForm: React.FC<BaseTaskFormI> = (props) => {
  const { formColumns, footerBarRender, initialValue } = props;
  const { formatMessage } = useIntl();
  formColumns.map((item) => (item.title = formatMessage({ id: item.title })));
  return (
    <div style={{ backgroundColor: '#fff', padding: 8 }}>
      <BasicTaskForm
        formColumns={formColumns}
        footerBarRender={footerBarRender}
        initialValue={initialValue}
      />
    </div>
  );
};

export default connect()(BaseTaskForm);
