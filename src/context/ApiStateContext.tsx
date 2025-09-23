"use client";

import { Category } from "@/collection/Category.collection";
import { createContext, useContext, useReducer } from "react";
import { ApiContextType } from "../common/ApiContextType";

type ApiState = {
  loading: {
    fetchSpend: boolean;
    fetchOneSpend: boolean;
    addSpend: boolean;
    fetchDashboard: boolean;
    updateSpend: boolean;
  };
  categories: Category[];
  dialog: {
    isOpen: boolean;
    data: any;
    onConfirmCallback: () => void;
  };
};

type ApiAction =
  | { type: ApiContextType.FETCH_SPEND }
  | { type: ApiContextType.START_ADD_SPEND }
  | { type: ApiContextType.STOP_ADD_SPEND }
  | {
      type: ApiContextType.SET_CATEGORIES;
      payload: { categories: Category[] };
    }
  | {
      type: ApiContextType.OPEN_DIALOG;
      payload: { data?: any; onConfirmCallback: () => void };
    };

// Add other action types here as needed

const initialState: ApiState = {
  loading: {
    fetchSpend: true,
    fetchOneSpend: true,
    addSpend: false,
    fetchDashboard: true,
    updateSpend: false,
  },
  categories: [],
  dialog: {
    isOpen: false,
    data: null,
    onConfirmCallback: () => {},
  },
};

function apiReducer(state: ApiState, action: ApiAction): ApiState {
  switch (action.type) {
    case ApiContextType.START_FETCH_SPEND:
      return {
        ...state,
        loading: {
          ...state.loading,
          fetchSpend: true,
        },
      };
    case ApiContextType.STOP_FETCH_SPEND:
      return {
        ...state,
        loading: {
          ...state.loading,
          fetchSpend: false,
        },
      };

    case ApiContextType.START_ADD_SPEND:
      return {
        ...state,
        loading: {
          ...state.loading,
          addSpend: true,
        },
      };
    case ApiContextType.STOP_ADD_SPEND:
      return {
        ...state,
        loading: {
          ...state.loading,
          addSpend: false,
        },
      };
    case ApiContextType.START_FETCH_DASHBOARD:
      return {
        ...state,
        loading: {
          ...state.loading,
          fetchDashboard: true,
        },
      };
    case ApiContextType.STOP_FETCH_DASHBOARD:
      return {
        ...state,
        loading: {
          ...state.loading,
          fetchDashboard: false,
        },
      };

    case ApiContextType.START_UPDATE_SPEND:
      return {
        ...state,
        loading: {
          ...state.loading,
          updateSpend: true,
        },
      };
    case ApiContextType.STOP_UPDATE_SPEND:
      return {
        ...state,
        loading: {
          ...state.loading,
          updateSpend: false,
        },
      };

    case ApiContextType.START_FETCH_ONE_SPEND:
      return {
        ...state,
        loading: {
          ...state.loading,
          fetchOneSpend: true,
        },
      };
    case ApiContextType.STOP_FETCH_ONE_SPEND:
      return {
        ...state,
        loading: {
          ...state.loading,
          fetchOneSpend: false,
        },
      };
    case ApiContextType.SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload.categories,
      };

    case ApiContextType.OPEN_DIALOG:
      return {
        ...state,
        dialog: {
          ...state.dialog,
          isOpen: true,
          data: action.payload.data,
          onConfirmCallback: action.payload.onConfirmCallback,
        },
      };
    case ApiContextType.CLOSE_DIALOG:
      return {
        ...state,
        dialog: {
          ...state.dialog,
          isOpen: false,
          data: null,
          onConfirmCallback: () => {},
        },
      };
    default:
      throw new Error(`Unhandled action: ${action.type}`);
  }
}

const ApiStateContext = createContext<ApiState | undefined>(undefined);
const ApiDispatchContext = createContext<React.Dispatch<ApiAction> | undefined>(
  undefined
);

type ApiContextProviderProps = {
  children: React.ReactNode;
};

export function ApiContextProvider({ children }: ApiContextProviderProps) {
  const [state, dispatch] = useReducer(apiReducer, initialState);

  return (
    <ApiStateContext.Provider value={state}>
      <ApiDispatchContext.Provider value={dispatch}>
        {children}
      </ApiDispatchContext.Provider>
    </ApiStateContext.Provider>
  );
}

export function useApiState() {
  const context = useContext(ApiStateContext);
  if (context === undefined) {
    throw new Error("useApiState must be used within a ApiProvider");
  }
  return context;
}

export function useApiDispatch() {
  const context = useContext(ApiDispatchContext);
  if (context === undefined) {
    throw new Error("useApiDispatch must be used within a ApiProvider");
  }
  return context;
}
