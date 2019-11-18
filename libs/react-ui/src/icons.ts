import { IconType } from "react-icons";
import styled from "styled-components";

import { FaCheck, FaPlus, FaSignInAlt, FaTimes, FaTrash } from "react-icons/fa";

const icon = (Icon: IconType) => styled(Icon).attrs({
  className: "icon"
})`
  vertical-align: middle;
`;

export const AddIcon = icon(FaPlus);
export const DeleteIcon = icon(FaTrash);
export const RemoveIcon = icon(FaTimes);
export const SignInIcon = icon(FaSignInAlt);
export const TickIcon = icon(FaCheck);
