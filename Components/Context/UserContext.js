import { createContext } from 'react';

const UserContext = createContext({
  auth: false,
  user: null
});
export default UserContext;