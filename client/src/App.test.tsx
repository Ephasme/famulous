import React from 'react';
import { render } from '@testing-library/react';
import ApiCall from './ApiCall';

test('renders learn react link', () => {
  const { getByText } = render(<ApiCall defaultValue="coucou" />);
  const div = getByText(/coucou/i);
  expect(div).toBeInTheDocument();
});
