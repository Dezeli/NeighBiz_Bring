import styled from "styled-components";
import { colors } from "../tokens/colors";
import { spacing } from "../tokens/spacing";

const BaseBox = styled.div`
  width: 100%;
  box-sizing: border-box;

  padding: ${spacing.md}px;
  border-radius: 12px;

  display: flex;
  align-items: flex-start;
  gap: ${spacing.sm}px;

  font-size: 0.9rem;
  line-height: 1.45;

  word-break: keep-all;
  overflow-wrap: break-word;
`;

export const ErrorBox = styled(BaseBox)`
  background: ${colors.errorLight};
  color: ${colors.error};
  border: 1px solid ${colors.error}33;
`;

export const SuccessBox = styled(BaseBox)`
  background: ${colors.successLight};
  color: ${colors.success};
  border: 1px solid ${colors.success}33;
`;

export const WarningBox = styled(BaseBox)`
  background: ${colors.warningLight};
  color: ${colors.warning};
  border: 1px solid ${colors.warning}33;
`;

export const InfoBox = styled(BaseBox)`
  background: ${colors.infoLight};
  color: ${colors.info};
  border: 1px solid ${colors.info}33;
`;

export const NeutralBox = styled(BaseBox)`
  background: ${colors.bgSoft};
  color: ${colors.textPrimary};
  border: 1px solid ${colors.textMuted}33;
`;
