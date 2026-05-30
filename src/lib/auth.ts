export interface MockUser {
  name: string;
  email: string;
  joined: string;
  avatarSeed: string;
}

const KEY = "tm_mock_user";

export const getUser = (): MockUser | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as MockUser) : null;
  } catch {
    return null;
  }
};

export const setUser = (user: MockUser) => {
  localStorage.setItem(KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("tm-auth-change"));
};

export const clearUser = () => {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("tm-auth-change"));
};