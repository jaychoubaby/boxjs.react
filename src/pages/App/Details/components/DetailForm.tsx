import FormType from "@/components/FormType";
import ProForm from "@/components/ProForm";
import { useModel } from "@@/exports";
import { Button, Divider, Stack } from "@mui/material";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

const DetailForm: React.FC<{ formConfig: boxjs.Setting[] }> = ({
  formConfig,
}) => {
  const { initialState } = useModel("@@initialState");
  const { fetchSave } = useModel("api");
  const usercfgs = initialState?.boxdata.usercfgs;
  let defaultValues: any = {};
  const initDefaultValue = () => {
    formConfig.forEach((setting) => {
      const data = initialState?.boxdata.datas[setting.id];
      let dataVal = data === "" || data === undefined ? setting.val : data;
      if (dataVal === null) dataVal = undefined;
      const key = setting.id.replaceAll(".", "~");
      try {
        defaultValues[key] = setting.child
          ? JSON.parse(`${dataVal || "[]"}`)
          : dataVal;
      } catch (e) {
        defaultValues[key] = dataVal;
      }
    });
  };
  initDefaultValue();
  const form = useForm({ defaultValues });

  useEffect(() => {
    defaultValues = {};
    initDefaultValue();
    form.reset(defaultValues);
  }, [initialState?.boxdata]);

  return (
    <ProForm
      form={form}
      noValidate
      onSubmit={(formData) => {
        const formValue: { key: string; val: any }[] = [];
        Object.keys(formData).forEach((key) => {
          const id = key.replaceAll("~", ".");
          const initialValue = initialState?.boxdata.datas[id];
          let val: any = formData[key];
          if (typeof val === "object" && typeof initialValue === "string") {
            try {
              val = JSON.stringify(val, null, ` `);
            } catch (e) {
              val = formData[key].join(",");
            }
          } else if (typeof formData[key] === "boolean") {
            val = `${formData[key]}`;
          }
          formValue.push({ key: id, val });
        });
        fetchSave.run(formValue);
      }}
      autoComplete="off"
    >
      <Stack
        sx={{
          pl: 2,
          pr: 2,
          ...(Number(usercfgs?.app_settings_height || "0") > 0
            ? {
                maxHeight: `${usercfgs?.app_settings_height}px`,
                overflow: "auto",
              }
            : {}),
        }}
        spacing={1}
      >
        {formConfig.map((setting: any) => {
          if (typeof setting.items === "string") {
            setting.items = initialState?.boxdata.datas[setting.items] || [];
          }
          return (
            <FormType
              form={form}
              key={setting.id}
              setting={setting}
              itemValue={initialState?.boxdata.datas}
            />
          );
        })}
      </Stack>
      <Divider />
      <Stack p={`5px`} spacing={2} justifyContent={"flex-end"}>
        <Button
          type={"submit"}
          variant="text"
          sx={{ width: "max-content", marginLeft: "auto" }}
        >
          保存
        </Button>
      </Stack>
    </ProForm>
  );
};

export default DetailForm;
