"use client";

import { AppConstants } from "@/common/AppConstants";
import { createContext, useReducer, useContext } from "react";
import { ApiContextType } from "../common/ApiContextType";
import { Category } from "@/collection/Category.collection";

type ApiState = {
  loading: {
    fetchSpend: boolean;
    addSpend: boolean;
  };
  categories: Category[];
};

// Add other action types here as needed

const initialState: ApiState = {
  loading: {
    fetchSpend: false,
    addSpend: false,
  },
  categories: [],
};

function apiReducer(state: ApiState, action: any): ApiState {
  switch (action.type) {
    case ApiContextType.FETCH_SPEND:
      return {
        ...state,
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
    case ApiContextType.SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload.categories,
      };
    default:
      throw new Error(`Unhandled action: ${(action as any).type}`);
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
