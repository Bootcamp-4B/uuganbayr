"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

const initialFormData = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  birthDate: "",
  profileImage: "",
  profileImagePreview: "",
};

const namePattern = /^[A-Za-zА-Яа-яӨөҮүЁё\s-]+$/;
const nameField = (label) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .regex(namePattern, `${label} cannot contain special characters or numbers.`);

const stepSchemas = {
  1: z.object({
    firstName: nameField("First name"),
    lastName: nameField("Last name"),
    username: z
      .string()
      .trim()
      .min(1, "Username is required.")
      .regex(/^[A-Za-z0-9_]+$/, "Username can only contain letters, numbers, and underscores."),
  }),
  2: z
    .object({
      email: z.email("Please enter a valid email address."),
      phone: z
        .string()
        .trim()
        .min(1, "Phone number is required.")
        .regex(/^[0-9+\-\s()]{6,}$/, "Please enter a valid phone number."),
      password: z.string().min(8, "Password must be at least 8 characters."),
      confirmPassword: z.string().min(1, "Please confirm your password."),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    }),
  3: z.object({
    birthDate: z.string().min(1, "Please select a date."),
    profileImage: z.string().min(1, "Please add a profile image."),
  }),
};

const stepFields = {
  1: [
    ["First name", "firstName"],
    ["Last name", "lastName"],
    ["Username", "username"],
  ],
  2: [
    ["Email", "email", "email"],
    ["Phone number", "phone", "tel"],
    ["Password", "password", "password"],
    ["Confirm password", "confirmPassword", "password"],
  ],
  3: [["Date of birth", "birthDate", "date"]],
};

function getValidationErrors(zodError) {
  return zodError.issues.reduce((errors, issue) => {
    const fieldName = issue.path[0];

    return fieldName && !errors[fieldName]
      ? { ...errors, [fieldName]: issue.message }
      : errors;
  }, {});
}

export default function SignupForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(initialFormData);

  function clearError(name) {
    setErrors((currentErrors) => ({ ...currentErrors, [name]: "" }));
  }

  function updateField(name, value) {
    setFormData((currentFormData) => ({ ...currentFormData, [name]: value }));
    clearError(name);
  }

  function handleChange(event) {
    updateField(event.target.name, event.target.value);
  }

  function handleProfileImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        return;
      }

      setFormData((currentFormData) => ({
        ...currentFormData,
        profileImage: file.name,
        profileImagePreview: reader.result,
      }));
      clearError("profileImage");
    };

    reader.readAsDataURL(file);
  }

  function validateStep() {
    const result = stepSchemas[step].safeParse(formData);

    if (!result.success) {
      setErrors(getValidationErrors(result.error));
      return false;
    }

    setErrors({});
    return true;
  }

  function handleNext(event) {
    event.preventDefault();

    if (!validateStep()) {
      return;
    }

    if (step < 3) {
      setStep(step + 1);
      return;
    }

    router.push("/");
  }

  function handleBack() {
    setErrors({});
    setStep((currentStep) => Math.max(1, currentStep - 1));
  }

  return (
    <main className="signup-page">
      <form className="signup-panel" onSubmit={handleNext}>
        <Image
          src="/pinelogo.png"
          alt="Pinecone logo"
          width={44}
          height={32}
          priority
          className="signup-logo"
        />

        <h1>Join Us!😎</h1>
        <p className="signup-intro">
          Please provide all current information accurately.
        </p>

        <div className="signup-fields">
          {stepFields[step].map(([label, name, type]) => (
            <FormField
              key={name}
              label={label}
              name={name}
              type={type}
              value={formData[name]}
              onChange={handleChange}
              error={errors[name]}
            />
          ))}

          {step === 3 && (
            <ImageUpload
              preview={formData.profileImagePreview}
              error={errors.profileImage}
              onChange={handleProfileImageChange}
            />
          )}
        </div>

        <div className="signup-controls">
          {step > 1 && (
            <button type="button" className="secondary-button" onClick={handleBack}>
              ‹ Back
            </button>
          )}
          <button type="submit" className="primary-button signup-submit">
            {step === 3 ? "Submit" : "Continue"} {step}/3 ›
          </button>
        </div>
      </form>
    </main>
  );
}

function FormField({ label, name, type = "text", value, onChange, error }) {
  return (
    <label className="form-field">
      <span>
        {label} <b>*</b>
      </span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={label}
      />
      {error && <p className="field-message">{error}</p>}
    </label>
  );
}

function ImageUpload({ preview, error, onChange }) {
  return (
    <label className="image-upload">
      <span>
        Profile image <b>*</b>
      </span>
      <input type="file" accept="image/*" onChange={onChange} />
      <span className="image-upload-box">
        {preview ? (
          <Image
            src={preview}
            alt="Profile preview"
            fill
            unoptimized
            className="profile-preview"
          />
        ) : (
          <>
            <span className="add-image-icon">
              <Image src="/image.svg" alt="" width={16} height={16} />
            </span>
            <span>Add image</span>
          </>
        )}
      </span>
      {error && <p className="field-message">{error}</p>}
    </label>
  );
}
