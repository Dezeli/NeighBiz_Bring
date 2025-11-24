import styled from "styled-components";
import { spacing } from "../../tokens/spacing";
import { radius } from "../../tokens/radius";
import { colors } from "../../tokens/colors";
import { typography } from "../../tokens/typography";
import { useId } from "react";

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

const TextareaContainer = styled.div`
  position: relative;
  width: 100%;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  min-height: 110px;

  padding: ${spacing.md}px;

  border-radius: ${radius.sm}px;
  border: 1.5px solid
    ${(props) => (props.error ? colors.error : colors.gray300)};
  background: ${colors.white};
  box-sizing: border-box;

  font-size: ${typography.body.size};
  font-family: ${typography.fontFamily};
  color: ${colors.textPrimary};

  resize: vertical;

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

export default function Textarea({ label, error, ...props }) {
  const id = useId();

  return (
    <Wrapper>
      {label && <Label htmlFor={id}>{label}</Label>}

      <TextareaContainer>
        <StyledTextarea id={id} error={error} {...props} />
      </TextareaContainer>

      {error && <ErrorText>{error}</ErrorText>}
    </Wrapper>
  );
}
