import {atom} from 'recoil';

export const userAtom = atom({
  key: 'userAtom',
  default: {
    name: null,
    email: null,
    userId: null,
    isLoggedIn: true
  }
})