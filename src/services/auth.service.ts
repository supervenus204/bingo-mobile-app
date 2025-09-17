import { API_BASE_URL } from '../constants/config';
import { parseJsonSafe } from '../utils';

export const signInService = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Failed to sign in');
  }

  const data = await parseJsonSafe(response);
  return data;
};

export const signUpService = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to sign up');
  }

  const data = await parseJsonSafe(response);
  return data;
};
