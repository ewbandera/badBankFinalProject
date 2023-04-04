import React from 'react';
import { render, fireEvent,queryByAttribute,waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { act } from 'react-dom/test-utils';

test('TestLoginControlClick', async () => {
  const dom = render(<App />);
  //const {getByText,getByLabelText,getAllByTestId,container} = render(<App/>);
  const getById = queryByAttribute.bind(null, 'id');
  const loginControl = getById(dom.container, 'loginControl');
  fireEvent.click(loginControl);
  await waitFor(() => {
    expect(dom.getByText('Please Login')).toBeInTheDocument()
  })
  
});
test('TestLoginAttempt', async () => {
  let dom = null; 
  act(() => {
    dom = render(<App />);
  });
  const getById = queryByAttribute.bind(null, 'id');
  const loginControl = getById(dom.container, 'loginControl');
  act(() => {
    userEvent.click(loginControl);
  });
 
  await waitFor(() => {
    dom.getByText('Please Login');
    
  }); 
  const loginButton = getById(dom.container,'loginButton');
  const textEmail = getById(dom.container,'email');
  const textPassword = getById(dom.container,'password');
  act(() => {
    userEvent.type(textEmail,'ericbandera@gmail.com');
    userEvent.type(textPassword,'1234');
    userEvent.click(loginButton);

  });


  await waitFor(() => {
    expect(dom.getByText('Success')).toBeInTheDocument()
  })

  //jest.mock('./MyComponent',()=> () => (<div>Hello World</div>))
 
 
});
