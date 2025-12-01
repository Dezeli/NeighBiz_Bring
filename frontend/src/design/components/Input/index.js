import styled from "styled-components";
import { spacing } from "../../tokens/spacing";
import { radius } from "../../tokens/radius";
import { colors } from "../../tokens/colors";
import { typography } from "../../tokens/typography";
import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs}px;
  width: 100%;
`;

const Label = styled.label`
  font-size: ${typography.bodyBold.size};
  font-weight: ${typography.bodyBold.weight};
  color: ${colors.textPrimary};
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const InputBox = styled.input`
  width: 100%;
  padding: ${spacing.md}px;

  padding-right: ${(props) =>
    props.hasUnit ? "12px" : spacing.md}px;

  border-radius: ${radius.sm}px;
  border: 1.5px solid
    ${(props) => (props.error ? colors.error : colors.gray300)};
  background: ${colors.white};
  box-sizing: border-box;

  font-size: ${typography.body.size};
  color: ${colors.textPrimary};
  font-family: ${typography.fontFamily};

  &::placeholder {
    color: ${colors.textMuted};
  }

  &:focus {
    border-color: ${(props) =>
      props.error ? colors.error : colors.primary};
    outline: none;
  }
`;

const IconButton = styled.button`
  position: absolute;
  right: ${spacing.sm}px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  color: ${colors.gray500};
`;

const Unit = styled.span`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: ${typography.small.size};  /* 기존 body → small 로 축소 */
  color: ${colors.textSecondary};
  opacity: 0.85;                       /* 살짝 연하게 */
  pointer-events: none;                /* 클릭 방해 없음 */
`;

const ErrorText = styled.span`
  font-size: ${typography.small.size};
  color: ${colors.error};
`;

export default function Input({ label, error, type = "text", unit, ...props }) {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const displayType = isPassword && showPassword ? "text" : type;

  return (
    <Wrapper>
      {label && <Label htmlFor={id}>{label}</Label>}

      <InputContainer>
        <InputBox
          id={id}
          error={error}
          type={displayType}
          isPassword={isPassword}
          hasUnit={!!unit}
          {...props}
        />

        {/* 패스워드 토글 */}
        {isPassword && (
          <IconButton type="button" onClick={() => setShowPassword((v) => !v)}>
            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </IconButton>
        )}

        {/* 단위 표시 */}
        {!isPassword && unit && <Unit>{unit}</Unit>}
      </InputContainer>

      {error && <ErrorText>{error}</ErrorText>}
    </Wrapper>
  );
}
