import PropTypes from "prop-types";
import styled from "styled-components";

function Avatar({ onlineStyle, size, ...otherProps }) {
  return (
    <StyledAvatar onlineStyle={onlineStyle} size={size}>
      <AvatarImage {...otherProps} />
    </StyledAvatar>
  );
}

export function MultiAvatar({ size, ...otherProps }) {
  return (
    <StyledMultiAvatar size={size}>
      <AvatarImage {...otherProps} />
    </StyledMultiAvatar>
  );
}

const StyledAvatar = styled.div`
  width: ${(props) => (props.size === "small" ? "35px" : "60px")};
  height: ${(props) => (props.size === "small" ? "35px" : "60px")};
  border-radius: 50%;
  overflow: hidden;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

const StyledMultiAvatar = styled(StyledAvatar)`
  transform: scale(1);

  &:not(:first-child) {
    margin-left: -8px;
  }
`;

export default Avatar;
