import ProFrom from '@/components/ProForm';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Slide,
  colors,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ProModal: React.FC<
  {
    loading?: boolean;
    onClose?: () => void;
    title?: any;
    children: React.ReactNode;
    onSubmit?: (formValue: any) => void;
    form?: UseFormReturn;
    footer?: null | React.ReactNode;
  } & Omit<DialogProps, 'title'>
> = ({
  footer,
  loading,
  onClose,
  title,
  children,
  onSubmit,
  form,
  ...props
}) => {
  return (
    <Dialog
      key="Dialog"
      maxWidth="xs"
      sx={{ '& .MuiDialog-paper': { minWidth: '80%' } }}
      TransitionComponent={Transition}
      {...props}
    >
      {props.open && (
        <ProFrom
          form={form}
          onSubmit={(formValue) => {
            onSubmit?.(formValue);
          }}
        >
          {title && typeof title === 'string' ? (
            <DialogTitle sx={{ fontSize: `1rem`, padding: 1 }} key="title">
              {title}
            </DialogTitle>
          ) : (
            title
          )}
          <DialogContent dividers key="content">
            {props.open ? children : null}
          </DialogContent>
          <DialogActions key="action">
            {footer !== undefined ? (
              footer
            ) : (
              <>
                <Button
                  sx={{ color: colors.grey[600] }}
                  aria-label="delete"
                  onClick={() => {
                    onClose?.();
                  }}
                >
                  取消
                </Button>
                <Button type={'submit'}>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    `确定`
                  )}
                </Button>
              </>
            )}
          </DialogActions>
        </ProFrom>
      )}
    </Dialog>
  );
};
export default ProModal;