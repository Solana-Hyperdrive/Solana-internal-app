import PropTypes from 'prop-types';
import { FC, ReactNode } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';

interface ScrollbarProps {
  className?: string;
  children?: ReactNode;
}

const Scrollbar: FC<ScrollbarProps> = ({ className, children, ...rest }) => {
  return (
    <Scrollbars autoHide universal hideTracksWhenNotNeeded {...rest}>
      {children}
    </Scrollbars>
  );
};

Scrollbar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default Scrollbar;
