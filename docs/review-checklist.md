# Code Review Checklist

## Checklist

- [ ] Changed code follows repository naming and formatting conventions.
- [ ] React state is owned by the nearest component that needs it and is not
      mutated directly.
- [ ] Controlled inputs and custom-element events preserve the displayed value.
- [ ] Interactive controls have accessible names, labels, and keyboard behavior.
- [ ] New asynchronous work handles failures without silent fallback behavior.
- [ ] User-controlled values are validated before they reach external systems,
      HTML, or persistence.
- [ ] The change does not introduce secrets, unsafe HTML, injection vectors, or
      unnecessary client-side persistence.
- [ ] The PR includes focused validation for changed behavior or explains why
      existing checks are sufficient.
- [ ] The summary identifies the problem, design approach, review risks,
      assumptions, and out-of-scope work.
