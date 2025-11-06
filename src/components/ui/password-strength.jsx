import { useMemo } from "react";
import { Check, X } from "lucide-react";

export const PasswordStrength = ({ password }) => {
  const strength = useMemo(() => {
    if (!password) return { score: 0, label: "", color: "" };

    let score = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };

    // Calculate score
    if (checks.length) score++;
    if (checks.uppercase) score++;
    if (checks.lowercase) score++;
    if (checks.number) score++;
    if (checks.special) score++;

    // Determine strength label and color
    let label = "";
    let color = "";
    if (score <= 2) {
      label = "Weak";
      color = "bg-red-500";
    } else if (score === 3) {
      label = "Fair";
      color = "bg-yellow-500";
    } else if (score === 4) {
      label = "Good";
      color = "bg-blue-500";
    } else {
      label = "Strong";
      color = "bg-green-500";
    }

    return { score, label, color, checks };
  }, [password]);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Strength bar */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-all ${
              level <= strength.score ? strength.color : "bg-gray-200 dark:bg-gray-700"
            }`}
          />
        ))}
      </div>

      {/* Strength label */}
      <p className="text-sm font-medium">
        Password strength: <span className={`${strength.color.replace('bg-', 'text-')}`}>{strength.label}</span>
      </p>

      {/* Requirements checklist */}
      <div className="text-xs space-y-1">
        <RequirementItem met={strength.checks.length} text="At least 8 characters" />
        <RequirementItem met={strength.checks.uppercase} text="One uppercase letter" />
        <RequirementItem met={strength.checks.lowercase} text="One lowercase letter" />
        <RequirementItem met={strength.checks.number} text="One number" />
        <RequirementItem met={strength.checks.special} text="One special character" />
      </div>
    </div>
  );
};

const RequirementItem = ({ met, text }) => {
  return (
    <div className={`flex items-center gap-1 ${met ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}>
      {met ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      <span>{text}</span>
    </div>
  );
};
