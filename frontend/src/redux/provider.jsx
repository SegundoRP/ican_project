'use client';

import { makeStore } from './store';
import { Provider } from 'react-redux';

export default function CustomProvider({ children }) {
  return <Provider store={makeStore()}>{children}</Provider>
}
