import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode, HUA_WEI_OBS_CONFIG } from "@/common/const";
import { message } from "antd";
import HuaWeiOBSUploadSingleFile from "@/components/HuaWeiOBSUploadSingleFile";


const { CrudEditModal } = SingleTable;

/**
 * 编辑质量统计数据分析情况
 * @param props
 * @constructor
 */
const QualityStatisticsAnalysisEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord } = props;
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (dispatch) {
      // dispatch({
      //   type: '',
      //   payload: {
      //
      //   }
      // })
    }
  }, []);

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        "analysis",
        "measures",
        {
          title: '附件',
          subTitle: "附件",
          dataIndex: "file_url",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) =>
            <HuaWeiOBSUploadSingleFile
              accept=".doc,.docx,.xls,.xlsx,.pdf,.jpg,.jpeg,.png,.bmp,.webp"
              sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
              limitSize={100}
              folderPath="/Contract/Income"
              handleRemove={() => form.setFieldsValue({ file_url: null })}
              onChange={(file) => {
                form.setFieldsValue({ file_url: file?.response?.url })
              }}
            />
        },

      ])
      .setFormColumnToDatePicker([
        { value: 'form_make_time', valueType: 'dateTs', needValueType: 'timestamp' },
      ])
      .needToRules([
        "analysis",
        "measures",

      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudEditModal
      title={"编辑质量统计数据分析情况"}
      visible={visible}
      onCancel={onCancel}
      initialValue={selectedRecord}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "qualityStatisticsAnalysis/updateQualityStatisticsAnalysis",
            payload: { ...selectedRecord, ...values },
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("编辑成功");
                setTimeout(() => {
                  callbackSuccess();
                }, 1000);
              }
            },
          });
        });
      }}
    />
  );
};

export default connect()(QualityStatisticsAnalysisEdit);
