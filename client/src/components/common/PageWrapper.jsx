import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setAppState } from '../../redux/features/appStateSlice.js';

const PageWrapper = ({ state, children }) => {
  const dispatch = useDispatch();
  window.scrollTo(0, 0);
  useEffect(() => {
    dispatch(setAppState);
  }, [state]);

  return children;
};

export default PageWrapper;
