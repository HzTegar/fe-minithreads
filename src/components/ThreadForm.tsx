import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "./common/Button";
import { Input } from "./common/Input";
import { categoryService } from "../services/categoryService";
import type { Category } from "../types/category.type";
import { tagService, type Tag } from "../services/tagService";

interface ThreadFormProps {
  initialData?: {
    title: string;
    body: string;
    category_id: string;
    tags: string[];
  };
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export const ThreadForm: React.FC<ThreadFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, tags] = await Promise.all([
          categoryService.getAll(),
          tagService.getAll(),
        ]);
        setCategories(cats);
        setAvailableTags(tags);

        if (!initialData && cats.length > 0 && !formik.values.category_id) {
          formik.setFieldValue("category_id", cats[0].id);
        }
      } catch (error) {
        console.error("Failed to load form metadata:", error);
      }
    };
    fetchData();
  }, [initialData]);

  const validationSchema = Yup.object({
    title: Yup.string()
      .min(10, "Title must be at least 10 characters")
      .required("Title is required"),
    body: Yup.string()
      .min(30, "Body must be at least 30 characters")
      .required("Body is required"),
    category_id: Yup.string().required("Please select a category"),
    tags: Yup.array().max(5, "You can select up to 5 tags"),
  });

  const formik = useFormik({
    initialValues: initialData || {
      title: "",
      body: "",
      category_id: "",
      tags: [] as string[],
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const handleTagToggle = (tagName: string) => {
    const currentTags = formik.values.tags;
    const newTags = currentTags.includes(tagName)
      ? currentTags.filter((t) => t !== tagName)
      : [...currentTags, tagName];

    if (newTags.length <= 5) {
      formik.setFieldValue("tags", newTags);
    }
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    if (formik.values.tags.length >= 5) {
      alert("Max 5 tags allowed!");
      return;
    }

    const existing = availableTags.find(
      (t) => t.name.toLowerCase() === newTag.toLowerCase(),
    );

    if (existing) {
      if (!formik.values.tags.includes(existing.name))
        handleTagToggle(existing.name);
    } else {
      try {
        const created = await tagService.create(newTag);
        setAvailableTags((prev) => [...prev, created]);
        handleTagToggle(created.name);
      } catch (err: any) {
        alert(err.message || "Failed to create tag");
      }
    }
    setNewTag("");
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
    >
      <div>
        <Input
          label="Title"
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="What is your question? Be specific."
        />
        {formik.touched.title && formik.errors.title ? (
          <p style={{ color: "#f87171", fontSize: "0.75rem", marginTop: "0.25rem" }}>
            {formik.errors.title}
          </p>
        ) : null}
      </div>

      <div>
        <label
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--muted-foreground)",
            marginBottom: "6px",
          }}
        >
          Category
        </label>
        <select
          name="category_id"
          value={formik.values.category_id}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: "6px",
            border: "1px solid var(--border)",
            fontSize: "15px",
            backgroundColor: "var(--card)",
            color: "var(--foreground)",
          }}
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {formik.touched.category_id && formik.errors.category_id ? (
          <p style={{ color: "#f87171", fontSize: "0.75rem", marginTop: "0.25rem" }}>
            {formik.errors.category_id}
          </p>
        ) : null}
      </div>

      <div>
        <label
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--muted-foreground)",
            marginBottom: "6px",
          }}
        >
          Tags (Max 5)
        </label>

        <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
          <input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag();
              }
            }}
            placeholder="Type new tag & press Enter"
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--card)",
              color: "var(--foreground)",
            }}
          />
          <button
            type="button"
            onClick={handleAddTag}
            style={{
              padding: "4px 12px",
              background: "#6366f1",
              color: "white",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Add
          </button>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {availableTags.map((tag) => {
            const isSelected = formik.values.tags.includes(tag.name);
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleTagToggle(tag.name)}
                disabled={!isSelected && formik.values.tags.length >= 5}
                style={{
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: isSelected ? tag.color : `${tag.color}1A`,
                  color: isSelected ? "#ffffff" : tag.color,
                  transition: "all 0.2s",
                  fontWeight: isSelected ? 600 : 400,
                }}
              >
                {tag.name}
              </button>
            );
          })}
        </div>
        <p style={{ fontSize: "11px", color: "var(--muted-foreground)", margin: "8px 0 0" }}>
          Select up to 5 tags to describe what your question is about.
        </p>
        {formik.errors.tags ? (
          <p style={{ color: "#f87171", fontSize: "0.75rem", marginTop: "0.25rem" }}>
            {formik.errors.tags}
          </p>
        ) : null}
      </div>

      <div>
        <label
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--muted-foreground)",
            marginBottom: "6px",
          }}
        >
          Body
        </label>
        <textarea
          name="body"
          value={formik.values.body}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          rows={10}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "6px",
            border: "1px solid var(--border)",
            resize: "vertical",
            fontSize: "15px",
            fontFamily: "inherit",
            lineHeight: "1.5",
            backgroundColor: "var(--card)",
            color: "var(--foreground)",
            boxSizing: "border-box",
          }}
          placeholder="Explain your problem in detail..."
        />
        {formik.touched.body && formik.errors.body ? (
          <p style={{ color: "#f87171", fontSize: "0.75rem", marginTop: "0.25rem" }}>
            {formik.errors.body}
          </p>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          marginTop: "1rem",
        }}
      >
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={!formik.isValid}
          size="lg"
          style={{ backgroundColor: "#6366f1", padding: "0.8rem 2rem" }}
        >
          {initialData ? "Update Thread" : "Post Your Question"}
        </Button>
      </div>
    </form>
  );
};
