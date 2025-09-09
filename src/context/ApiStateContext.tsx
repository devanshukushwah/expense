"use client";

import { AppConstants } from "@/common/AppConstants";
import { createContext, useReducer, useContext } from "react";
import { ApiContextType } from "../common/ApiContextType";

type ApiState = {
  loading: {
    fetchSpend: boolean;
  };
};

// Add other action types here as needed

const initialState: ApiState = {
  categories: [
    { title: "TRAVEL", _id: 1 },
    { title: "RENT", _id: 2 },
    { title: "GROCERIES", _id: 3 },
  ],
  loading: {
    fetchSpend: false,
  },
};

function apiReducer(state: ApiState, action: any): ApiState {
  switch (action.type) {
    case ApiContextType.FETCH_SPEND:
      return {
        ...state,
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
