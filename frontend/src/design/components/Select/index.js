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

const SelectBox = styled.select`
  width: 100%;
  min-width: 0;
  padding: ${spacing.md}px;
  border-radius: ${radius.sm}px;

  border: 1.5px solid
    ${(props) => (props.error ? colors.error : colors.gray300)};
  background: ${colors.white};
  box-sizing: border-box;

  font-size: ${typography.body.size};
  color: ${colors.textPrimary};
  font-family: ${typography.fontFamily};

  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 2l4 4 4-4' stroke='%238A6E4A' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right ${spacing.md}px center;

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

export default function Select({ label, error, children, ...props }) {
  const id = useId();

  return (
    <Wrapper>
      {label && <Label htmlFor={id}>{label}</Label>}
      <SelectBox id={id} error={error} {...props}>
        {children}
      </SelectBox>
      {error && <ErrorText>{error}</ErrorText>}
    </Wrapper>
  );
}
