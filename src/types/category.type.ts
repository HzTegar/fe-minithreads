import * as Yup from "yup";
export interface Category {
  id: string;
  name: string;
  slug: string;
  posts_count?: number;
}

export interface CategoryResponse {
  data: Category;
}

export interface CategoriesResponse {
  data: Category[];
}

export interface CategoryFormValues {
  name: string;
}

export const categoryValidationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("Nama kategori wajib diisi")
    .min(3, "Nama kategori minimal 3 karakter")
    .max(50, "Nama kategori maksimal 50 karakter"),
});

export const categoryInitialValues: CategoryFormValues = {
  name: "",
};
