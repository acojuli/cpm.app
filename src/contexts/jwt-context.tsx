import { createContext, useCallback, useEffect, useReducer } from "react";
import type { FC, ReactNode } from "react";
import PropTypes from "prop-types";
import { authApi } from "../services/api-auth";
import { RegisterApiResponse } from "src/services/api-auth";
import { useDispatch } from "../store/index";
import { clearUser, setUser } from "../slices/user-slice";
import { User, UserDetail } from "../types/user-data";
import {
  ACCESS_TOKEN_KEY,
  MOCK_VERIFICATION_TOKEN_KEY,
} from "../services/api-config";
import { UNAUTHORIZED_EVENT } from "../services/api-client";

interface State {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: User | null;
}

export interface AuthContextValue extends State {
  platform: "JWT";
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    firstname: string,
    lastname: string,
    email: string,
    password: string
  ) => Promise<void>;
  refreshUser: () => Promise<UserDetail | null>;
}

interface AuthProviderProps {
  children: ReactNode;
}

enum ActionType {
  INITIALIZE = "INITIALIZE",
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  REGISTER = "REGISTER",
  REFRESH = "REFRESH",
}

type InitializeAction = {
  type: ActionType.INITIALIZE;
  payload: {
    isAuthenticated: boolean;
    user: UserDetail | null;
    token?: string;
  };
};

type LoginAction = {
  type: ActionType.LOGIN;
  payload: {
    user: User;
  };
};

type LogoutAction = {
  type: ActionType.LOGOUT;
};

type RegisterAction = {
  type: ActionType.REGISTER;
  payload: {
    user: User;
  };
};

type RefreshAction = {
  type: ActionType.REFRESH;
  payload: {
    user: UserDetail;
  };
};

type Action =
  | InitializeAction
  | LoginAction
  | LogoutAction
  | RegisterAction
  | RefreshAction;

type Handler = (state: State, action: any) => State;

const initialState: State = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const handlers: Record<ActionType, Handler> = {
  INITIALIZE: (state: State, action: InitializeAction): State => {
    const { isAuthenticated, user, token = "" } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user: user ? { user, token } : null,
    };
  },
  LOGIN: (state: State, action: LoginAction): State => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  LOGOUT: (state: State): State => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
  REGISTER: (state: State, action: RegisterAction): State => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  REFRESH: (state: State, action: RefreshAction): State => ({
    ...state,
    isAuthenticated: true,
    user: {
      user: action.payload.user,
      token: state.user?.token || "",
    },
  }),
};

const reducer = (state: State, action: Action): State =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export const AuthContext = createContext<AuthContextValue>({
  ...initialState,
  platform: "JWT",
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  refreshUser: () => Promise.resolve(null),
});

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const reduxDispatch = useDispatch();

  const logout = useCallback(async (): Promise<void> => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    }

    reduxDispatch(clearUser());
    dispatch({ type: ActionType.LOGOUT });
  }, [reduxDispatch]);

  // Si la API responde 401 con un token vencido, cerramos la sesión.
  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const handleUnauthorized = () => {
      void logout();
    };

    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);

    return () => {
      window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, [logout]);

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      const accessToken =
        typeof window !== "undefined"
          ? window.localStorage.getItem(ACCESS_TOKEN_KEY)
          : null;

      if (!accessToken) {
        dispatch({
          type: ActionType.INITIALIZE,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
        return;
      }

      try {
        const user = await authApi.me();
        reduxDispatch(setUser({ user, token: accessToken }));
        dispatch({
          type: ActionType.INITIALIZE,
          payload: {
            isAuthenticated: true,
            user,
            token: accessToken,
          },
        });
      } catch (err) {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(ACCESS_TOKEN_KEY);
        }
        reduxDispatch(clearUser());
        dispatch({
          type: ActionType.INITIALIZE,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
    // `reduxDispatch` es estable; solo debe correr al montar el provider.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const userData: User = await authApi.login({ email, password });

    if (!userData?.token) {
      throw new Error("La respuesta del servidor no incluyó un token");
    }

    localStorage.setItem(ACCESS_TOKEN_KEY, userData.token);
    reduxDispatch(setUser(userData));
    dispatch({
      type: ActionType.LOGIN,
      payload: { user: userData },
    });
  };

  const register = async (
    firstname: string,
    lastname: string,
    email: string,
    password: string
  ): Promise<void> => {
    const registerResponse: RegisterApiResponse = await authApi.register({
      firstname,
      lastname,
      email,
      password,
    });

    if (!registerResponse) {
      throw new Error("No se pudo crear la cuenta");
    }

    // Solo en desarrollo: guardamos el token que devuelve el mock para
    // mostrarlo en la pantalla de verificación (la API real no lo devuelve).
    if (
      registerResponse.mock_verification_token &&
      typeof window !== "undefined"
    ) {
      window.sessionStorage.setItem(
        MOCK_VERIFICATION_TOKEN_KEY,
        registerResponse.mock_verification_token
      );
    }

    // Registro exitoso: iniciamos sesión automáticamente.
    const userData: User = await authApi.login({ email, password });

    if (!userData?.token) {
      throw new Error("La cuenta se creó pero no se pudo iniciar sesión");
    }

    localStorage.setItem(ACCESS_TOKEN_KEY, userData.token);
    reduxDispatch(setUser(userData));
    dispatch({
      type: ActionType.REGISTER,
      payload: { user: userData },
    });
  };

  const refreshUser = useCallback(async (): Promise<UserDetail | null> => {
    const accessToken =
      typeof window !== "undefined"
        ? window.localStorage.getItem(ACCESS_TOKEN_KEY)
        : null;

    if (!accessToken) {
      return null;
    }

    const user = await authApi.me();
    reduxDispatch(setUser({ user, token: accessToken }));
    dispatch({
      type: ActionType.REFRESH,
      payload: { user },
    });

    return user;
  }, [reduxDispatch]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        platform: "JWT",
        login,
        logout,
        register,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthConsumer = AuthContext.Consumer;
