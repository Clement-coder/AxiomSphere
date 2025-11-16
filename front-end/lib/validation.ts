export interface ValidationRule {
  validate: (value: string) => { valid: boolean; error?: string };
}

export const validationRules = {
  email: {
    validate: (value: string) => {
      if (!value) return { valid: false, error: 'Email is required' };
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return { valid: false, error: 'Invalid email format' };
      }
      return { valid: true };
    },
  },
  password: {
    validate: (value: string) => {
      if (!value) return { valid: false, error: 'Password is required' };
      if (value.length < 8) return { valid: false, error: 'Password must be at least 8 characters' };
      if (!/[A-Z]/.test(value)) return { valid: false, error: 'Password must contain an uppercase letter' };
      if (!/[0-9]/.test(value)) return { valid: false, error: 'Password must contain a number' };
      return { valid: true };
    },
  },
  ruleName: {
    validate: (value: string) => {
      if (!value) return { valid: false, error: 'Rule name is required' };
      if (value.length < 3) return { valid: false, error: 'Rule name must be at least 3 characters' };
      if (value.length > 50) return { valid: false, error: 'Rule name must be less than 50 characters' };
      return { valid: true };
    },
  },
  ruleCondition: {
    validate: (value: string) => {
      if (!value) return { valid: false, error: 'Condition is required' };
      return { valid: true };
    },
  },
  ruleAction: {
    validate: (value: string) => {
      if (!value) return { valid: false, error: 'Action is required' };
      return { valid: true };
    },
  },
};
