import { Billboard } from "@/types";

interface CollorEffectProps {
  children: string | undefined;
  billboardData?: Billboard;
}

const ColorEffect: React.FC<CollorEffectProps> = ({ children, billboardData }) => {
  // Debugging
  console.log('ColorEffect - billboardData:', billboardData);
  console.log('ColorEffect - labelColorType:', billboardData?.labelColorType);
  console.log('ColorEffect - labelSolidColor:', billboardData?.labelSolidColor);
  console.log('ColorEffect - labelGradientStart:', billboardData?.labelGradientStart);
  console.log('ColorEffect - labelGradientEnd:', billboardData?.labelGradientEnd);
  console.log('ColorEffect - labelGradientDirection:', billboardData?.labelGradientDirection);

  // If no billboard data or no color type specified, use default
  if (!billboardData || !billboardData.labelColorType) {
    console.log('ColorEffect - Using default gradient');
    return (
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-accent">
        {children}
      </span>
    );
  }

  // Handle solid color
  if (billboardData.labelColorType === "solid") {
    return (
      <span style={{ color: billboardData.labelSolidColor || "#000000" }}>
        {children}
      </span>
    );
  }

  // Handle gradient
  if (billboardData.labelColorType === "gradient") {
    const gradientDirection = billboardData.labelGradientDirection || "to-right";
    const startColor = billboardData.labelGradientStart || "#000000";
    const endColor = billboardData.labelGradientEnd || "#ffffff";
    
    return (
      <span 
        className="text-transparent bg-clip-text"
        style={{
          backgroundImage: `linear-gradient(${gradientDirection.replace("-", " ")}, ${startColor}, ${endColor})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {children}
      </span>
    );
  }

  // Fallback to default
  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-accent">
      {children}
    </span>
  );
};

export default ColorEffect;
