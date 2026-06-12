import React, { useState, useEffect } from "react";
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

  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      body: "",
      category_id: "",
      tags: [] as string[],
    },
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, tags] = await Promise.all([
          categoryService.getAll(),
          tagService.getAll(),
        ]);
        setCategories(cats);
        setAvailableTags(tags);

        if (!initialData && cats.length > 0) {
          setFormData((prev) => ({ ...prev, category_id: cats[0].id }));
        }
      } catch (error) {
        console.error("Failed to load form metadata:", error);
      }
    };
    fetchData();
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category_id) {
      alert("Please select a category");
      return;
    }
    onSubmit(formData);
  };

  const handleTagToggle = (tagName: string) => {
    setFormData((prev) => {
      const tags = prev.tags.includes(tagName)
        ? prev.tags.filter((t) => t !== tagName)
        : [...prev.tags, tagName];
      return { ...prev, tags };
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
    >
      <Input
        label="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="What is your question? Be specific."
        required
      />

      <div style={{ marginBottom: "0.5rem" }}>
        <label
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: 600,
            color: "#3b4045",
            marginBottom: "6px",
          }}
        >
          Category
        </label>
        <select
          value={formData.category_id}
          onChange={(e) =>
            setFormData({ ...formData, category_id: e.target.value })
          }
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: "4px",
            border: "1px solid #babfc4",
            fontSize: "15px",
          }}
          required
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
      </div>

      <div>
        <label
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: 600,
            color: "#3b4045",
            marginBottom: "6px",
          }}
        >
          Tags (Max 5)
        </label>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          {availableTags.map((tag) => {
            const isSelected = formData.tags.includes(tag.name);
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleTagToggle(tag.name)}
                disabled={!isSelected && formData.tags.length >= 5}
                style={{
                  padding: "4px 10px",
                  borderRadius: "3px",
                  fontSize: "12px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: isSelected ? "#39739d" : "#e1ecf4",
                  color: isSelected ? "#ffffff" : "#39739d",
                  transition: "all 0.2s",
                }}
              >
                {tag.name}
              </button>
            );
          })}
        </div>
        <p style={{ fontSize: "11px", color: "#6a737c", margin: 0 }}>
          Select up to 5 tags to describe what your question is about.
        </p>
      </div>

      <div>
        <label
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: 600,
            color: "#3b4045",
            marginBottom: "6px",
          }}
        >
          Body
        </label>
        <textarea
          value={formData.body}
          onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          rows={10}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "4px",
            border: "1px solid #babfc4",
            resize: "vertical",
            fontSize: "15px",
            fontFamily: "inherit",
            lineHeight: "1.5",
          }}
          placeholder="Explain your problem in detail..."
          required
        />
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
          size="lg"
          style={{ backgroundColor: "#0a95ff", padding: "0.8rem 2rem" }}
        >
          {initialData ? "Update Thread" : "Post Your Question"}
        </Button>
      </div>
    </form>
  );
};
