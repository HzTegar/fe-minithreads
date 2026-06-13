import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from './common/Button';

interface CommentFormProps {
  onSubmit: (content: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export const CommentForm: React.FC<CommentFormProps> = ({ onSubmit, isLoading, placeholder = "Write a comment..." }) => {
  const formik = useFormik({
    initialValues: {
      content: '',
    },
    validationSchema: Yup.object({
      content: Yup.string()
        .min(10, 'Comment must be at least 10 characters')
        .required('Comment content is required'),
    }),
    onSubmit: (values, { resetForm }) => {
      onSubmit(values.content);
      resetForm();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <textarea
        name="content"
        value={formik.values.content}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '0.5rem', minHeight: '100px', outline: 'none' }}
        placeholder={placeholder}
      />
      {formik.touched.content && formik.errors.content ? (
        <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '-0.25rem', marginBottom: '0.5rem' }}>{formik.errors.content}</p>
      ) : null}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="submit" size="sm" isLoading={isLoading} disabled={!formik.isValid || !formik.values.content.trim()}>
          Post Comment
        </Button>
      </div>
    </form>
  );
};
