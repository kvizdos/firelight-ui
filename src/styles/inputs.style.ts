import { css } from "lit";

export const inputStyles = css`
  input {
    padding: 0.85rem;
    border-radius: 0.5rem;
    border: 1px solid var(--input-border, var(--gray-300, #bdbdbd));
    font-size: 1rem;
    width: 100%;
  }
  input:invalid {
    outline: 1px solid var(--danger-600, #e01e47);
  }

  textarea {
    padding: 0.85rem;
    border-radius: 0.5rem;
    border: 1px solid var(--input-border, var(--gray-300, #bdbdbd));
    font-size: 1rem;
    width: 100%;
    resize: vertical;
  }
`;
