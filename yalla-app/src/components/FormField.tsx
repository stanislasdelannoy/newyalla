import "./style/FormField.css";

type BaseProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string | null;
  required?: boolean;
};

type InputFieldProps = BaseProps & {
  as?: "input" | "textarea" | "select";
  type?: "text" | "email" | "password" | "date";
  options?: { value: string; label: string }[]; // pour <select>
};

export function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  required,
  as = "input",
  type = "text",
  options,
}: InputFieldProps) {
  const baseClass = "form-field-control";

  const control =
    as === "textarea" ? (
      <textarea
        id={name}
        name={name}
        className={baseClass}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
      />
    ) : as === "select" ? (
      <select
        id={name}
        name={name}
        className={baseClass}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder || "Sélectionner..."}</option>
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        id={name}
        name={name}
        className={baseClass}
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(e) => onChange(e.target.value)}
      />
    );

  return (
    <div className="form-field">
      <label htmlFor={name} className="form-field-label">
        {label}
        {required && <span className="form-field-required">*</span>}
      </label>
      {control}
      {error && <p className="form-field-error">{error}</p>}
    </div>
  );
}
