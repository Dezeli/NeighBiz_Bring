import styled from "styled-components";
import { spacing } from "../../tokens/spacing";
import { radius } from "../../tokens/radius";
import { colors } from "../../tokens/colors";
import { typography } from "../../tokens/typography";
import { useId } from "react";

/*
<Input
  label="전화번호"
  placeholder="010-1234-5678"
  error="전화번호 형식이 올바르지 않습니다."
/>
*/

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

const InputBox = styled.input`
  width: 100%;
  padding: ${spacing.md}px;
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

const ErrorText = styled.span`
  font-size: ${typography.small.size};
  color: ${colors.error};
`;

export default function Input({ label, error, ...props }) {
  const id = useId();

  return (
    <Wrapper>
      {label && <Label htmlFor={id}>{label}</Label>}

      <InputBox id={id} error={error} {...props} />

      {error && <ErrorText>{error}</ErrorText>}
    </Wrapper>
  );
}
