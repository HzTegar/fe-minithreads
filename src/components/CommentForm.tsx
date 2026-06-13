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
        className="w-full bg-[#1a1a1a] border border-white/[0.08] text-white p-3 rounded-xl min-h-[100px] outline-none placeholder:text-neutral-600 focus:border-indigo-500 transition-colors box-border"
        placeholder={placeholder}
      />
      {formik.touched.content && formik.errors.content ? (
        <p className="text-red-400 text-xs mt-1 mb-2">{formik.errors.content}</p>
      ) : null}
      <div className="flex justify-end">
        <Button type="submit" size="sm" isLoading={isLoading} disabled={!formik.isValid || !formik.values.content.trim()}>
          Post Comment
        </Button>
      </div>
    </form>
  );
};
