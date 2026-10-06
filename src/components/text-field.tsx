type TextFieldProps = {
  label: string;
  name: string;
  type?: "text" | "email" | "password";
  error?: string;
  autoComplete?: string;
  defaultValue?: string;
};

export function TextField({ label, name, type = "text", error, autoComplete, defaultValue }: TextFieldProps) {
  const errorId = `${name}-error`;

  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
      />
      {error ? (
        <p id={errorId} className="field-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
